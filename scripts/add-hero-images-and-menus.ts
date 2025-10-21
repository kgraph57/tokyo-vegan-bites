import { drizzle } from "drizzle-orm/mysql2";
import { restaurants, menuItems } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function addHeroImagesAndMenus() {
  console.log("🖼️  Adding hero images to restaurants...");

  // Update hero images for each restaurant
  const heroImages = [
    { id: "ainsoph-journey-shinjuku", heroImage: "/images/ainsoph-pancake.jpeg" },
    { id: "ts-tantan-tokyo-station", heroImage: "/images/ts-tantan-ramen.webp" },
    { id: "8ablish-omotesando", heroImage: "/images/8ablish-burger.jpg" },
    { id: "saido-jiyugaoka", heroImage: "/images/saido-plate.jpg" },
    { id: "loving-hut-nishi-nippori", heroImage: "/images/loving-hut.jpeg" },
    { id: "nagi-shokudo-shibuya", heroImage: "/images/nagi-shokudo.jpg" },
  ];

  for (const { id, heroImage } of heroImages) {
    await db.update(restaurants)
      .set({ heroImage })
      .where(eq(restaurants.id, id));
    console.log(`✓ Updated ${id} hero image`);
  }

  console.log("\n🍽️  Adding menu items...");

  const menus = [
    // AIN SOPH Journey
    {
      id: "menu-ainsoph-pancake",
      restaurantId: "ainsoph-journey-shinjuku",
      name: "Heavenly Pancakes",
      nameJa: "天使のパンケーキ",
      description: "Fluffy vegan pancakes topped with seasonal fruits, vegan ice cream, and maple syrup",
      descriptionJa: "季節のフルーツ、ヴィーガンアイスクリーム、メープルシロップをトッピングしたふわふわのヴィーガンパンケーキ",
      price: 1680,
      category: "Dessert",
      image: "/images/ainsoph-pancake.jpeg",
      isVegan: true,
      allergens: JSON.stringify(["wheat", "soy"]),
    },
    {
      id: "menu-ainsoph-burger",
      restaurantId: "ainsoph-journey-shinjuku",
      name: "Vegan Burger Set",
      nameJa: "ヴィーガンバーガーセット",
      description: "Plant-based burger with crispy fries and house-made sauce",
      descriptionJa: "プラントベースバーガー、フライドポテト、自家製ソース付き",
      price: 1580,
      category: "Main",
      image: "/images/ainsoph-burger-new.jpg",
      isVegan: true,
      allergens: JSON.stringify(["wheat", "soy"]),
    },
    // T's TanTan
    {
      id: "menu-ts-tantan-ramen",
      restaurantId: "ts-tantan-tokyo-station",
      name: "Vegan Tan Tan Ramen",
      nameJa: "ヴィーガン担々麺",
      description: "Rich sesame-based broth with plant-based meat and vegetables",
      descriptionJa: "濃厚なゴマベースのスープに植物性ミートと野菜をトッピング",
      price: 900,
      category: "Main",
      image: "/images/ts-tantan-ramen.webp",
      isVegan: true,
      allergens: JSON.stringify(["wheat", "soy", "sesame"]),
    },
    {
      id: "menu-ts-gyoza",
      restaurantId: "ts-tantan-tokyo-station",
      name: "Vegan Gyoza (5pcs)",
      nameJa: "ヴィーガン餃子（5個）",
      description: "Pan-fried dumplings filled with vegetables and tofu",
      descriptionJa: "野菜と豆腐を詰めた焼き餃子",
      price: 350,
      category: "Side",
      image: null,
      isVegan: true,
      allergens: JSON.stringify(["wheat", "soy"]),
    },
    // 8ablish
    {
      id: "menu-8ablish-burger",
      restaurantId: "8ablish-omotesando",
      name: "Organic Vegan Burger",
      nameJa: "オーガニックヴィーガンバーガー",
      description: "Organic plant-based patty with fresh vegetables and special sauce",
      descriptionJa: "オーガニック植物性パティと新鮮野菜、特製ソース",
      price: 1800,
      category: "Main",
      image: "/images/8ablish-burger.jpg",
      isVegan: true,
      allergens: JSON.stringify(["wheat", "soy"]),
    },
    {
      id: "menu-8ablish-fries",
      restaurantId: "8ablish-omotesando",
      name: "Organic French Fries",
      nameJa: "オーガニックフレンチフライ",
      description: "Crispy organic potato fries with sea salt",
      descriptionJa: "カリカリのオーガニックポテトフライ、海塩添え",
      price: 600,
      category: "Side",
      image: null,
      isVegan: true,
      allergens: JSON.stringify([]),
    },
    // Nagi Shokudo
    {
      id: "menu-nagi-teishoku",
      restaurantId: "nagi-shokudo-shibuya",
      name: "Macrobiotic Set Meal",
      nameJa: "マクロビオティック定食",
      description: "Balanced meal with brown rice, seasonal vegetables, and miso soup",
      descriptionJa: "玄米、季節の野菜、味噌汁のバランスの取れた定食",
      price: 1200,
      category: "Main",
      image: "/images/nagi-shokudo.jpg",
      isVegan: true,
      allergens: JSON.stringify(["soy"]),
    },
    // Saido
    {
      id: "menu-saido-plate",
      restaurantId: "saido-jiyugaoka",
      name: "Vegan Sushi Plate",
      nameJa: "ヴィーガン寿司プレート",
      description: "Assorted vegan sushi with creative plant-based ingredients",
      descriptionJa: "創作植物性食材を使った盛り合わせヴィーガン寿司",
      price: 1500,
      category: "Main",
      image: "/images/saido-plate.jpg",
      isVegan: true,
      allergens: JSON.stringify(["soy", "wheat"]),
    },
    // Loving Hut
    {
      id: "menu-lovinghut-curry",
      restaurantId: "loving-hut-nishi-nippori",
      name: "Vegan Curry Rice",
      nameJa: "ヴィーガンカレーライス",
      description: "Flavorful vegetable curry with rice",
      descriptionJa: "風味豊かな野菜カレーライス",
      price: 980,
      category: "Main",
      image: "/images/loving-hut.jpeg",
      isVegan: true,
      allergens: JSON.stringify(["soy"]),
    },
  ];

  for (const menu of menus) {
    await db.insert(menuItems).values(menu);
    console.log(`✓ Added ${menu.name}`);
  }

  console.log("\n✅ Hero images and menus added successfully!");
}

addHeroImagesAndMenus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  });

