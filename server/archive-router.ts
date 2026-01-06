/**
 * Archive Stamp tRPC Routes
 * Handles stamp archive management, NFT minting, and currency distribution
 */

import { router, publicProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import * as archiveService from './stamp-archive';
import * as archiveDownloader from './archive-downloader';
import { getDb } from './db';
import {
  stampArchive,
  stampNFT,
  stampPricing,
  platformCurrency,
  currencyDistribution,
} from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import Decimal from 'decimal.js';

/**
 * Archive stamp router - manages digital stamp collection
 */
export const archiveRouter = router({
  /**
   * Get archive statistics
   */
  getStats: publicProcedure.query(async () => {
    try {
      const stats = await archiveService.getArchiveStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error('Error getting archive stats:', error);
      return {
        success: false,
        error: 'Failed to fetch statistics',
      };
    }
  }),

  /**
   * List all stamps in archive with pagination
   */
  listStamps: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']).optional(),
        country: z.string().optional(),
        minYear: z.number().optional(),
        maxYear: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { page, limit, rarity, country, minYear, maxYear } = opts.input;
      const offset = (page - 1) * limit;

      try {
        let query = db.select().from(stampArchive);

        // Apply filters
        if (rarity) {
          query = query.where(eq(stampArchive.rarity, rarity));
        }
        if (country) {
          query = query.where(sql`country LIKE ${`%${country}%`}`);
        }
        if (minYear) {
          query = query.where(sql`year >= ${minYear}`);
        }
        if (maxYear) {
          query = query.where(sql`year <= ${maxYear}`);
        }

        const stamps = await query.limit(limit).offset(offset);

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(stampArchive);
        const total = countResult[0]?.count || 0;

        return {
          success: true,
          data: stamps,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Error listing stamps:', error);
        return {
          success: false,
          error: 'Failed to list stamps',
        };
      }
    }),

  /**
   * Get single stamp details with pricing
   */
  getStamp: publicProcedure
    .input(z.object({ id: z.number().or(z.string()) }))
    .query(async (opts) => {
      const id = typeof opts.input.id === 'string' ? opts.input.id : String(opts.input.id);

      try {
        const stamp = await db.query.stampArchive.findFirst({
          where: eq(stampArchive.archiveId, id),
          with: {
            pricing: true,
            nft: true,
          },
        });

        if (!stamp) {
          return {
            success: false,
            error: 'Stamp not found',
          };
        }

        return {
          success: true,
          data: stamp,
        };
      } catch (error) {
        console.error('Error getting stamp:', error);
        return {
          success: false,
          error: 'Failed to fetch stamp',
        };
      }
    }),

  /**
   * Import stamps from sample archive (admin only)
   */
  importSampleStamps: protectedProcedure
    .input(
      z.object({
        count: z.number().default(20),
      }),
    )
    .mutation(async (opts) => {
      if (opts.ctx.user?.role !== 'admin') {
        throw new Error('Only admins can import stamps');
      }

      try {
        const samples = archiveDownloader.getSampleStamps(opts.input.count);
        const results = await archiveService.batchImportStamps(samples);

        const successCount = results.filter((r) => r.success).length;
        const failureCount = results.filter((r) => !r.success).length;

        return {
          success: true,
          imported: successCount,
          failed: failureCount,
          total: results.length,
          results,
        };
      } catch (error) {
        console.error('Error importing stamps:', error);
        throw error;
      }
    }),

  /**
   * Calculate pricing for a stamp
   */
  calculatePrice: publicProcedure
    .input(
      z.object({
        denomination: z.number(),
        year: z.number(),
        condition: z.enum(['mint', 'used', 'fine', 'very_fine']),
        rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']),
      }),
    )
    .query((opts) => {
      const metadata = {
        archiveId: 'temp',
        country: 'Unknown',
        denomination: opts.input.denomination,
        year: opts.input.year,
        catalog: '',
        condition: opts.input.condition,
        rarity: opts.input.rarity,
        description: '',
        imageUrl: '',
      };

      try {
        const pricing = archiveService.calculateStampValue(metadata);
        return {
          success: true,
          data: pricing,
        };
      } catch (error) {
        console.error('Error calculating price:', error);
        return {
          success: false,
          error: 'Failed to calculate price',
        };
      }
    }),

  /**
   * Mint NFT from stamp
   */
  mintNFT: protectedProcedure
    .input(
      z.object({
        stampArchiveId: z.string(),
        walletAddress: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      try {
        const nftData = await archiveService.createNFTFromStamp(
          opts.input.stampArchiveId,
          opts.input.walletAddress || opts.ctx.user!.openId,
        );

        // Store NFT in database
        const nft = await db.insert(stampNFT).values({
          archiveId: opts.input.stampArchiveId,
          serialNumber: nftData.serialNumber,
          nftTokenId: '0', // Will be updated after actual minting
          contractAddress: process.env.NFT_CONTRACT_ADDRESS || '',
          blockchainNetwork: process.env.NFT_CHAIN_ID === '1' ? 'ethereum' : 'polygon',
          ownerId: opts.ctx.user!.id,
          ownerAddress: opts.input.walletAddress,
          metadataUri: 'ipfs://temp', // Will be updated with actual IPFS hash
          imageUri: 'ipfs://temp',
          nftType: 'collectible',
        });

        // Distribute StampCoins
        await db.insert(currencyDistribution).values({
          userId: opts.ctx.user!.id,
          archiveId: opts.input.stampArchiveId,
          nftId: nft[0].id,
          distributionType: 'mint',
          amount: nftData.stampCoinValue,
          status: 'completed',
        });

        return {
          success: true,
          data: {
            nft: nft[0],
            stampCoins: nftData.stampCoinValue,
            serialNumber: nftData.serialNumber,
          },
        };
      } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
      }
    }),

  /**
   * Get platform currency stats
   */
  getCurrencyStats: publicProcedure.query(async () => {
    try {
      const currency = await db.query.platformCurrency.findFirst();

      if (!currency) {
        // Create initial currency record
        const initial = await db.insert(platformCurrency).values({
          currencyName: 'StampCoin',
          currencySymbol: 'STMP',
          totalSupply: 0,
          circulatingSupply: 0,
          maxSupply: 1000000,
          burnedSupply: 0,
          priceUSD: new Decimal('0.1000'),
        });

        return {
          success: true,
          data: initial[0],
        };
      }

      return {
        success: true,
        data: currency,
      };
    } catch (error) {
      console.error('Error getting currency stats:', error);
      return {
        success: false,
        error: 'Failed to fetch currency stats',
      };
    }
  }),

  /**
   * Get currency distribution breakdown
   */
  getCurrencyDistribution: publicProcedure.query(async () => {
    try {
      const distribution = await db
        .select({
          type: currencyDistribution.distributionType,
          count: sql<number>`count(*)`,
          total: sql<number>`sum(amount)`,
        })
        .from(currencyDistribution)
        .groupBy(currencyDistribution.distributionType);

      const byStatus = await db
        .select({
          status: currencyDistribution.status,
          count: sql<number>`count(*)`,
          total: sql<number>`sum(amount)`,
        })
        .from(currencyDistribution)
        .groupBy(currencyDistribution.status);

      return {
        success: true,
        data: {
          byType: distribution,
          byStatus,
        },
      };
    } catch (error) {
      console.error('Error getting distribution:', error);
      return {
        success: false,
        error: 'Failed to fetch distribution',
      };
    }
  }),

  /**
   * Get user's NFTs and StampCoin balance
   */
  getUserAssets: protectedProcedure.query(async (opts) => {
    try {
      const nfts = await db.query.stampNFT.findMany({
        where: eq(stampNFT.ownerId, opts.ctx.user!.id),
      });

      const coinBalance = await db
        .select({ total: sql<number>`coalesce(sum(amount), 0)` })
        .from(currencyDistribution)
        .where(eq(currencyDistribution.userId, opts.ctx.user!.id));

      return {
        success: true,
        data: {
          nfts,
          stampCoinBalance: coinBalance[0]?.total || 0,
        }
      };
    } catch (error) {
      console.error('Error getting user assets:', error);
      throw error;
    }
  }),

  /**
   * Search stamps by criteria
   */
  searchStamps: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        filters: z
          .object({
            country: z.string().optional(),
            rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']).optional(),
            minYear: z.number().optional(),
            maxYear: z.number().optional(),
            minPrice: z.number().optional(),
            maxPrice: z.number().optional(),
          })
          .optional(),
      }),
    )
    .query(async (opts) => {
      try {
        // This would typically use full-text search
        // For now, simple filter-based search
        const { query, filters } = opts.input;

        let dbQuery = db.select().from(stampArchive);

        if (query) {
          dbQuery = dbQuery.where(
            sql`description LIKE ${`%${query}%`} OR country LIKE ${`%${query}%`}`,
          );
        }

        if (filters?.country) {
          dbQuery = dbQuery.where(
            sql`country LIKE ${`%${filters.country}%`}`,
          );
        }

        if (filters?.rarity) {
          dbQuery = dbQuery.where(eq(stampArchive.rarity, filters.rarity));
        }

        if (filters?.minYear) {
          dbQuery = dbQuery.where(sql`year >= ${filters.minYear}`);
        }

        if (filters?.maxYear) {
          dbQuery = dbQuery.where(sql`year <= ${filters.maxYear}`);
        }

        if (filters?.minPrice) {
          dbQuery = dbQuery.where(sql`usdValue >= ${filters.minPrice}`);
        }

        if (filters?.maxPrice) {
          dbQuery = dbQuery.where(sql`usdValue <= ${filters.maxPrice}`);
        }

        const results = await dbQuery.limit(100);

        return {
          success: true,
          data: results,
          count: results.length,
        };
      } catch (error) {
        console.error('Error searching stamps:', error);
        return {
          success: false,
          error: 'Search failed',
        };
      }
    }),
});
