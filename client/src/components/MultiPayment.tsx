/**
 * Multi-Payment Component
 * مكون الدفع المتعدد
 * 
 * Allows users to choose between multiple payment methods
 * يسمح للمستخدمين باختيار طرق الدفع المختلفة
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

interface MultiPaymentProps {
  stampId: number;
  stampTitle: string;
  amount: number;
  currency?: string;
  onSuccess?: (method: string, data: any) => void;
  onError?: (error: string) => void;
}

export function MultiPayment({
  stampId,
  stampTitle,
  amount,
  currency = 'USD',
  onSuccess,
  onError,
}: MultiPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'cex' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get payment statuses
  const stripeStatus = trpc.directPayment.getPaymentStatus.useQuery();
  const cexStatus = trpc.cexPayment.getPaymentStatus.useQuery();

  // Stripe payment mutation
  const stripeMutation = trpc.directPayment.createPaymentSession.useMutation({
    onSuccess: (data) => {
      onSuccess?.('stripe', data);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      onError?.(error.message);
      setIsLoading(false);
    },
  });

  // CEX payment mutation
  const cexMutation = trpc.cexPayment.getPaymentInstructions.useQuery(
    {
      stampId,
      amount,
      currency,
      stampTitle,
    },
    {
      enabled: false,
    }
  );

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      await stripeMutation.mutateAsync({
        stampId,
        amount,
        currency,
        stampTitle,
        description: `Purchase of ${stampTitle}`,
      });
    } catch (error) {
      console.error('Stripe payment error:', error);
      setIsLoading(false);
    }
  };

  const handleCexPayment = async () => {
    setIsLoading(true);
    try {
      const result = await cexMutation.refetch();
      if (result.data) {
        onSuccess?.('cex', result.data);
        // Optionally show instructions modal or navigate to instructions page
        window.location.href = `/payment/cex?stampId=${stampId}&amount=${amount}`;
      }
    } catch (error) {
      console.error('CEX payment error:', error);
      onError?.('Failed to get payment instructions');
      setIsLoading(false);
    }
  };

  const stripeAvailable = stripeStatus.data?.configured ?? false;
  const cexAvailable = cexStatus.data?.configured ?? false;

  if (!stripeAvailable && !cexAvailable) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            No Payment Methods Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">
            Payment processing is currently not configured. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Payment Method</CardTitle>
        <CardDescription>
          {stampTitle} - {amount} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Summary */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Price:</span>
            <span className="text-lg font-bold">
              {amount} {currency}
            </span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Stripe Option */}
          {stripeAvailable && (
            <button
              onClick={handleStripePayment}
              disabled={isLoading || selectedMethod === 'cex'}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">💳 Credit Card (Stripe)</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Fast and secure card payment processing
                  </p>
                </div>
                {selectedMethod === 'stripe' && !isLoading && (
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                )}
                {selectedMethod === 'stripe' && isLoading && (
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                )}
              </div>
            </button>
          )}

          {/* CEX.io Option */}
          {cexAvailable && (
            <button
              onClick={handleCexPayment}
              disabled={isLoading || selectedMethod === 'stripe'}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedMethod === 'cex'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">₿ CEX.io Transfer</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Transfer funds via CEX.io User ID: {cexStatus.data?.userId}
                  </p>
                </div>
                {selectedMethod === 'cex' && !isLoading && (
                  <ArrowRight className="h-5 w-5 text-orange-600" />
                )}
                {selectedMethod === 'cex' && isLoading && (
                  <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {stripeAvailable && (
            <Button
              onClick={handleStripePayment}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && selectedMethod === 'stripe' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Card Payment
                </>
              )}
            </Button>
          )}

          {cexAvailable && (
            <Button
              onClick={handleCexPayment}
              disabled={isLoading}
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              {isLoading && selectedMethod === 'cex' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  CEX.io
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          ✓ All payments are secure and encrypted
        </p>
      </CardContent>
    </Card>
  );
}

export default MultiPayment;
