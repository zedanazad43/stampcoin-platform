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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
