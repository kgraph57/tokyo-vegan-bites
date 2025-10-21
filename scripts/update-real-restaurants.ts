import { drizzle } from "drizzle-orm/mysql2";
import { restaurants } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function updateRestaurants() {
  console.log("🔄 Updating restaurants with real information...");

  const realRestaurants = [
    {
      id: "ainsoph-journey-shinjuku",
      name: "AIN SOPH. Journey",
      nameJa: "アインソフ ジャーニー 新宿店",
      description: "100% plant-based vegan cafe serving heavenly pancakes, burgers, and seasonal dishes. No meat, fish, dairy, or eggs used.",
      descriptionJa: "100%プラントベースのヴィーガンカフェ。天上のパンケーキ、バーガー、季節の料理を提供。肉、魚、乳製品、卵は一切不使用。",
      address: "3-8-9 Shinjuku, Shinjuku-ku, Tokyo 160-0022 (Shinjuku Q Building 1F)",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Cafe", "American", "Dessert"]),
      priceRange: "¥¥",
      phone: "050-5869-4158",
      website: "https://en.ain-soph.jp/journey-shinjuku",
      instagram: "@ainsoph.journey",
      hours: "Mon-Thu: 11:30-16:00, 18:00-21:30 | Fri-Sat: 11:30-17:00, 18:00-21:30 | Sun: 11:30-17:00, 18:00-21:30",
      features: JSON.stringify(["WiFi", "English Menu", "Reservations Available", "Instagram-worthy"]),
    },
    {
      id: "ts-tantan-tokyo",
      name: "T's TanTan",
      nameJa: "T's たんたん 東京駅京葉ストリート店",
      description: "Vegan ramen shop inside Tokyo Station. Famous for golden sesame tantan-men using no meat, fish, eggs or dairy products.",
      descriptionJa: "東京駅構内のヴィーガンラーメン店。肉、魚、卵、乳製品を一切使わない黄金胡麻担々麺が有名。",
      address: "1-9-1 Marunouchi, Chiyoda-ku, Tokyo (JR Tokyo Station, Gransta Tokyo 1F, Keiyo Street)",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Ramen", "Japanese"]),
      priceRange: "¥",
      phone: "03-3218-8040",
      website: "https://www.gransta.jp/mall/gransta_tokyo/tstantan/",
      instagram: "@ts_tantan_jp",
      hours: "Daily: 10:00-22:00 (L.O. 21:30)",
      features: JSON.stringify(["Quick Service", "Station Location", "English Menu", "Takeout Available"]),
    },
    {
      id: "8ablish-azabudai",
      name: "8ablish",
      nameJa: "エイタブリッシュ 麻布台ヒルズ店",
      description: "Organic vegan cafe serving mouthwatering burgers, salads, and desserts. All dishes are plant-based and visually stunning.",
      descriptionJa: "オーガニックヴィーガンカフェ。美味しいバーガー、サラダ、デザートを提供。全ての料理がプラントベースで見た目も美しい。",
      address: "5-8-1 Toranomon, Minato-ku, Tokyo 105-0001 (Azabudai Hills Garden Plaza A 2F)",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Burger", "American", "Cafe"]),
      priceRange: "¥¥",
      phone: "03-6432-0288",
      website: "https://8ablish.com",
      instagram: "@8ablish",
      hours: "Daily: 9:00-21:00",
      features: JSON.stringify(["Organic", "Gluten-Free Options", "WiFi", "Stylish Interior"]),
    },
    {
      id: "saido-jiyugaoka",
      name: "Saido",
      nameJa: "菜道 自由が丘店",
      description: "Visionary vegan Japanese restaurant offering innovative plant-based versions of traditional noodle and rice dishes. MSG-free.",
      descriptionJa: "革新的なヴィーガン和食レストラン。伝統的な麺料理や米料理のプラントベース版を提供。化学調味料不使用。",
      address: "2-15-10 Jiyugaoka, Meguro-ku, Tokyo 152-0035",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Japanese", "Ramen"]),
      priceRange: "¥¥",
      phone: "03-5726-9500",
      website: "https://saido.tokyo/en/",
      instagram: "@saido_tokyo",
      hours: "Mon-Sun: 11:30-15:00, 17:30-22:00 (L.O. 21:00)",
      features: JSON.stringify(["MSG-Free", "Authentic Japanese", "Seasonal Menu", "Reservations Recommended"]),
    },
    {
      id: "loving-hut-nishi-nippori",
      name: "Loving Hut Tokyo",
      nameJa: "ラビングハット 西日暮里店",
      description: "International vegan restaurant chain serving Asian-inspired dishes. Part of the worldwide Loving Hut family.",
      descriptionJa: "世界的なヴィーガンレストランチェーン。アジア風の料理を提供。Loving Hutファミリーの一員。",
      address: "6-26-9 Nishi-Nippori, Arakawa-ku, Tokyo 116-0013",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Asian", "Japanese", "Chinese"]),
      priceRange: "¥",
      phone: "03-5901-9974",
      website: "https://www.lovinghut-tokyo-nishi-nippori.com",
      instagram: "@lovinghut_tokyo",
      hours: "Wed-Fri: 11:30-15:00 | Sat: 11:30-15:00",
      features: JSON.stringify(["Affordable", "Family-Friendly", "Variety Menu"]),
    },
    {
      id: "nagi-shokudo-shibuya",
      name: "Nagi Shokudo",
      nameJa: "なぎ食堂 渋谷店",
      description: "Macrobiotic vegan restaurant in Shibuya offering healthy set meals with brown rice, vegetables, and miso soup.",
      descriptionJa: "渋谷のマクロビオティックヴィーガンレストラン。玄米、野菜、味噌汁を使った健康的な定食を提供。",
      address: "2-23-12 Shibuya, Shibuya-ku, Tokyo 150-0002",
      veganLevel: "100% Vegan",
      cuisineTypes: JSON.stringify(["Japanese", "Macrobiotic"]),
      priceRange: "¥",
      phone: "03-5468-5417",
      website: "https://nagi-shokudo.com",
      instagram: "@nagi_shokudo",
      hours: "Mon-Sat: 11:30-15:00, 18:00-21:00 | Sun: Closed",
      features: JSON.stringify(["Macrobiotic", "Healthy", "Brown Rice", "Organic Vegetables"]),
    },
  ];

  for (const restaurant of realRestaurants) {
    try {
      // Check if restaurant exists
      const existing = await db.select().from(restaurants).where(eq(restaurants.id, restaurant.id)).limit(1);
      
      if (existing.length > 0) {
        // Update existing
        await db.update(restaurants)
          .set(restaurant)
          .where(eq(restaurants.id, restaurant.id));
        console.log(`✓ Updated: ${restaurant.name}`);
      } else {
        // Insert new
        await db.insert(restaurants).values(restaurant);
        console.log(`✓ Inserted: ${restaurant.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${restaurant.name}:`, error);
    }
  }

  console.log("✅ Restaurant data updated successfully!");
}

updateRestaurants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Update failed:", error);
    process.exit(1);
  });

