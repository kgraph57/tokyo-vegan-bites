import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
  // User preferences
  dietaryRestrictions: text("dietaryRestrictions"), // JSON array: ["vegan", "gluten-free"]
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Restaurants table
 */
export const restaurants = mysqlTable("restaurants", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameJa: varchar("nameJa", { length: 255 }),
  address: text("address").notNull(),
  lat: text("lat").notNull(), // Store as string to avoid decimal precision issues
  lng: text("lng").notNull(),
  veganLevel: mysqlEnum("veganLevel", [
    "100% Vegan",
    "Vegan Options",
    "Vegetarian",
    "Contains Fish Broth"
  ]).notNull(),
  cuisineTypes: text("cuisineTypes"), // JSON array: ["Ramen", "Cafe"]
  priceRange: varchar("priceRange", { length: 10 }), // "¥", "¥¥", "¥¥¥"
  features: text("features"), // JSON array: ["Organic", "Gluten-Free Options"]
  instagram: varchar("instagram", { length: 255 }),
  website: varchar("website", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  hours: text("hours"),
  description: text("description"),
  descriptionJa: text("descriptionJa"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

/**
 * Videos table
 */
export const videos = mysqlTable("videos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  restaurantId: varchar("restaurantId", { length: 64 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  source: mysqlEnum("source", ["instagram", "tiktok", "youtube", "upload"]).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }), // Original post URL
  title: varchar("title", { length: 255 }),
  duration: int("duration"), // in seconds
  viewCount: int("viewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Bookmarks table
 */
export const bookmarks = mysqlTable("bookmarks", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  restaurantId: varchar("restaurantId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

/**
 * Reviews table (simple ratings and comments)
 */
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  restaurantId: varchar("restaurantId", { length: 64 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

