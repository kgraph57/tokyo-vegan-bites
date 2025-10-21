import { drizzle } from "drizzle-orm/mysql2";
import { restaurants, videos } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database with real video URLs...");

  // Clear existing data
  await db.delete(videos);
  console.log("✓ Cleared videos");

  // Get all restaurants
  const allRestaurants = await db.select().from(restaurants);
  console.log(`✓ Found ${allRestaurants.length} restaurants`);

  // Video data with real YouTube/TikTok URLs
  const videoData = [
    {
      id: "video-ainsoph-1",
      restaurantId: allRestaurants.find(r => r.name === "Ain Soph Journey")?.id || allRestaurants[0].id,
      title: "Heavenly Vegan Pancakes at AIN SOPH Journey",
      url: "https://www.youtube.com/watch?v=lb3rj4ji7WQ",
      thumbnail: "/images/ainsoph-1.jpg",
      platform: "youtube",
      viewCount: 15000,
    },
    {
      id: "video-ainsoph-2",
      restaurantId: allRestaurants.find(r => r.name === "Ain Soph Journey")?.id || allRestaurants[0].id,
      title: "Rating Vegan Restaurants in Japan - Ain Soph Journey",
      url: "https://www.youtube.com/watch?v=xWL_m2e23ec",
      thumbnail: "/images/ainsoph-2.webp",
      platform: "youtube",
      viewCount: 8500,
    },
    {
      id: "video-tsramen-1",
      restaurantId: allRestaurants.find(r => r.name === "T's たんたん")?.id || allRestaurants[1].id,
      title: "Best Vegan Ramen in Tokyo Station - T's TanTan",
      url: "https://www.youtube.com/watch?v=JpgVrocNo8Y",
      thumbnail: "/images/tsramen-1.jpg",
      platform: "youtube",
      viewCount: 45000,
    },
    {
      id: "video-tsramen-2",
      restaurantId: allRestaurants.find(r => r.name === "T's たんたん")?.id || allRestaurants[1].id,
      title: "5 Must-Try Vegan Spots in Tokyo - T's TanTan",
      url: "https://www.youtube.com/watch?v=Imq2hYnqkAM",
      thumbnail: "/images/tsramen-1.jpg",
      platform: "youtube",
      viewCount: 32000,
    },
    {
      id: "video-8ablish-1",
      restaurantId: allRestaurants.find(r => r.name === "8ablish")?.id || allRestaurants[3].id,
      title: "Best Vegan Burger in Tokyo - 8ablish Omotesando",
      url: "https://www.youtube.com/watch?v=8XvqeogUWZM",
      thumbnail: "/images/8ablish-1.jpg",
      platform: "youtube",
      viewCount: 12000,
    },
    {
      id: "video-lovinghut-1",
      restaurantId: allRestaurants.find(r => r.name === "Loving Hut Tokyo")?.id || allRestaurants[4].id,
      title: "Exploring Tokyo's Best Vegan Spots - Loving Hut",
      url: "https://www.tiktok.com/@jessiefinds/video/7499304580547661087",
      thumbnail: "/images/lovinghut-1.jpeg",
      platform: "tiktok",
      viewCount: 28000,
    },
    {
      id: "video-nagi-1",
      restaurantId: allRestaurants.find(r => r.name === "なぎ食堂")?.id || allRestaurants[5].id,
      title: "Vegan Macrobiotic Lunch in Shibuya - Nagi Shokudo",
      url: "https://www.tiktok.com/@akana_official/video/7509577645554699563",
      thumbnail: "/images/nagi-1.jpg",
      platform: "tiktok",
      viewCount: 19000,
    },
  ];

  // Insert videos
  for (const video of videoData) {
    await db.insert(videos).values(video);
    console.log(`✓ Added video: ${video.title}`);
  }

  console.log("✅ Database seeded successfully with real video URLs!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

