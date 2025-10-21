import { drizzle } from "drizzle-orm/mysql2";
import { videos } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function updateVideos() {
  console.log("🔄 Updating videos for real restaurants...");

  // Clear existing videos
  await db.delete(videos);
  console.log("✓ Cleared old videos");

  const videoData = [
    {
      id: "video-ainsoph-1",
      restaurantId: "ainsoph-journey-shinjuku",
      title: "Heavenly Vegan Pancakes at AIN SOPH Journey Shinjuku",
      url: "https://www.youtube.com/watch?v=lb3rj4ji7WQ",
      thumbnail: "/images/ainsoph-1.jpg",
      platform: "youtube",
      viewCount: 15000,
    },
    {
      id: "video-ainsoph-2",
      restaurantId: "ainsoph-journey-shinjuku",
      title: "Rating Vegan Restaurants in Japan - Ain Soph Journey Review",
      url: "https://www.youtube.com/watch?v=xWL_m2e23ec",
      thumbnail: "/images/ainsoph-2.webp",
      platform: "youtube",
      viewCount: 8500,
    },
    {
      id: "video-tsramen-1",
      restaurantId: "ts-tantan-tokyo",
      title: "Best Vegan Ramen in Tokyo Station - T's TanTan",
      url: "https://www.youtube.com/watch?v=JpgVrocNo8Y",
      thumbnail: "/images/tsramen-1.jpg",
      platform: "youtube",
      viewCount: 45000,
    },
    {
      id: "video-tsramen-2",
      restaurantId: "ts-tantan-tokyo",
      title: "5 Must-Try Vegan Spots in Tokyo - T's TanTan Featured",
      url: "https://www.youtube.com/watch?v=Imq2hYnqkAM",
      thumbnail: "/images/tsramen-1.jpg",
      platform: "youtube",
      viewCount: 32000,
    },
    {
      id: "video-8ablish-1",
      restaurantId: "8ablish-azabudai",
      title: "Organic Vegan Burger at 8ablish Azabudai Hills",
      url: "https://www.youtube.com/watch?v=8XvqeogUWZM",
      thumbnail: "/images/8ablish-1.jpg",
      platform: "youtube",
      viewCount: 12000,
    },
    {
      id: "video-lovinghut-1",
      restaurantId: "loving-hut-nishi-nippori",
      title: "Exploring Tokyo's Best Vegan Spots - Loving Hut",
      url: "https://www.tiktok.com/@jessiefinds/video/7499304580547661087",
      thumbnail: "/images/lovinghut-1.jpeg",
      platform: "tiktok",
      viewCount: 28000,
    },
    {
      id: "video-nagi-1",
      restaurantId: "nagi-shokudo-shibuya",
      title: "Healthy Macrobiotic Lunch in Shibuya - Nagi Shokudo",
      url: "https://www.tiktok.com/@akana_official/video/7509577645554699563",
      thumbnail: "/images/nagi-1.jpg",
      platform: "tiktok",
      viewCount: 19000,
    },
  ];

  for (const video of videoData) {
    await db.insert(videos).values(video);
    console.log(`✓ Added video: ${video.title}`);
  }

  console.log("✅ Videos updated successfully!");
}

updateVideos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  });

