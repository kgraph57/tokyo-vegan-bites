import { drizzle } from "drizzle-orm/mysql2";
import { videos } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function fixVideoIds() {
  console.log("🔄 Fixing video restaurant IDs...");

  const updates = [
    { videoId: "video-ainsoph-1", correctRestaurantId: "ain-soph-journey" },
    { videoId: "video-ainsoph-2", correctRestaurantId: "ain-soph-journey" },
    { videoId: "video-lovinghut-1", correctRestaurantId: "loving-hut-ikebukuro" },
  ];

  for (const update of updates) {
    await db.update(videos)
      .set({ restaurantId: update.correctRestaurantId })
      .where(eq(videos.id, update.videoId));
    console.log(`✓ Updated ${update.videoId} -> ${update.correctRestaurantId}`);
  }

  console.log("✅ Video restaurant IDs fixed!");
}

fixVideoIds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Fix failed:", error);
    process.exit(1);
  });

