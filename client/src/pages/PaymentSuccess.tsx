/**
 * Payment Success Page
 * صفحة نجاح الدفع
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export function PaymentSuccess() {
  const [location] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Extract sessionId from URL
  const sessionId = new URLSearchParams(location.split('?')[1]).get('sessionId');

  const statusQuery = trpc.directPayment.getSessionStatus.useQuery(
    { sessionId: sessionId || '' },
    {
      enabled: !!sessionId,
    }
  );

  useEffect(() => {
    if (statusQuery.data?.success) {
      setPaymentStatus('success');
    } else if (statusQuery.data && !statusQuery.data.success) {
      setPaymentStatus('error');
      setErrorMessage('Payment is still pending or was not completed.');
    } else if (statusQuery.isError) {
      setPaymentStatus('error');
      setErrorMessage(statusQuery.error?.message || 'Failed to verify payment');
    } else if (statusQuery.isLoading) {
      setPaymentStatus('loading');
    }
  }, [statusQuery.data, statusQuery.isError, statusQuery.isLoading]);

  useEffect(() => {
    // Optional: Auto-redirect after delay
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>نتيجة الدفع</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentStatus === 'loading' && (
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-gray-600">Verifying payment...</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your payment has been received and processed successfully.
                </p>
              </div>
              {statusQuery.data && (
                <div className="text-sm text-gray-600 border-t pt-4">
                  <p>
                    <strong>Amount:</strong> {statusQuery.data.amountTotal} {statusQuery.data.currency}
                  </p>
                  <p className="mt-2">
                    <strong>Session ID:</strong> {sessionId}
                  </p>
                </div>
              )}
              <Button 
                onClick={() => { window.location.href = '/dashboard'; }} 
                className="w-full mt-4"
              >
                View My Stamps
              </Button>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-700">Payment Failed</h3>
                <p className="text-sm text-gray-600 mt-2">{errorMessage}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { window.location.href = '/marketplace'; }} 
                  className="flex-1"
                >
                  Back to Marketplace
                </Button>
                <Button onClick={() => window.history.back()} className="flex-1">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccess;
