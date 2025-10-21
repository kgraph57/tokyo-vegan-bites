import { drizzle } from "drizzle-orm/mysql2";
import { videos } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function updateAllThumbnails() {
  console.log("🖼️  Updating all video thumbnails with food images...");

  const updates = [
    // AIN SOPH Journey - Pancakes
    { videoId: "video-ainsoph-1", thumbnail: "/images/ainsoph-pancake-new.jpeg" },
    // AIN SOPH Journey - Burger
    { videoId: "video-ainsoph-2", thumbnail: "/images/ainsoph-burger-new.jpg" },
    // T's TanTan - Ramen
    { videoId: "video-tsramen-1", thumbnail: "/images/ts-tantan-ramen.webp" },
    { videoId: "video-tsramen-2", thumbnail: "/images/ts-tantan-ramen.webp" },
    // 8ablish - Burger
    { videoId: "video-8ablish-1", thumbnail: "/images/8ablish-burger.jpg" },
    // Nagi Shokudo - Macrobiotic plate
    { videoId: "video-nagi-1", thumbnail: "/images/nagi-shokudo.jpg" },
    // Loving Hut - Asian cuisine
    { videoId: "video-lovinghut-1", thumbnail: "/images/loving-hut.jpeg" },
  ];

  for (const update of updates) {
    await db.update(videos)
      .set({ thumbnail: update.thumbnail })
      .where(eq(videos.id, update.videoId));
    console.log(`✓ Updated ${update.videoId} -> ${update.thumbnail}`);
  }

  console.log("✅ All video thumbnails updated with delicious food images!");
}

updateAllThumbnails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  });

