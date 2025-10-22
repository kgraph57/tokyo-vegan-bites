CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."vegan_level" AS ENUM('100% Vegan', 'Vegan Options', 'Vegetarian', 'Contains Fish Broth');--> statement-breakpoint
CREATE TYPE "public"."video_source" AS ENUM('instagram', 'tiktok', 'youtube', 'upload');--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"restaurantId" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "menuItems" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"restaurantId" varchar(64) NOT NULL,
	"name" varchar(255) NOT NULL,
	"nameJa" varchar(255),
	"description" text,
	"descriptionJa" text,
	"price" integer,
	"category" varchar(100),
	"image" varchar(500),
	"isVegan" boolean DEFAULT true,
	"allergens" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"nameJa" varchar(255),
	"address" text NOT NULL,
	"lat" text NOT NULL,
	"lng" text NOT NULL,
	"veganLevel" "vegan_level" NOT NULL,
	"cuisineTypes" text,
	"priceRange" varchar(10),
	"features" text,
	"instagram" varchar(255),
	"website" varchar(500),
	"phone" varchar(50),
	"hours" text,
	"description" text,
	"descriptionJa" text,
	"heroImage" varchar(500),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"userId" varchar(64) NOT NULL,
	"restaurantId" varchar(64) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"lastSignedIn" timestamp DEFAULT now(),
	"dietaryRestrictions" text,
	"preferredLanguage" varchar(10) DEFAULT 'en'
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"restaurantId" varchar(64) NOT NULL,
	"url" varchar(500) NOT NULL,
	"thumbnail" varchar(500),
	"source" "video_source" NOT NULL,
	"sourceUrl" varchar(500),
	"title" varchar(255),
	"duration" integer,
	"viewCount" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now()
);
