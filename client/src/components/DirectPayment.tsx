/**
 * Direct Payment Component
 * مكون الدفع المباشر
 * 
 * Allows users to pay directly for stamp purchases
 * يسمح للمستخدمين بالدفع مباشرة لشراء الطوابع
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface DirectPaymentProps {
  stampId: number;
  stampTitle: string;
  amount: number;
  currency?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

export function DirectPayment({
  stampId,
  stampTitle,
  amount,
  currency = 'USD',
  onSuccess,
  onError,
}: DirectPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const createPaymentMutation = trpc.directPayment.createPaymentSession.useMutation({
    onSuccess: (data) => {
      setPaymentStatus('success');
      onSuccess?.(data.sessionId);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      setPaymentStatus('error');
      const message = error.message || 'Failed to create payment session';
      setErrorMessage(message);
      onError?.(message);
    },
  });

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      await createPaymentMutation.mutateAsync({
        stampId,
        amount,
        currency,
        stampTitle,
        description: `Purchase of ${stampTitle}`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      // Error is handled by the mutation callback
    } finally {
      setIsLoading(false);
    }
  };

  // Check if Stripe is configured
  const statusQuery = trpc.directPayment.getPaymentStatus.useQuery();
  const stripeEnabled = statusQuery.data?.configured ?? false;

  if (!stripeEnabled) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Payment Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700">
            Payment processing is currently not configured. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Stamp</CardTitle>
        <CardDescription>
          {stampTitle} - {amount} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">
              <AlertCircle className="mb-1 inline h-4 w-4" /> {errorMessage}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Price:</span>
            <span className="text-lg font-bold">
              {amount} {currency}
            </span>
          </div>
        </div>

        {paymentStatus === 'success' && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700">
              Payment session created. Redirecting to payment...
            </p>
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isLoading || paymentStatus === 'success'}
          className="w-full"
          size="lg"
        >
          {isLoading || paymentStatus === 'processing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Payment Initiated
            </>
          ) : (
            'Pay with Card'
          )}
        </Button>

        <p className="text-xs text-gray-500">
          💳 Powered by Stripe. Your payment is secure and encrypted.
        </p>
      </CardContent>
    </Card>
  );
}

export default DirectPayment;
