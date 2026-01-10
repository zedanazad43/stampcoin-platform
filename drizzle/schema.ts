import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "expert", "appraiser"]).default("user").notNull(),
  
  // Expert/Appraiser credentials
  expertiseAreas: text("expertiseAreas"), // JSON array of specialties
  credentials: text("credentials"), // Professional certifications
  verifiedExpert: boolean("verifiedExpert").default(false),
  expertRating: decimal("expertRating", { precision: 3, scale: 2 }), // 0.00-5.00
  totalAuthentications: int("totalAuthentications").default(0),
  totalAppraisals: int("totalAppraisals").default(0),

  // Stripe Payment Integration
  stripeConnectedAccountId: varchar("stripeConnectedAccountId", { length: 100 }), // acct_xxxxx for connected accounts
  stripeCustomerId: varchar("stripeCustomerId", { length: 100 }), // cus_xxxxx for payment customers
  paymentMethodsEnabled: boolean("paymentMethodsEnabled").default(false),
  paymentStatus: mysqlEnum("paymentStatus", ["not_configured", "pending_onboarding", "active", "suspended", "inactive"]).default("not_configured").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories table for stamp classification
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameAr: varchar("nameAr", { length: 100 }),
  nameDe: varchar("nameDe", { length: 100 }),
  nameFr: varchar("nameFr", { length: 100 }),
  nameEs: varchar("nameEs", { length: 100 }),
  nameZh: varchar("nameZh", { length: 100 }),
  nameKo: varchar("nameKo", { length: 100 }),
  description: text("description"),
  parentId: int("parentId"), // For hierarchical categories
  continent: varchar("continent", { length: 50 }),
  region: varchar("region", { length: 100 }),
  icon: varchar("icon", { length: 200 }), // Icon/emoji for UI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Stamps table for digital stamp NFTs
 */
export const stamps = mysqlTable("stamps", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  titleAr: varchar("titleAr", { length: 200 }),
  titleDe: varchar("titleDe", { length: 200 }),
  titleFr: varchar("titleFr", { length: 200 }),
  titleEs: varchar("titleEs", { length: 200 }),
  titleZh: varchar("titleZh", { length: 200 }),
  titleKo: varchar("titleKo", { length: 200 }),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  descriptionDe: text("descriptionDe"),
  descriptionFr: text("descriptionFr"),
  descriptionEs: text("descriptionEs"),
  descriptionZh: text("descriptionZh"),
  descriptionKo: text("descriptionKo"),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  country: varchar("country", { length: 100 }),
  year: int("year"),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "very_rare", "legendary"]).default("common").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  ownerId: int("ownerId"),
  authenticatedBy: varchar("authenticatedBy", { length: 200 }),
  authenticationDate: timestamp("authenticationDate"),
  mintNumber: int("mintNumber"),
  totalMinted: int("totalMinted"),
  
  // NFT Blockchain Metadata
  nftTokenId: varchar("nftTokenId", { length: 100 }),
  nftContractAddress: varchar("nftContractAddress", { length: 100 }),
  blockchainNetwork: varchar("blockchainNetwork", { length: 50 }), // ethereum, polygon, solana, etc.
  mintedAt: timestamp("mintedAt"),
  nftMetadataUri: text("nftMetadataUri"), // IPFS or Arweave URI
  
  // Authentication & Verification
  authenticationStatus: mysqlEnum("authenticationStatus", ["pending", "verified", "rejected", "expired"]),
  authenticationType: mysqlEnum("authenticationType", ["expert_review", "certificate_scan", "ai_analysis", "blockchain_provenance", "third_party"]),
  physicalStampId: varchar("physicalStampId", { length: 100 }), // Links to physical original
  certificateNumber: varchar("certificateNumber", { length: 100 }),
  
  // Valuation & Appraisal
  appraisalValue: decimal("appraisalValue", { precision: 12, scale: 2 }),
  appraisalDate: timestamp("appraisalDate"),
  appraisedBy: varchar("appraisedBy", { length: 200 }),
  
  // Geographic & Origin Data
  continent: varchar("continent", { length: 50 }),
  region: varchar("region", { length: 100 }),
  issuedBy: varchar("issuedBy", { length: 200 }),
  denomination: varchar("denomination", { length: 100 }),
  
  // Physical Characteristics
  color: varchar("color", { length: 100 }),
  perforation: varchar("perforation", { length: 100 }),
  watermark: varchar("watermark", { length: 200 }),
  printingMethod: varchar("printingMethod", { length: 100 }),
  designer: varchar("designer", { length: 200 }),
  engraver: varchar("engraver", { length: 200 }),
  quantity: int("quantity"), // Original print run
  condition: varchar("condition", { length: 50 }), // mint, near_mint, excellent, good, fair, poor
  
  // Historical & Market Data
  historicalSignificance: text("historicalSignificance"),
  marketTrend: mysqlEnum("marketTrend", ["rising", "stable", "declining", "volatile"]),
  estimatedValue: decimal("estimatedValue", { precision: 12, scale: 2 }),
  lastSoldPrice: decimal("lastSoldPrice", { precision: 12, scale: 2 }),
  lastSoldDate: timestamp("lastSoldDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Stamp = typeof stamps.$inferSelect;
export type InsertStamp = typeof stamps.$inferInsert;

/**
 * Transactions table for stamp purchases
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull(),
  buyerId: int("buyerId").notNull(),
  sellerId: int("sellerId"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  transactionHash: varchar("transactionHash", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Favorites table for user's favorite stamps
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stampId: int("stampId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Contact messages table
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 300 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Reviews table for stamp ratings and feedback
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Partners table for tracking partners and supporters
 */
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  companyNameAr: varchar("companyNameAr", { length: 200 }),
  description: text("description"),
  descriptionAr: text("descriptionAr"),
  website: varchar("website", { length: 500 }),
  logo: text("logo"),
  logoKey: varchar("logoKey", { length: 500 }),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum", "diamond"]).notNull(),
  totalInvestment: decimal("totalInvestment", { precision: 15, scale: 2 }).notNull(),
  investmentDate: timestamp("investmentDate").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "inactive"]).default("pending").notNull(),
  approvedBy: int("approvedBy"),
  approvalDate: timestamp("approvalDate"),
  benefits: text("benefits"),
  contactPerson: varchar("contactPerson", { length: 200 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Partner Benefits table for tracking partner perks and rewards
 */
export const partnerBenefits = mysqlTable("partnerBenefits", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull().references(() => partners.id, { onDelete: 'cascade' }),
  benefitType: mysqlEnum("benefitType", ["discount", "commission", "feature", "support", "branding", "exclusive_access"]).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  value: varchar("value", { length: 200 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PartnerBenefit = typeof partnerBenefits.$inferSelect;
export type InsertPartnerBenefit = typeof partnerBenefits.$inferInsert;

/**
 * Partner Transactions table for tracking partner purchases and commissions
 */
export const partnerTransactions = mysqlTable("partnerTransactions", {
  id: int("id").autoincrement().primaryKey(),
  partnerId: int("partnerId").notNull().references(() => partners.id, { onDelete: 'cascade' }),
  transactionId: int("transactionId").references(() => transactions.id),
  type: mysqlEnum("type", ["purchase", "commission", "reward", "refund"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: varchar("description", { length: 500 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type PartnerTransaction = typeof partnerTransactions.$inferSelect;
export type InsertPartnerTransaction = typeof partnerTransactions.$inferInsert;

/**
 * Stamp Authentications table for tracking verification process
 */
export const stampAuthentications = mysqlTable("stampAuthentications", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  verifierId: int("verifierId").references(() => users.id), // Expert/authenticator user
  verifierName: varchar("verifierName", { length: 200 }).notNull(),
  verifierCredentials: text("verifierCredentials"),
  authenticationType: mysqlEnum("authenticationType", ["expert_review", "certificate_scan", "ai_analysis", "blockchain_provenance", "third_party"]).notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "verified", "rejected", "disputed"]).default("pending").notNull(),
  confidenceScore: int("confidenceScore"), // 0-100
  findings: text("findings"),
  supportingDocuments: text("supportingDocuments"), // JSON array of document URLs
  certificateIssued: boolean("certificateIssued").default(false),
  certificateUrl: text("certificateUrl"),
  verificationDate: timestamp("verificationDate"),
  expiryDate: timestamp("expiryDate"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StampAuthentication = typeof stampAuthentications.$inferSelect;
export type InsertStampAuthentication = typeof stampAuthentications.$inferInsert;

/**
 * Stamp Appraisals table for tracking valuations over time
 */
export const stampAppraisals = mysqlTable("stampAppraisals", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  appraiserId: int("appraiserId").references(() => users.id),
  appraiserName: varchar("appraiserName", { length: 200 }).notNull(),
  appraiserCredentials: text("appraiserCredentials"),
  appraisalType: mysqlEnum("appraisalType", ["formal", "informal", "market_based", "ai_estimated", "auction_result"]).notNull(),
  estimatedValue: decimal("estimatedValue", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  valuationMethod: varchar("valuationMethod", { length: 200 }),
  marketConditions: text("marketConditions"),
  comparableSales: text("comparableSales"), // JSON array of comparable sales data
  factors: text("factors"), // JSON of factors affecting value
  report: text("report"),
  reportUrl: text("reportUrl"),
  validUntil: timestamp("validUntil"),
  confidenceLevel: mysqlEnum("confidenceLevel", ["low", "medium", "high", "very_high"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StampAppraisal = typeof stampAppraisals.$inferSelect;
export type InsertStampAppraisal = typeof stampAppraisals.$inferInsert;

/**
 * NFT Minting History table
 */
export const nftMintingHistory = mysqlTable("nftMintingHistory", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  userId: int("userId").notNull().references(() => users.id),
  blockchainNetwork: varchar("blockchainNetwork", { length: 50 }).notNull(),
  contractAddress: varchar("contractAddress", { length: 100 }).notNull(),
  tokenId: varchar("tokenId", { length: 100 }).notNull(),
  transactionHash: varchar("transactionHash", { length: 200 }),
  metadataUri: text("metadataUri"),
  imageUri: text("imageUri"),
  mintingStatus: mysqlEnum("mintingStatus", ["preparing", "pending", "minting", "minted", "failed"]).default("preparing").notNull(),
  gasFee: decimal("gasFee", { precision: 18, scale: 8 }),
  gasCurrency: varchar("gasCurrency", { length: 10 }),
  errorMessage: text("errorMessage"),
  mintedAt: timestamp("mintedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NftMintingHistory = typeof nftMintingHistory.$inferSelect;
export type InsertNftMintingHistory = typeof nftMintingHistory.$inferInsert;

/**
 * Stamp Provenance table for tracking ownership history
 */
export const stampProvenance = mysqlTable("stampProvenance", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  previousOwnerId: int("previousOwnerId").references(() => users.id),
  newOwnerId: int("newOwnerId").references(() => users.id),
  transactionId: int("transactionId").references(() => transactions.id),
  transferType: mysqlEnum("transferType", ["sale", "gift", "inheritance", "auction", "trade", "initial_mint"]).notNull(),
  transferDate: timestamp("transferDate").defaultNow().notNull(),
  verificationDocument: text("verificationDocument"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StampProvenance = typeof stampProvenance.$inferSelect;
export type InsertStampProvenance = typeof stampProvenance.$inferInsert;

/**
 * Expert Applications table
 */
export const expertApplications = mysqlTable("expertApplications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  expertiseAreas: text("expertiseAreas").notNull(), // JSON array
  credentials: text("credentials").notNull(),
  experience: text("experience"),
  references: text("references"), // JSON array of references
  certifications: text("certifications"), // JSON array of cert documents
  motivation: text("motivation"),
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy").references(() => users.id),
  reviewNotes: text("reviewNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpertApplication = typeof expertApplications.$inferSelect;
export type InsertExpertApplication = typeof expertApplications.$inferInsert;

/**
 * Expert Assignments table - tracks which expert is assigned to which authentication
 */
export const expertAssignments = mysqlTable("expertAssignments", {
  id: int("id").autoincrement().primaryKey(),
  authenticationId: int("authenticationId").notNull().references(() => stampAuthentications.id, { onDelete: 'cascade' }),
  expertId: int("expertId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  assignedBy: int("assignedBy").notNull().references(() => users.id),
  status: mysqlEnum("status", ["assigned", "accepted", "declined", "in_progress", "completed"]).default("assigned").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  estimatedCompletionDays: int("estimatedCompletionDays"),
  compensation: decimal("compensation", { precision: 10, scale: 2 }),
  notes: text("notes"),
  acceptedAt: timestamp("acceptedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpertAssignment = typeof expertAssignments.$inferSelect;
export type InsertExpertAssignment = typeof expertAssignments.$inferInsert;

/**
 * Expert Reviews table - peer reviews and ratings
 */
export const expertReviews = mysqlTable("expertReviews", {
  id: int("id").autoincrement().primaryKey(),
  expertId: int("expertId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  reviewerId: int("reviewerId").notNull().references(() => users.id, { onDelete: 'cascade' }),
  authenticationId: int("authenticationId").references(() => stampAuthentications.id),
  rating: int("rating").notNull(), // 1-5 stars
  accuracy: int("accuracy"), // 1-5 for work accuracy
  timeliness: int("timeliness"), // 1-5 for meeting deadlines
  professionalism: int("professionalism"), // 1-5 for professional conduct
  comment: text("comment"),
  isPublic: boolean("isPublic").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpertReview = typeof expertReviews.$inferSelect;
export type InsertExpertReview = typeof expertReviews.$inferInsert;
/**
 * Stamp Archive table - stores metadata for stamps imported from Internet Archive
 */
export const stampArchive = mysqlTable("stampArchive", {
  id: int("id").autoincrement().primaryKey(),
  archiveId: varchar("archiveId", { length: 200 }).notNull().unique(),
  country: varchar("country", { length: 100 }).notNull(),
  denomination: decimal("denomination", { precision: 10, scale: 2 }).notNull(),
  year: int("year").notNull(),
  catalog: varchar("catalog", { length: 100 }).notNull(),
  condition: mysqlEnum("condition", ["mint", "used", "fine", "very_fine"]).notNull(),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "very_rare", "legendary"]).notNull(),
  description: text("description"),
  imageHash: varchar("imageHash", { length: 200 }).notNull(), // IPFS hash
  imageUrl: text("imageUrl").notNull(), // IPFS or Arweave URL
  originalImageUrl: text("originalImageUrl"), // Original Internet Archive URL
  usdValue: decimal("usdValue", { precision: 12, scale: 2 }).notNull(),
  stampCoinValue: int("stampCoinValue").notNull(),
  serialNumber: varchar("serialNumber", { length: 100 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StampArchive = typeof stampArchive.$inferSelect;
export type InsertStampArchive = typeof stampArchive.$inferInsert;

/**
 * Stamp Pricing History table - tracks price changes over time
 */
export const stampPricing = mysqlTable("stampPricing", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").notNull().references(() => stamps.id, { onDelete: 'cascade' }),
  archiveId: varchar("archiveId", { length: 200 }).references(() => stampArchive.archiveId),
  baseUsdPrice: decimal("baseUsdPrice", { precision: 12, scale: 2 }).notNull(),
  stampCoinPrice: int("stampCoinPrice").notNull(),
  conditionMultiplier: decimal("conditionMultiplier", { precision: 5, scale: 2 }).notNull(),
  rarityMultiplier: decimal("rarityMultiplier", { precision: 5, scale: 2 }).notNull(),
  finalPrice: decimal("finalPrice", { precision: 12, scale: 2 }).notNull(),
  priceSource: mysqlEnum("priceSource", ["manual", "market_data", "ai_estimated", "appraisal", "auction_result"]).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  validFrom: timestamp("validFrom").defaultNow().notNull(),
  validUntil: timestamp("validUntil"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StampPricing = typeof stampPricing.$inferSelect;
export type InsertStampPricing = typeof stampPricing.$inferInsert;

/**
 * NFT table - stores individual NFT records linked to stamps
 */
export const stampNFT = mysqlTable("stampNFT", {
  id: int("id").autoincrement().primaryKey(),
  stampId: int("stampId").references(() => stamps.id, { onDelete: 'set null' }),
  archiveId: varchar("archiveId", { length: 200 }).references(() => stampArchive.archiveId),
  serialNumber: varchar("serialNumber", { length: 100 }).notNull().unique(),
  nftTokenId: varchar("nftTokenId", { length: 100 }).notNull().unique(),
  contractAddress: varchar("contractAddress", { length: 100 }).notNull(),
  blockchainNetwork: varchar("blockchainNetwork", { length: 50 }).notNull(),
  ownerAddress: varchar("ownerAddress", { length: 100 }),
  ownerId: int("ownerId").references(() => users.id),
  metadataUri: text("metadataUri").notNull(), // IPFS or Arweave URI
  imageUri: text("imageUri").notNull(),
  nftType: mysqlEnum("nftType", ["collectible", "certificate", "deed", "license"]).default("collectible").notNull(),
  mintedAt: timestamp("mintedAt").defaultNow().notNull(),
  transactionHash: varchar("transactionHash", { length: 200 }),
  gasUsed: decimal("gasUsed", { precision: 18, scale: 8 }),
  gasCurrency: varchar("gasCurrency", { length: 10 }).default("ETH"),
  royaltyPercentage: decimal("royaltyPercentage", { precision: 5, scale: 2 }).default("5.00"),
  royaltyRecipient: varchar("royaltyRecipient", { length: 100 }),
  totalTransactions: int("totalTransactions").default(0),
  lastSoldAt: timestamp("lastSoldAt"),
  lastSoldPrice: decimal("lastSoldPrice", { precision: 12, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StampNFT = typeof stampNFT.$inferSelect;
export type InsertStampNFT = typeof stampNFT.$inferInsert;

/**
 * Platform Currency (StampCoin) table - tracks circulating supply
 */
export const platformCurrency = mysqlTable("platformCurrency", {
  id: int("id").autoincrement().primaryKey(),
  currencyName: varchar("currencyName", { length: 100 }).default("StampCoin").notNull(),
  currencySymbol: varchar("currencySymbol", { length: 10 }).default("STMP").notNull(),
  totalSupply: int("totalSupply").notNull(), // Total coins ever created
  circulatingSupply: int("circulatingSupply").notNull(), // Currently in circulation
  maxSupply: int("maxSupply"), // Hard cap on coins
  burnedSupply: int("burnedSupply").default(0), // Total coins burned
  priceUSD: decimal("priceUSD", { precision: 10, scale: 4 }).default("0.1000"),
  marketCap: decimal("marketCap", { precision: 18, scale: 2 }),
  volumeUSD: decimal("volumeUSD", { precision: 18, scale: 2 }),
  pegged: boolean("pegged").default(true), // Is it 1:1 pegged to value?
  pegValue: varchar("pegValue", { length: 100 }).default("0.1 USD"), // What is it pegged to?
  contractAddress: varchar("contractAddress", { length: 100 }),
  blockchainNetwork: varchar("blockchainNetwork", { length: 50 }),
  totalStampsInArchive: int("totalStampsInArchive").default(0),
  totalNFTsMinted: int("totalNFTsMinted").default(0),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformCurrency = typeof platformCurrency.$inferSelect;
export type InsertPlatformCurrency = typeof platformCurrency.$inferInsert;

/**
 * Currency Distribution Ledger - tracks how StampCoins are distributed
 */
export const currencyDistribution = mysqlTable("currencyDistribution", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id, { onDelete: 'set null' }),
  archiveId: varchar("archiveId", { length: 200 }).references(() => stampArchive.archiveId),
  nftId: int("nftId").references(() => stampNFT.id),
  distributionType: mysqlEnum("distributionType", ["mint", "purchase", "trade", "reward", "burn", "transfer"]).notNull(),
  amount: int("amount").notNull(), // Amount of StampCoins
  usdValue: decimal("usdValue", { precision: 12, scale: 2 }),
  relatedTransactionId: int("relatedTransactionId"),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CurrencyDistribution = typeof currencyDistribution.$inferSelect;
export type InsertCurrencyDistribution = typeof currencyDistribution.$inferInsert;