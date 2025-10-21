import { drizzle } from "drizzle-orm/mysql2";
import { videos } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function updateThumbnails() {
  console.log("🖼️  Updating video thumbnails with real food images...");

  const updates = [
    { videoId: "video-ainsoph-1", thumbnail: "/images/ainsoph-pancake.jpeg" },
    { videoId: "video-ainsoph-2", thumbnail: "/images/ainsoph-burger.jpg" },
    { videoId: "video-tsramen-1", thumbnail: "/images/ts-tantan-ramen.webp" },
    { videoId: "video-tsramen-2", thumbnail: "/images/ts-tantan-ramen.webp" },
    { videoId: "video-8ablish-1", thumbnail: "/images/8ablish-burger.jpg" },
    { videoId: "video-nagi-1", thumbnail: "/images/nagi-shokudo.jpg" },
    { videoId: "video-lovinghut-1", thumbnail: "/images/loving-hut.jpeg" },
  ];

  for (const update of updates) {
    await db.update(videos)
      .set({ thumbnail: update.thumbnail })
      .where(eq(videos.id, update.videoId));
    console.log(`✓ Updated ${update.videoId} -> ${update.thumbnail}`);
  }

  console.log("✅ All video thumbnails updated with real food images!");
}

updateThumbnails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  });

