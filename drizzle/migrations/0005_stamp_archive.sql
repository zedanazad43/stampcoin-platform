/**
 * Database Migration: Add Stamp Archive Tables
 * Adds support for digital stamp archive, NFT minting, and currency system
 */

CREATE TABLE IF NOT EXISTS `stampArchive` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `archiveId` varchar(200) NOT NULL UNIQUE,
  `country` varchar(100) NOT NULL,
  `denomination` decimal(10,2) NOT NULL,
  `year` int NOT NULL,
  `catalog` varchar(100) NOT NULL,
  `condition` enum('mint','used','fine','very_fine') NOT NULL,
  `rarity` enum('common','uncommon','rare','very_rare','legendary') NOT NULL,
  `description` text,
  `imageHash` varchar(200) NOT NULL,
  `imageUrl` text NOT NULL,
  `originalImageUrl` text,
  `usdValue` decimal(12,2) NOT NULL,
  `stampCoinValue` int NOT NULL,
  `serialNumber` varchar(100) UNIQUE,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_country` (`country`),
  KEY `idx_rarity` (`rarity`),
  KEY `idx_year` (`year`),
  KEY `idx_stampCoinValue` (`stampCoinValue`)
);

CREATE TABLE IF NOT EXISTS `stampPricing` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stampId` int NOT NULL,
  `archiveId` varchar(200),
  `baseUsdPrice` decimal(12,2) NOT NULL,
  `stampCoinPrice` int NOT NULL,
  `conditionMultiplier` decimal(5,2) NOT NULL,
  `rarityMultiplier` decimal(5,2) NOT NULL,
  `finalPrice` decimal(12,2) NOT NULL,
  `priceSource` enum('manual','market_data','ai_estimated','appraisal','auction_result') NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'USD',
  `validFrom` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `validUntil` timestamp,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`stampId`) REFERENCES `stamps` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`archiveId`) REFERENCES `stampArchive` (`archiveId`),
  KEY `idx_stampId` (`stampId`),
  KEY `idx_isActive` (`isActive`)
);

CREATE TABLE IF NOT EXISTS `stampNFT` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `stampId` int,
  `archiveId` varchar(200),
  `serialNumber` varchar(100) NOT NULL UNIQUE,
  `nftTokenId` varchar(100) NOT NULL UNIQUE,
  `contractAddress` varchar(100) NOT NULL,
  `blockchainNetwork` varchar(50) NOT NULL,
  `ownerAddress` varchar(100),
  `ownerId` int,
  `metadataUri` text NOT NULL,
  `imageUri` text NOT NULL,
  `nftType` enum('collectible','certificate','deed','license') NOT NULL DEFAULT 'collectible',
  `mintedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `transactionHash` varchar(200),
  `gasUsed` decimal(18,8),
  `gasCurrency` varchar(10) DEFAULT 'ETH',
  `royaltyPercentage` decimal(5,2) DEFAULT 5.00,
  `royaltyRecipient` varchar(100),
  `totalTransactions` int DEFAULT 0,
  `lastSoldAt` timestamp,
  `lastSoldPrice` decimal(12,2),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`stampId`) REFERENCES `stamps` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`archiveId`) REFERENCES `stampArchive` (`archiveId`),
  FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`),
  KEY `idx_blockchainNetwork` (`blockchainNetwork`),
  KEY `idx_ownerId` (`ownerId`),
  KEY `idx_mintedAt` (`mintedAt`)
);

CREATE TABLE IF NOT EXISTS `platformCurrency` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `currencyName` varchar(100) NOT NULL DEFAULT 'StampCoin',
  `currencySymbol` varchar(10) NOT NULL DEFAULT 'STMP',
  `totalSupply` int NOT NULL,
  `circulatingSupply` int NOT NULL,
  `maxSupply` int,
  `burnedSupply` int DEFAULT 0,
  `priceUSD` decimal(10,4) DEFAULT 0.1000,
  `marketCap` decimal(18,2),
  `volumeUSD` decimal(18,2),
  `pegged` boolean DEFAULT true,
  `pegValue` varchar(100) DEFAULT '0.1 USD',
  `contractAddress` varchar(100),
  `blockchainNetwork` varchar(50),
  `totalStampsInArchive` int DEFAULT 0,
  `totalNFTsMinted` int DEFAULT 0,
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_currency` (`currencySymbol`)
);

CREATE TABLE IF NOT EXISTS `currencyDistribution` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userId` int,
  `archiveId` varchar(200),
  `nftId` int,
  `distributionType` enum('mint','purchase','trade','reward','burn','transfer') NOT NULL,
  `amount` int NOT NULL,
  `usdValue` decimal(12,2),
  `relatedTransactionId` int,
  `description` text,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` timestamp,
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`archiveId`) REFERENCES `stampArchive` (`archiveId`),
  FOREIGN KEY (`nftId`) REFERENCES `stampNFT` (`id`),
  KEY `idx_userId` (`userId`),
  KEY `idx_distributionType` (`distributionType`),
  KEY `idx_status` (`status`)
);

-- Create indexes for faster queries
CREATE INDEX `idx_archiveId_stampArchive` ON `stampArchive` (`archiveId`);
CREATE INDEX `idx_country_year` ON `stampArchive` (`country`, `year`);
CREATE INDEX `idx_rarity_year` ON `stampArchive` (`rarity`, `year`);
CREATE INDEX `idx_stampNFT_archiveId` ON `stampNFT` (`archiveId`);
CREATE INDEX `idx_stampNFT_serialNumber` ON `stampNFT` (`serialNumber`);
CREATE INDEX `idx_currencyDistribution_userId` ON `currencyDistribution` (`userId`);
