import { drizzle } from "drizzle-orm/mysql2";
import { menuItems as menuItemsTable, reviews as reviewsTable, users } from "../../drizzle/schema";
import { menuItems, reviews } from "./menus-and-reviews";

/**
 * Seed script to populate the database with menu items and reviews
 * Run with: tsx server/seed-data/seed-menus-reviews.ts
 */

// Sample users for reviews
const sampleUsers = [
  {
    id: "user-ken-okamoto",
    name: "Ken Okamoto",
    email: "ken@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-yuki-tanaka",
    name: "Yuki Tanaka",
    email: "yuki@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-takeshi-yamada",
    name: "Takeshi Yamada",
    email: "takeshi@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-emily-chen",
    name: "Emily Chen",
    email: "emily@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-hiroshi-sato",
    name: "Hiroshi Sato",
    email: "hiroshi@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-maria-garcia",
    name: "Maria Garcia",
    email: "maria@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
  {
    id: "user-kenji-nakamura",
    name: "Kenji Nakamura",
    email: "kenji@example.com",
    loginMethod: "oauth",
    role: "user" as const,
  },
];

async function seedMenusAndReviews() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🌱 Starting menu items and reviews seeding...");
  console.log(`📊 Total menu items to seed: ${menuItems.length}`);
  console.log(`📊 Total reviews to seed: ${reviews.length}`);

  const db = drizzle(process.env.DATABASE_URL);

  try {
    // First, create sample users
    console.log("\n👥 Creating sample users...");
    for (const user of sampleUsers) {
      try {
        await db.insert(users).values(user).onDuplicateKeyUpdate({
          set: {
            name: user.name,
            email: user.email,
          },
        });
        console.log(`  ✅ ${user.name} (${user.id})`);
      } catch (error) {
        console.error(`  ❌ Failed to insert user ${user.name}:`, error);
      }
    }

    // Insert menu items
    console.log("\n🍽️  Inserting menu items...");
    const menuBatchSize = 10;
    for (let i = 0; i < menuItems.length; i += menuBatchSize) {
      const batch = menuItems.slice(i, i + menuBatchSize);
      
      console.log(`\n📥 Inserting batch ${Math.floor(i / menuBatchSize) + 1}/${Math.ceil(menuItems.length / menuBatchSize)}...`);
      
      for (const item of batch) {
        try {
          await db.insert(menuItemsTable).values({
            ...item,
            createdAt: new Date(),
          }).onDuplicateKeyUpdate({
            set: {
              name: item.name,
              nameJa: item.nameJa,
              description: item.description,
              descriptionJa: item.descriptionJa,
              price: item.price,
              category: item.category,
              image: item.image,
              isVegan: item.isVegan,
              allergens: item.allergens,
            },
          });
          console.log(`  ✅ ${item.name} (${item.restaurantId})`);
        } catch (error) {
          console.error(`  ❌ Failed to insert menu item ${item.name}:`, error);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Insert reviews
    console.log("\n⭐ Inserting reviews...");
    const reviewBatchSize = 10;
    for (let i = 0; i < reviews.length; i += reviewBatchSize) {
      const batch = reviews.slice(i, i + reviewBatchSize);
      
      console.log(`\n📥 Inserting batch ${Math.floor(i / reviewBatchSize) + 1}/${Math.ceil(reviews.length / reviewBatchSize)}...`);
      
      for (const review of batch) {
        try {
          await db.insert(reviewsTable).values({
            ...review,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          }).onDuplicateKeyUpdate({
            set: {
              rating: review.rating,
              comment: review.comment,
            },
          });
          console.log(`  ✅ Review by ${review.userId} for ${review.restaurantId} (${review.rating}⭐)`);
        } catch (error) {
          console.error(`  ❌ Failed to insert review:`, error);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log("\n✨ Menu items and reviews seeding completed successfully!");
    console.log(`📊 Total menu items seeded: ${menuItems.length}`);
    console.log(`📊 Total reviews seeded: ${reviews.length}`);
    
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed function
seedMenusAndReviews()
  .then(() => {
    console.log("\n🎉 Seeding process finished!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding process failed:", error);
    process.exit(1);
  });

