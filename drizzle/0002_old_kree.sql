CREATE TABLE `menuItems` (
	`id` varchar(64) NOT NULL,
	`restaurantId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameJa` varchar(255),
	`description` text,
	`descriptionJa` text,
	`price` int,
	`category` varchar(100),
	`image` varchar(500),
	`isVegan` boolean DEFAULT true,
	`allergens` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `menuItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `restaurants` ADD `heroImage` varchar(500);