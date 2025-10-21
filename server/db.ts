import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, restaurants, videos, bookmarks, reviews, menuItems, Restaurant, Video, MenuItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "dietaryRestrictions", "preferredLanguage"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Restaurant queries
export async function getAllRestaurants(): Promise<Restaurant[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(restaurants).orderBy(restaurants.name);
}

export async function getRestaurantById(id: string): Promise<Restaurant | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getRestaurantsByVeganLevel(level: string): Promise<Restaurant[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(restaurants).where(eq(restaurants.veganLevel, level as any));
}

// Video queries
export async function getAllVideos() {
  const db = await getDb();
  if (!db) return [];
  
  const videoList = await db.select().from(videos).orderBy(desc(videos.createdAt));
  
  // Fetch restaurant data for each video
  const videosWithRestaurants = await Promise.all(
    videoList.map(async (video) => {
      const restaurant = await getRestaurantById(video.restaurantId);
      return {
        ...video,
        restaurant: restaurant || null,
      };
    })
  );
  
  return videosWithRestaurants;
}

export async function getVideosByRestaurantId(restaurantId: string): Promise<Video[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(videos).where(eq(videos.restaurantId, restaurantId)).orderBy(desc(videos.createdAt));
}

// Bookmark queries
export async function getUserBookmarks(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      bookmark: bookmarks,
      restaurant: restaurants,
    })
    .from(bookmarks)
    .leftJoin(restaurants, eq(bookmarks.restaurantId, restaurants.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));
  
  return result;
}

export async function addBookmark(userId: string, restaurantId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const id = `bookmark-${userId}-${restaurantId}-${Date.now()}`;
  await db.insert(bookmarks).values({ id, userId, restaurantId });
  return { id, userId, restaurantId };
}

export async function removeBookmark(userId: string, restaurantId: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(bookmarks).where(
    and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.restaurantId, restaurantId)
    )
  );
}

export async function isBookmarked(userId: string, restaurantId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.restaurantId, restaurantId)
      )
    )
    .limit(1);
  
  return result.length > 0;
}

// Review queries
export async function getRestaurantReviews(restaurantId: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      review: reviews,
      user: users,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.restaurantId, restaurantId))
    .orderBy(desc(reviews.createdAt));
  
  return result;
}

export async function addReview(userId: string, restaurantId: string, rating: number, comment?: string) {
  const db = await getDb();
  if (!db) return null;
  
  const id = `review-${userId}-${restaurantId}-${Date.now()}`;
  await db.insert(reviews).values({ id, userId, restaurantId, rating, comment });
  return { id, userId, restaurantId, rating, comment };
}

// Menu queries
export async function getMenuItemsByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId)).orderBy(menuItems.category, menuItems.name);
}

// Search restaurants with filters
export async function searchRestaurants(filters: {
  veganLevel?: string;
  cuisineType?: string;
  priceRange?: string;
  features?: string[];
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(restaurants);
  
  // Note: For complex JSON filtering, we'd need to use SQL expressions
  // For now, return all and filter in application code
  const allRestaurants = await query;
  
  return allRestaurants.filter((r) => {
    if (filters.veganLevel && r.veganLevel !== filters.veganLevel) return false;
    if (filters.priceRange && r.priceRange !== filters.priceRange) return false;
    
    if (filters.cuisineType) {
      const cuisineTypes = JSON.parse(r.cuisineTypes || "[]");
      if (!cuisineTypes.includes(filters.cuisineType)) return false;
    }
    
    if (filters.features && filters.features.length > 0) {
      const restaurantFeatures = JSON.parse(r.features || "[]");
      const hasAllFeatures = filters.features.every((f) => restaurantFeatures.includes(f));
      if (!hasAllFeatures) return false;
    }
    
    return true;
  });
}

