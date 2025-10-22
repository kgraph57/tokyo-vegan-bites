import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { restaurants } from "../../drizzle/schema";
import { extendedRestaurants } from "./restaurants-extended";

/**
 * Seed script to populate the database with extended restaurant data
 * Run with: tsx server/seed-data/seed-restaurants.ts
 */

async function seedRestaurants() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🌱 Starting restaurant data seeding...");
  console.log(`📊 Total restaurants to seed: ${extendedRestaurants.length}`);

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    // Insert restaurants in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < extendedRestaurants.length; i += batchSize) {
      const batch = extendedRestaurants.slice(i, i + batchSize);
      
      console.log(`\n📥 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(extendedRestaurants.length / batchSize)}...`);
      
      for (const restaurant of batch) {
        try {
          await db.insert(restaurants).values(restaurant).onConflictDoUpdate({
            target: restaurants.id,
            set: {
              name: restaurant.name,
              nameJa: restaurant.nameJa,
              address: restaurant.address,
              lat: restaurant.lat,
              lng: restaurant.lng,
              veganLevel: restaurant.veganLevel,
              cuisineTypes: restaurant.cuisineTypes,
              priceRange: restaurant.priceRange,
              features: restaurant.features,
              instagram: restaurant.instagram,
              website: restaurant.website,
              phone: restaurant.phone,
              hours: restaurant.hours,
              description: restaurant.description,
              descriptionJa: restaurant.descriptionJa,
              heroImage: restaurant.heroImage,
              updatedAt: new Date(),
            },
          });
          console.log(`  ✅ ${restaurant.name} (${restaurant.id})`);
        } catch (error) {
          console.error(`  ❌ Failed to insert ${restaurant.name}:`, error);
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("\n✨ Restaurant seeding completed successfully!");
    console.log(`📊 Total restaurants seeded: ${extendedRestaurants.length}`);
    
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed function
seedRestaurants()
  .then(() => {
    console.log("\n🎉 Seeding process finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding process failed:", error);
    process.exit(1);
  });

