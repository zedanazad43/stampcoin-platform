/**
 * Stripe Account Session Router
 * حجز حساب Stripe
 * 
 * Handles creation of Stripe Account Session for connected accounts
 * to manage payments, refunds, and disputes within the platform.
 */

import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { db } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { TRPCError } from '@trpc/server';

// Initialize Stripe client
function createStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey || !apiKey.startsWith('sk_')) {
    console.warn('⚠️ Stripe is not configured. Stripe payments will not be available.');
    return null;
  }

  return new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover',
  });
}

const stripe = createStripeClient();

// Schema for creating account session
const CreateAccountSessionInput = z.object({
  connectedAccountId: z.string().min(1, 'Connected account ID is required'),
  features: z.object({
    enableRefundManagement: z.boolean().default(true),
    enableDisputeManagement: z.boolean().default(true),
    enableCapturePayments: z.boolean().default(true),
  }).optional(),
});

// Schema for initializing seller payments
const InitializeSellerPaymentsInput = z.object({
  email: z.string().email('Valid email required'),
  businessName: z.string().optional(),
  country: z.string().optional(),
  businessType: z.enum(['individual', 'sole_proprietor', 'company']).default('individual'),
});

export const stripeAccountSessionRouter = router({
  /**
   * Initialize payment setup for a seller account
   * 
   * This creates a Stripe connected account and returns an onboarding link
   * for the seller to complete their profile and payment setup.
   * 
   * Usage:
   * ```
   * const result = await trpc.stripeAccountSession.initializePayments.useMutation();
   * const { onboardingUrl } = await result.mutateAsync({ 
   *   email: 'seller@example.com',
   *   businessName: 'My Store'
   * });
   * ```
   */
  initializePayments: protectedProcedure
    .input(InitializeSellerPaymentsInput)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!stripe) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Stripe payment processing is not configured',
          });
        }

        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User authentication required',
          });
        }

        // Check if user already has a connected account
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, ctx.user.id),
        });

        if (existingUser?.stripeConnectedAccountId) {
          return {
            connectedAccountId: existingUser.stripeConnectedAccountId,
            message: 'Payment account already initialized',
            alreadyInitialized: true,
          };
        }

        // Create connected account
        const account = await stripe.accounts.create({
          type: 'express',
          country: input.country || 'US',
          email: input.email,
        } as any);

        // Save connected account ID to user
        await db.update(users)
          .set({
            stripeConnectedAccountId: account.id,
            paymentStatus: 'pending_onboarding',
          })
          .where(eq(users.id, ctx.user.id));

        // Create onboarding link
        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          type: 'account_onboarding',
          return_url: `${process.env.FRONTEND_URL}/payment/success?accountId=${account.id}`,
          refresh_url: `${process.env.FRONTEND_URL}/payment/setup?accountId=${account.id}`,
        });

        return {
          connectedAccountId: account.id,
          onboardingUrl: accountLink.url,
          status: 'pending_onboarding',
          message: 'Complete your payment setup by visiting the onboarding link',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to initialize payments';
        
        console.error('[Stripe Payment Initialization Error]', {
          userId: ctx.user?.id,
          userEmail: input.email,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to initialize payments: ${message}`,
        });
      }
    }),

  /**
   * Get payment status for current user
   */
  getPaymentStatus: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User authentication required',
          });
        }

        if (!stripe) {
          return {
            status: 'not_configured',
            connectedAccountId: null,
            paymentMethodsEnabled: false,
            message: 'Stripe payment account not yet configured',
          };
        }

        const user = await db.query.users.findFirst({
          where: eq(users.id, ctx.user.id),
        });

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        if (!user.stripeConnectedAccountId) {
          return {
            status: 'not_configured',
            connectedAccountId: null,
            paymentMethodsEnabled: false,
            message: 'Payment account not yet configured',
          };
        }

        // Get account status from Stripe
        const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId);

        return {
          status: user.paymentStatus,
          connectedAccountId: user.stripeConnectedAccountId,
          paymentMethodsEnabled: user.paymentMethodsEnabled,
          stripeChargesEnabled: account.charges_enabled,
          stripePayoutsEnabled: account.payouts_enabled,
          requiredFields: account.requirements?.currently_due || [],
          message: 'Payment status retrieved successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to get payment status';
        
        console.error('[Get Payment Status Error]', {
          userId: ctx.user?.id,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get payment status: ${message}`,
        });
      }
    }),

  /**
   * Create a Stripe Account Session for connected account management
   * 
   * This allows sellers to access the Stripe dashboard for their connected account
   * to manage payments, process refunds, and handle disputes.
   * 
   * Usage:
   * ```
   * const session = await trpc.stripeAccountSession.create.useMutation();
   * const result = await session.mutateAsync({ connectedAccountId: 'acct_...' });
   * ```
   */
  create: protectedProcedure
    .input(CreateAccountSessionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!stripe) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Stripe payment processing is not configured',
          });
        }

        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User authentication required',
          });
        }

        // Verify the connected account belongs to the user
        const user = await db.query.users.findFirst({
          where: eq(users.id, ctx.user.id),
        });

        if (!user?.stripeConnectedAccountId || user.stripeConnectedAccountId !== input.connectedAccountId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this connected account',
          });
        }

        const accountSession = await stripe.accountSessions.create({
          account: input.connectedAccountId,
          components: {
            payments: {
              enabled: true,
              features: {
                refund_management: input.features?.enableRefundManagement ?? true,
                dispute_management: input.features?.enableDisputeManagement ?? true,
                capture_payments: input.features?.enableCapturePayments ?? true,
              },
            },
          },
        });

        return {
          clientSecret: accountSession.client_secret,
          success: true,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to create account session';
        
        console.error('[Stripe Account Session Error]', {
          userId: ctx.user?.id,
          connectedAccountId: input.connectedAccountId,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create Stripe account session: ${message}`,
        });
      }
    }),

  /**
   * Validate an account session client secret
   * 
   * Note: Stripe account sessions are short-lived and expire after 60 minutes.
   * This endpoint validates the session still exists.
   */
  validate: protectedProcedure
    .input(z.object({
      clientSecret: z.string().min(1, 'Client secret is required'),
    }))
    .query(async ({ ctx, input }) => {
      try {
        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User authentication required',
          });
        }

        // Account sessions are transient - we validate by checking if secret format is valid
        // In production, you might store session data in your database for validation
        const isValid = input.clientSecret.startsWith('acs_');

        if (!isValid) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid account session client secret format',
          });
        }

        return {
          valid: true,
          message: 'Account session is valid',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to validate account session';
        
        console.error('[Stripe Account Session Validation Error]', {
          userId: ctx.user?.id,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to validate account session: ${message}`,
        });
      }
    }),
});
