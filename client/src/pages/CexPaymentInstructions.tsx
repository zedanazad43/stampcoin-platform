/**
 * CEX Payment Instructions Page
 * صفحة تعليمات الدفع عبر CEX.io
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, ExternalLink, AlertCircle } from 'lucide-react';

export function CexPaymentInstructions() {
  const [location] = useLocation();
  const [copied, setCopied] = useState(false);

  // Extract params from URL
  const params = new URLSearchParams(location.split('?')[1]);
  const stampId = parseInt(params.get('stampId') || '0');
  const amount = parseFloat(params.get('amount') || '0');
  const currency = params.get('currency') || 'USD';

  // Get CEX payment instructions
  const instructions = trpc.cexPayment.getPaymentInstructions.useQuery(
    {
      stampId,
      amount,
      currency,
      stampTitle: `Stamp #${stampId}`,
    },
    {
      enabled: stampId > 0 && amount > 0,
    }
  );

  const handleCopyUserId = () => {
    if (instructions.data?.recipientUserId) {
      navigator.clipboard.writeText(instructions.data.recipientUserId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (instructions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Loading payment instructions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (instructions.isError || !instructions.data?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Payment Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {instructions.error?.message || 'Failed to load payment instructions'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const data = instructions.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">CEX.io Payment Instructions</h1>
          <p className="text-gray-600">تعليمات الدفع عبر CEX.io</p>
        </div>

        {/* Payment Summary Card */}
        <Card className="border-2 border-orange-200 bg-white">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-900">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Item</p>
                <p className="font-semibold text-gray-900">{data.stampTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {data.amount} {data.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient</p>
                <p className="font-semibold text-gray-900">CEX.io User ID</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipient ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-gray-900">{data.recipientUserId}</p>
                  <button
                    onClick={handleCopyUserId}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Instructions */}
        <Card className="border-2 border-blue-200 bg-white">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">Step-by-Step Instructions</CardTitle>
            <CardDescription>Follow these steps to complete your payment</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-4">
              {data.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-yellow-800">
            <p>
              ⚠️ Please ensure you enter the correct amount and recipient user ID.
            </p>
            <p>
              📱 Save a screenshot of your transaction for verification purposes.
            </p>
            <p>
              ⏱️ Payment verification may take up to 24 hours.
            </p>
            <p>
              🔒 Your transaction is secure and will be verified by our admin team.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => window.open('https://cex.io', '_blank')}
            className="bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Go to CEX.io
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
          >
            Back to Marketplace
          </Button>
        </div>

        {/* Confirmation Card */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900">After you send the payment</h3>
                <p className="text-sm text-green-800 mt-2">
                  Please contact us with your transaction details so we can verify and complete your purchase.
                </p>
                <p className="text-sm text-green-700 mt-3 font-mono">
                  Transaction Receipt: [Submit on next page]
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CexPaymentInstructions;
