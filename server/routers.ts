import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  restaurants: router({
    list: publicProcedure.query(async () => {
      return await db.getAllRestaurants();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getRestaurantById(input.id);
      }),

    search: publicProcedure
      .input(z.object({
        veganLevel: z.string().optional(),
        cuisineType: z.string().optional(),
        priceRange: z.string().optional(),
        features: z.array(z.string()).optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchRestaurants(input);
      }),
  }),

  videos: router({
    list: publicProcedure.query(async () => {
      return await db.getAllVideos();
    }),

    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.string() }))
      .query(async ({ input }) => {
        return await db.getVideosByRestaurantId(input.restaurantId);
      }),
  }),

  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBookmarks(ctx.user.id);
    }),

    add: protectedProcedure
      .input(z.object({ restaurantId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return await db.addBookmark(ctx.user.id, input.restaurantId);
      }),

    remove: protectedProcedure
      .input(z.object({ restaurantId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeBookmark(ctx.user.id, input.restaurantId);
        return { success: true };
      }),

    check: protectedProcedure
      .input(z.object({ restaurantId: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.isBookmarked(ctx.user.id, input.restaurantId);
      }),
  }),

  menuItems: router({
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.string() }))
      .query(async ({ input }) => {
        return await db.getMenuItemsByRestaurantId(input.restaurantId);
      }),
  }),

  reviews: router({
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.string() }))
      .query(async ({ input }) => {
        return await db.getRestaurantReviews(input.restaurantId);
      }),

    add: protectedProcedure
      .input(z.object({
        restaurantId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.addReview(ctx.user.id, input.restaurantId, input.rating, input.comment);
      }),
  }),

  ai: router({
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        userLocation: z.object({
          lat: z.number(),
          lng: z.number(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const restaurants = await db.getAllRestaurants();
        
        const restaurantData = restaurants.map(r => ({
          id: r.id,
          name: r.name,
          nameJa: r.nameJa,
          address: r.address,
          veganLevel: r.veganLevel,
          cuisineTypes: JSON.parse(r.cuisineTypes || "[]"),
          priceRange: r.priceRange,
          features: JSON.parse(r.features || "[]"),
          description: r.description,
        }));

        const systemPrompt = `You are an expert on vegan and vegetarian restaurants in Tokyo.
Your role is to help travelers find the perfect restaurant based on their preferences.

Available restaurants:
${JSON.stringify(restaurantData, null, 2)}

User's query: ${input.query}

Please recommend the best restaurants based on the user's question.
Return your response in JSON format with the following structure:
{
  "recommendations": [
    {
      "restaurant_id": "...",
      "reason": "Brief explanation why this restaurant matches the query"
    }
  ],
  "message": "A friendly message to the user explaining your recommendations"
}

Important:
- Recommend 1-3 restaurants that best match the query
- Consider vegan level, cuisine type, location, and features
- Be conversational and helpful in your message
- If the query is unclear, ask for clarification in the message`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.query },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "restaurant_recommendations",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    recommendations: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          restaurant_id: { type: "string" },
                          reason: { type: "string" },
                        },
                        required: ["restaurant_id", "reason"],
                        additionalProperties: false,
                      },
                    },
                    message: { type: "string" },
                  },
                  required: ["recommendations", "message"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          if (!content || typeof content !== 'string') {
            throw new Error("No content in AI response");
          }

          const result = JSON.parse(content);
          
          // Fetch full restaurant details for recommendations
          const recommendedRestaurants = await Promise.all(
            result.recommendations.map(async (rec: any) => {
              const restaurant = await db.getRestaurantById(rec.restaurant_id);
              return {
                ...restaurant,
                reason: rec.reason,
              };
            })
          );

          return {
            message: result.message,
            restaurants: recommendedRestaurants.filter(r => r !== undefined),
          };
        } catch (error) {
          console.error("AI search error:", error);
          return {
            message: "I'm sorry, I encountered an error processing your request. Please try again.",
            restaurants: [],
          };
        }
      }),

    analyzeImage: publicProcedure
      .input(z.object({
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are a food expert specializing in vegan and vegetarian cuisine. Analyze food images and determine if they are vegan, vegetarian, or contain animal products.",
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Analyze this food image and determine if it is vegan, vegetarian, or contains animal products.

Please identify:
1. Main ingredients visible in the image
2. Possible hidden ingredients (e.g., fish broth, egg, dairy)
3. Vegan status: Vegan / Vegetarian / Contains Animal Products / Uncertain

Return your response in JSON format.`,
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: input.imageUrl,
                      detail: "high",
                    },
                  },
                ],
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "food_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    ingredients: {
                      type: "array",
                      items: { type: "string" },
                    },
                    hidden_ingredients: {
                      type: "array",
                      items: { type: "string" },
                    },
                    vegan_status: {
                      type: "string",
                      enum: ["Vegan", "Vegetarian", "Contains Animal Products", "Uncertain"],
                    },
                    confidence: {
                      type: "string",
                      enum: ["high", "medium", "low"],
                    },
                    explanation: { type: "string" },
                  },
                  required: ["ingredients", "hidden_ingredients", "vegan_status", "confidence", "explanation"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          if (!content || typeof content !== 'string') {
            throw new Error("No content in AI response");
          }

          return JSON.parse(content);
        } catch (error) {
          console.error("Image analysis error:", error);
          throw new Error("Failed to analyze image. Please try again.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

