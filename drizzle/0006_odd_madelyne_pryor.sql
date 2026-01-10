ALTER TABLE `users` ADD `stripeConnectedAccountId` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `paymentMethodsEnabled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `paymentStatus` enum('not_configured','pending_onboarding','active','suspended','inactive') DEFAULT 'not_configured' NOT NULL;