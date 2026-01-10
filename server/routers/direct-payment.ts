/**
 * Direct Payment Router - جهاز توجيه الدفع المباشر
 * 
 * Handles direct payments to the platform owner's Stripe account
 * يتعامل مع الدفعات المباشرة لحساب مالك المنصة على Stripe
 */

import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../_core/trpc';
import Stripe from 'stripe';
import { TRPCError } from '@trpc/server';

// Initialize Stripe client
function createStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null; // Return null if Stripe is not configured
  }

  return new Stripe(apiKey, {
    apiVersion: '2025-12-15.clover',
  });
}

const stripe = createStripeClient();

// Schema for creating a payment
const CreatePaymentInput = z.object({
  stampId: z.number(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  stampTitle: z.string().optional(),
  description: z.string().optional(),
});

export const directPaymentRouter = router({
  /**
   * Create a payment session to pay directly to the platform owner
   * إنشاء جلسة دفع للدفع المباشر لمالك المنصة
   * 
   * This creates a Stripe Checkout session where payment goes directly
   * to the platform owner's Stripe account.
   */
  createPaymentSession: publicProcedure
    .input(CreatePaymentInput)
    .mutation(async ({ input, ctx }) => {
      try {
        if (!stripe) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Stripe payment processing is not configured',
          });
        }

        const origin = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Create checkout session with direct payment to platform owner
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: input.currency.toLowerCase(),
                product_data: {
                  name: input.stampTitle || `Stamp Purchase #${input.stampId}`,
                  description: input.description || `Digital stamp NFT purchase`,
                },
                unit_amount: Math.round(input.amount * 100), // Amount in cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${origin}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/marketplace/stamp/${input.stampId}?payment=cancelled`,
          customer_email: ctx.user?.email || undefined,
          client_reference_id: ctx.user?.id.toString() || 'anonymous',
          metadata: {
            stamp_id: input.stampId.toString(),
            user_id: ctx.user?.id.toString() || 'anonymous',
            user_email: ctx.user?.email || 'anonymous',
            payment_type: 'direct_purchase',
          },
          allow_promotion_codes: true,
          billing_address_collection: 'auto',
        });

        if (!session.url) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to generate payment session URL',
          });
        }

        return {
          sessionId: session.id,
          url: session.url,
          success: true,
          message: 'Payment session created successfully',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to create payment session';
        
        console.error('[Direct Payment Error]', {
          stampId: input.stampId,
          amount: input.amount,
          error: message,
          userId: ctx.user?.id,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create payment session: ${message}`,
        });
      }
    }),

  /**
   * Get payment status and details
   * الحصول على حالة الدفع والتفاصيل
   */
  getSessionStatus: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        if (!stripe) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Stripe payment processing is not configured',
          });
        }

        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        return {
          sessionId: session.id,
          paymentStatus: session.payment_status, // paid, unpaid, no_payment_required
          status: session.status, // open, complete, expired
          amountTotal: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency?.toUpperCase(),
          customerEmail: session.customer_email,
          success: session.payment_status === 'paid',
          message: session.payment_status === 'paid' ? 'Payment completed' : 'Payment pending',
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get payment status';
        
        console.error('[Get Payment Status Error]', {
          sessionId: input.sessionId,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get payment status: ${message}`,
        });
      }
    }),

  /**
   * Get Stripe configuration status
   * الحصول على حالة إعدادات Stripe
   */
  getPaymentStatus: publicProcedure
    .query(async () => {
      const isConfigured = !!stripe;
      const secretKeyExists = !!process.env.STRIPE_SECRET_KEY;

      return {
        configured: isConfigured && secretKeyExists,
        message: isConfigured 
          ? 'Payment processing is enabled' 
          : 'Payment processing is not configured',
        stripeEnabled: isConfigured,
      };
    }),
});
