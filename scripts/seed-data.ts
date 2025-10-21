import { drizzle } from "drizzle-orm/mysql2";
import { restaurants, videos, InsertRestaurant, InsertVideo } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const sampleRestaurants: InsertRestaurant[] = [
  {
    id: "ain-soph-journey",
    name: "Ain Soph. Journey",
    nameJa: "アインソフ ジャーニー",
    address: "3-8-9 Shinjuku, Shinjuku-ku, Tokyo",
    lat: "35.6895",
    lng: "139.7036",
    veganLevel: "100% Vegan",
    cuisineTypes: JSON.stringify(["Cafe", "Dessert"]),
    priceRange: "¥¥",
    features: JSON.stringify(["Organic", "Gluten-Free Options"]),
    instagram: "@ainsoph.journey",
    website: "https://ain-soph.jp/",
    phone: "+81-3-6457-3837",
    hours: "11:00-20:00 (Last Order 19:30)",
    description: "A 100% vegan cafe in Shinjuku. Famous for beautiful parfaits and healthy meals.",
    descriptionJa: "新宿にある100%ヴィーガンカフェ。美しいパフェとヘルシーな食事が人気。",
  },
  {
    id: "ts-tantan-tokyo",
    name: "T's TanTan Tokyo Station",
    nameJa: "T's たんたん 東京駅店",
    address: "1-9-1 Marunouchi, Chiyoda-ku, Tokyo (Inside Tokyo Station)",
    lat: "35.6812",
    lng: "139.7671",
    veganLevel: "100% Vegan",
    cuisineTypes: JSON.stringify(["Ramen", "Japanese"]),
    priceRange: "¥",
    features: JSON.stringify(["Quick Service", "Station Location"]),
    instagram: "@ts_restaurant",
    website: "https://ts-restaurant.jp/",
    phone: "+81-3-3218-8040",
    hours: "7:00-22:30 (Mon-Sat), 7:00-21:30 (Sun)",
    description: "100% vegan ramen shop inside Tokyo Station. Perfect for travelers!",
    descriptionJa: "東京駅構内の100%ヴィーガンラーメン店。旅行者に最適！",
  },
  {
    id: "saido-shibuya",
    name: "Saido",
    nameJa: "菜道",
    address: "1-19-3 Jinnan, Shibuya-ku, Tokyo",
    lat: "35.6627",
    lng: "139.7010",
    veganLevel: "Vegan Options",
    cuisineTypes: JSON.stringify(["Izakaya", "Japanese"]),
    priceRange: "¥¥",
    features: JSON.stringify(["Vegan Ramen", "Organic Vegetables"]),
    instagram: "@saido_shibuya",
    website: "https://saido-shibuya.com/",
    phone: "+81-3-6455-0831",
    hours: "17:00-23:00 (Closed Mondays)",
    description: "Shibuya izakaya with excellent vegan ramen and organic vegetable dishes.",
    descriptionJa: "渋谷の居酒屋。ヴィーガンラーメンとオーガニック野菜料理が充実。",
  },
  {
    id: "8ablish-omotesando",
    name: "8ablish",
    nameJa: "エイタブリッシュ",
    address: "5-51-8 Jingumae, Shibuya-ku, Tokyo",
    lat: "35.6650",
    lng: "139.7094",
    veganLevel: "100% Vegan",
    cuisineTypes: JSON.stringify(["Burger", "American"]),
    priceRange: "¥¥",
    features: JSON.stringify(["Plant-Based Meat", "Craft Beer"]),
    instagram: "@8ablish_tokyo",
    website: "https://8ablish.com/",
    phone: "+81-3-6427-4207",
    hours: "11:30-22:00",
    description: "100% plant-based burger joint in Omotesando. Juicy burgers that even meat-lovers enjoy!",
    descriptionJa: "表参道の100%プラントベースバーガー店。肉好きも満足のジューシーなバーガー！",
  },
  {
    id: "loving-hut-ikebukuro",
    name: "Loving Hut Ikebukuro",
    nameJa: "ラビングハット 池袋",
    address: "1-28-1 Minami-Ikebukuro, Toshima-ku, Tokyo",
    lat: "35.7295",
    lng: "139.7109",
    veganLevel: "100% Vegan",
    cuisineTypes: JSON.stringify(["Asian", "Chinese", "Vietnamese"]),
    priceRange: "¥",
    features: JSON.stringify(["International Chain", "Affordable"]),
    instagram: "@lovinghut_japan",
    website: "https://lovinghut.jp/",
    phone: "+81-3-5957-0245",
    hours: "11:00-21:00",
    description: "International vegan chain with diverse Asian menu. Great value for money!",
    descriptionJa: "国際的なヴィーガンチェーン。多様なアジア料理メニュー。コスパ抜群！",
  },
  {
    id: "nagi-shokudo-shibuya",
    name: "Nagi Shokudo",
    nameJa: "なぎ食堂",
    address: "1-15-3 Shibuya, Shibuya-ku, Tokyo",
    lat: "35.6598",
    lng: "139.7024",
    veganLevel: "Vegan Options",
    cuisineTypes: JSON.stringify(["Japanese", "Macrobiotic"]),
    priceRange: "¥¥",
    features: JSON.stringify(["Organic", "Brown Rice", "Seasonal Vegetables"]),
    instagram: "@nagi_shokudo",
    website: "https://nagi-shokudo.jp/",
    phone: "+81-3-6427-0091",
    hours: "11:30-15:00, 18:00-22:00 (Closed Wednesdays)",
    description: "Macrobiotic restaurant in Shibuya offering seasonal organic vegetables and brown rice sets.",
    descriptionJa: "渋谷のマクロビオティックレストラン。季節の有機野菜と玄米の定食が人気。",
  },
];

const sampleVideos: InsertVideo[] = [
  {
    id: "video-ain-soph-1",
    restaurantId: "ain-soph-journey",
    url: "https://www.instagram.com/reel/example1/",
    thumbnail: "https://picsum.photos/seed/ainsoph1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example1/",
    title: "Beautiful Vegan Parfait at Ain Soph Journey",
    duration: 15,
  },
  {
    id: "video-ain-soph-2",
    restaurantId: "ain-soph-journey",
    url: "https://www.instagram.com/reel/example2/",
    thumbnail: "https://picsum.photos/seed/ainsoph2/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example2/",
    title: "Vegan Pancakes at Ain Soph",
    duration: 20,
  },
  {
    id: "video-ts-tantan-1",
    restaurantId: "ts-tantan-tokyo",
    url: "https://www.instagram.com/reel/example3/",
    thumbnail: "https://picsum.photos/seed/tsramen1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example3/",
    title: "Vegan Ramen at Tokyo Station",
    duration: 18,
  },
  {
    id: "video-saido-1",
    restaurantId: "saido-shibuya",
    url: "https://www.instagram.com/reel/example4/",
    thumbnail: "https://picsum.photos/seed/saido1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example4/",
    title: "Vegan Ramen in Shibuya",
    duration: 22,
  },
  {
    id: "video-8ablish-1",
    restaurantId: "8ablish-omotesando",
    url: "https://www.instagram.com/reel/example5/",
    thumbnail: "https://picsum.photos/seed/8ablish1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example5/",
    title: "Plant-Based Burger at 8ablish",
    duration: 16,
  },
  {
    id: "video-loving-hut-1",
    restaurantId: "loving-hut-ikebukuro",
    url: "https://www.instagram.com/reel/example6/",
    thumbnail: "https://picsum.photos/seed/lovinghut1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example6/",
    title: "Asian Vegan Food at Loving Hut",
    duration: 19,
  },
  {
    id: "video-nagi-1",
    restaurantId: "nagi-shokudo-shibuya",
    url: "https://www.instagram.com/reel/example7/",
    thumbnail: "https://picsum.photos/seed/nagi1/400/600",
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/example7/",
    title: "Organic Macrobiotic Meal at Nagi Shokudo",
    duration: 21,
  },
];

async function seed() {
  console.log("Seeding restaurants...");
  for (const restaurant of sampleRestaurants) {
    await db.insert(restaurants).values(restaurant).onDuplicateKeyUpdate({ set: restaurant });
  }
  console.log(`✓ Inserted ${sampleRestaurants.length} restaurants`);

  console.log("Seeding videos...");
  for (const video of sampleVideos) {
    await db.insert(videos).values(video).onDuplicateKeyUpdate({ set: video });
  }
  console.log(`✓ Inserted ${sampleVideos.length} videos`);

  console.log("✓ Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

