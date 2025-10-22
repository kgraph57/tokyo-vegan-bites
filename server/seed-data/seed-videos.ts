import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { restaurants, videos } from "../../drizzle/schema";

/**
 * Seed script to populate the database with video data
 * Run with: tsx server/seed-data/seed-videos.ts
 */

async function seedVideos() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🌱 Starting video data seeding...");

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    // Get all restaurants
    const allRestaurants = await db.select().from(restaurants);
    console.log(`📊 Found ${allRestaurants.length} restaurants`);

    let videoCount = 0;

    for (const restaurant of allRestaurants) {
      // Create 1-3 videos per restaurant
      const numVideos = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numVideos; i++) {
        const videoId = `${restaurant.id}-video-${i + 1}`;
        
        try {
          await db.insert(videos).values({
            id: videoId,
            restaurantId: restaurant.id,
            url: `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`, // Sample video
            thumbnail: restaurant.heroImage || "/images/placeholder.jpg",
            source: "upload",
            sourceUrl: restaurant.website || null,
            title: `${restaurant.name} - Video ${i + 1}`,
            duration: Math.floor(Math.random() * 60) + 30, // 30-90 seconds
            viewCount: Math.floor(Math.random() * 1000),
          }).onConflictDoUpdate({
            target: videos.id,
            set: {
              url: `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
              thumbnail: restaurant.heroImage || "/images/placeholder.jpg",
            },
          });

          videoCount++;
        } catch (error) {
          console.error(`  ❌ Failed to insert video ${videoId}:`, error);
        }
      }

      console.log(`  ✅ ${restaurant.name} (${numVideos} videos)`);
    }

    console.log(`\n✨ Video seeding completed successfully!`);
    console.log(`📊 Total videos seeded: ${videoCount}`);
    console.log(`🎉 Seeding process finished!`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

seedVideos().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

