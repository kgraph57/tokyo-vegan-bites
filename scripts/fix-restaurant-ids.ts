import { drizzle } from "drizzle-orm/mysql2";
import { videos, restaurants } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function fixIds() {
  console.log("🔄 Fixing restaurant IDs in videos...");

  // Get all restaurants
  const allRestaurants = await db.select().from(restaurants);
  console.log("Found restaurants:", allRestaurants.map(r => r.id));

  // Get all videos
  const allVideos = await db.select().from(videos);
  console.log("\nFound videos:", allVideos.length);

  // Map of incorrect IDs to correct IDs
  const idMap: Record<string, string> = {
    "ainsoph-journey-shinjuku": "ainsoph-journey-shinjuku",
    "ts-tantan-tokyo": "ts-tantan-tokyo",
    "8ablish-azabudai": "8ablish-omotesando",  // This was wrong
    "saido-jiyugaoka": "saido-jiyugaoka",
    "loving-hut-nishi-nippori": "loving-hut-nishi-nippori",
    "nagi-shokudo-shibuya": "nagi-shokudo-shibuya",
  };

  for (const video of allVideos) {
    const correctId = idMap[video.restaurantId];
    if (correctId && correctId !== video.restaurantId) {
      await db.update(videos)
        .set({ restaurantId: correctId })
        .where(eq(videos.id, video.id));
      console.log(`✓ Updated video ${video.id}: ${video.restaurantId} → ${correctId}`);
    } else if (!correctId) {
      console.log(`⚠ Video ${video.id} has unknown restaurantId: ${video.restaurantId}`);
    }
  }

  console.log("✅ Restaurant IDs fixed!");
}

fixIds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Fix failed:", error);
    process.exit(1);
  });

