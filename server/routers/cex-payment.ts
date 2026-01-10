/**
 * CEX.io Payment Router
 * جهاز توجيه الدفع عبر CEX.io
 * 
 * Handles payments via CEX.io transfer/crypto wallet
 * يتعامل مع الدفعات عبر تحويلات CEX.io
 */

import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../_core/trpc';
import { TRPCError } from '@trpc/server';

// Schema for creating CEX.io payment instruction
const CreateCexPaymentInput = z.object({
  stampId: z.number(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  stampTitle: z.string().optional(),
  description: z.string().optional(),
});

// Schema for confirming payment
const ConfirmCexPaymentInput = z.object({
  stampId: z.number(),
  transactionHash: z.string().optional(),
  notes: z.string().optional(),
});

export const cexPaymentRouter = router({
  /**
   * Get CEX.io payment instructions
   * الحصول على تعليمات الدفع عبر CEX.io
   */
  getPaymentInstructions: publicProcedure
    .input(CreateCexPaymentInput)
    .query(async ({ input }) => {
      try {
        const cexUserId = process.env.CEX_IO_USER_ID;
        const cexEnabled = process.env.CEX_IO_ENABLED === 'true';

        if (!cexEnabled || !cexUserId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'CEX.io payment processing is not configured',
          });
        }

        return {
          success: true,
          paymentMethod: 'cex_io',
          recipientUserId: cexUserId,
          amount: input.amount,
          currency: input.currency,
          stampId: input.stampId,
          stampTitle: input.stampTitle || `Stamp #${input.stampId}`,
          instructions: [
            `1. البند | ITEM: ${input.stampTitle || `Stamp #${input.stampId}`}`,
            `2. المبلغ | AMOUNT: ${input.amount} ${input.currency}`,
            `3. عنوان المستقبل | RECIPIENT: CEX.io User ID ${cexUserId}`,
            `4. اذهب إلى منصة CEX.io | Go to CEX.io`,
            `5. اختر التحويل/الدفع | Select Transfer/Payment`,
            `6. أدخل معرّف المستخدم | Enter User ID: ${cexUserId}`,
            `7. أدخل المبلغ | Enter Amount: ${input.amount} ${input.currency}`,
            `8. أكمل المعاملة | Complete the transaction`,
            `9. أرسل التفاصيل هنا | Submit proof of payment`,
          ],
          deeplink: `https://cex.io/payments`,
          message: `Please send ${input.amount} ${input.currency} to CEX.io User ID ${cexUserId}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to get payment instructions';
        
        console.error('[CEX.io Payment Instructions Error]', {
          stampId: input.stampId,
          amount: input.amount,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to get payment instructions: ${message}`,
        });
      }
    }),

  /**
   * Create payment record for CEX.io transfer
   * إنشاء سجل دفع لتحويل CEX.io
   */
  createPaymentRecord: protectedProcedure
    .input(CreateCexPaymentInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const cexUserId = process.env.CEX_IO_USER_ID;

        if (!cexUserId) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'CEX.io is not configured',
          });
        }

        // Return payment record info
        return {
          success: true,
          paymentId: `cex_${input.stampId}_${Date.now()}`,
          recipientUserId: cexUserId,
          amount: input.amount,
          currency: input.currency,
          stampId: input.stampId,
          userId: ctx.user?.id,
          status: 'pending',
          createdAt: new Date(),
          message: 'Payment instructions generated. Please complete the transfer on CEX.io',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        const message = error instanceof Error ? error.message : 'Failed to create payment record';
        
        console.error('[CEX.io Create Payment Error]', {
          stampId: input.stampId,
          amount: input.amount,
          userId: ctx.user?.id,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to create payment record: ${message}`,
        });
      }
    }),

  /**
   * Verify CEX.io payment completion
   * التحقق من إكمال الدفع عبر CEX.io
   * 
   * In production, this would verify with CEX.io API
   * في الإنتاج، سيتحقق من واجهة برمجية CEX.io
   */
  verifyPayment: protectedProcedure
    .input(ConfirmCexPaymentInput)
    .mutation(async ({ input, ctx }) => {
      try {
        // In a real implementation, you would:
        // 1. Call CEX.io API to verify the transaction
        // 2. Check if the amount matches
        // 3. Confirm the sender
        
        return {
          success: true,
          status: 'pending_verification',
          message: 'Payment received. Admin will verify within 24 hours.',
          stampId: input.stampId,
          transactionHash: input.transactionHash,
          notes: input.notes,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to verify payment';
        
        console.error('[CEX.io Verify Payment Error]', {
          stampId: input.stampId,
          userId: ctx.user?.id,
          error: message,
        });

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to verify payment: ${message}`,
        });
      }
    }),

  /**
   * Get CEX.io configuration status
   * الحصول على حالة إعدادات CEX.io
   */
  getPaymentStatus: publicProcedure
    .query(async () => {
      const isConfigured = !!process.env.CEX_IO_USER_ID && process.env.CEX_IO_ENABLED === 'true';
      const userId = process.env.CEX_IO_USER_ID;

      return {
        configured: isConfigured,
        message: isConfigured 
          ? 'CEX.io payments are enabled' 
          : 'CEX.io payments are not configured',
        cexEnabled: isConfigured,
        userId: isConfigured ? userId : null,
      };
    }),
});
