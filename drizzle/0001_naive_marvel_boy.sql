CREATE TABLE `bookmarks` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`restaurantId` varchar(64) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameJa` varchar(255),
	`address` text NOT NULL,
	`lat` text NOT NULL,
	`lng` text NOT NULL,
	`veganLevel` enum('100% Vegan','Vegan Options','Vegetarian','Contains Fish Broth') NOT NULL,
	`cuisineTypes` text,
	`priceRange` varchar(10),
	`features` text,
	`instagram` varchar(255),
	`website` varchar(500),
	`phone` varchar(50),
	`hours` text,
	`description` text,
	`descriptionJa` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `restaurants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`restaurantId` varchar(64) NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` varchar(64) NOT NULL,
	`restaurantId` varchar(64) NOT NULL,
	`url` varchar(500) NOT NULL,
	`thumbnail` varchar(500),
	`source` enum('instagram','tiktok','youtube','upload') NOT NULL,
	`sourceUrl` varchar(500),
	`title` varchar(255),
	`duration` int,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `dietaryRestrictions` text;--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` varchar(10) DEFAULT 'en';