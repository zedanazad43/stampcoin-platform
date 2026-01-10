# 🔐 نظام الدفع المباشر إلى حسابك - Direct Payment System
# Direct Payment System to Your Stripe Account

## نظرة عامة | Overview

تم تكوين منصة StampCoin لقبول الدفعات مباشرة إلى حسابك على Stripe (azadzedan13@gmail.com).

The StampCoin platform has been configured to accept direct payments to your Stripe account (azadzedan13@gmail.com).

---

## 🎯 المميزات الرئيسية | Key Features

✅ **الدفع المباشر** - Customers pay directly to your Stripe account
✅ **آمن وموثوق** - Secure Stripe payment processing
✅ **متابعة الدفع** - Real-time payment status tracking
✅ **تكامل كامل** - Fully integrated with the marketplace
✅ **لا عمولات إضافية** - No additional platform fees (Stripe fees only)

---

## 🔧 التكوين | Configuration

### متغيرات البيئة | Environment Variables

```dotenv
# في .env.local أو .env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_ENABLED=true
```

---

## 📱 واجهات المستخدم | User Interfaces

### 1. مكون الدفع | Payment Component

**المسار:** `client/src/components/DirectPayment.tsx`

استخدام سهل في أي صفحة:

```tsx
import { DirectPayment } from '@/components/DirectPayment';

export function StampDetail() {
  return (
    <DirectPayment
      stampId={123}
      stampTitle="Rare 1954 Egyptian Stamp"
      amount={49.99}
      currency="USD"
      onSuccess={(sessionId) => console.log('Payment success:', sessionId)}
      onError={(error) => console.error('Payment error:', error)}
    />
  );
}
```

**الخصائص | Props:**
- `stampId` (number) - معرف الطابع | Stamp ID
- `stampTitle` (string) - عنوان الطابع | Stamp title
- `amount` (number) - المبلغ بالدولار | Amount in USD
- `currency` (string) - العملة (افتراضي: USD) | Currency code
- `onSuccess` (function) - دالة عند النجاح | Success callback
- `onError` (function) - دالة عند الخطأ | Error callback

### 2. صفحة نتيجة الدفع | Payment Success Page

**المسار:** `client/src/pages/PaymentSuccess.tsx`

متوفرة تلقائياً عند:
- URL: `/payment/success?sessionId={CHECKOUT_SESSION_ID}`

تعرض:
- ✅ حالة الدفع | Payment status
- 💰 مبلغ الدفع | Payment amount
- 📋 معرف الجلسة | Session ID
- 🔄 إعادة التوجيه التلقائي | Auto-redirect to dashboard

---

## 🛠️ واجهات برمجية (API) | APIs

### tRPC Endpoints

#### 1. إنشاء جلسة دفع | Create Payment Session

```typescript
const result = await trpc.directPayment.createPaymentSession.mutate({
  stampId: 123,
  amount: 49.99,
  currency: 'USD',
  stampTitle: 'Rare Stamp',
  description: 'Purchase of rare stamp'
});

// النتيجة | Response:
{
  sessionId: 'cs_test_...',
  url: 'https://checkout.stripe.com/...',
  success: true,
  message: 'Payment session created successfully'
}
```

#### 2. الحصول على حالة الدفع | Get Session Status

```typescript
const status = await trpc.directPayment.getSessionStatus.query({
  sessionId: 'cs_test_...'
});

// النتيجة | Response:
{
  sessionId: 'cs_test_...',
  paymentStatus: 'paid', // paid, unpaid, no_payment_required
  status: 'complete', // open, complete, expired
  amountTotal: 49.99,
  currency: 'USD',
  customerEmail: 'customer@example.com',
  success: true,
  message: 'Payment completed'
}
```

#### 3. التحقق من إعدادات الدفع | Get Payment Status

```typescript
const config = await trpc.directPayment.getPaymentStatus.query();

// النتيجة | Response:
{
  configured: true,
  message: 'Payment processing is enabled',
  stripeEnabled: true
}
```

---

## 📊 تدفق العملية | Payment Flow

```
1. العميل يضغط على "Pay with Card" | Customer clicks "Pay with Card"
   ↓
2. تنشيء جلسة دفع | Create payment session via API
   ↓
3. إعادة التوجيه إلى Stripe | Redirect to Stripe Checkout
   ↓
4. إدخال بيانات الدفع | Enter payment details
   ↓
5. معالجة الدفع | Process payment
   ↓
6. إعادة التوجيه إلى صفحة النجاح | Redirect to success page
   ↓
7. عرض التأكيد | Display confirmation
   ↓
8. إعادة التوجيه التلقائي للحساب | Auto-redirect to dashboard
```

---

## 💳 بيانات الدفع | Payment Details

عند إتمام عملية الدفع، يتم تسجيل:

- **معرف الجلسة** | Session ID: معرف فريد للجلسة
- **بيانات العميل** | Customer data: البريد الإلكتروني والاسم
- **معرف الطابع** | Stamp ID: الطابع المشترى
- **المبلغ** | Amount: المبلغ المدفوع
- **نوع الدفع** | Payment type: `direct_purchase`

---

## 🔄 Webhook Events

عند استقبال events من Stripe:

### `checkout.session.completed`
```typescript
// معالج | Handler: handleCheckoutSessionCompleted()
- ✅ تسجيل المعاملة في قاعدة البيانات
- ✅ تحديث حالة المعاملة إلى "completed"
- ✅ تسجيل معرف الجلسة
```

### `account.updated`
```typescript
// معالج | Handler: handleAccountUpdated()
- ✅ تحديث حالة حساب الدفع
- ✅ تتبع قدرات الحساب (charges_enabled, payouts_enabled)
- ✅ تحديث حالة الدفع في قاعدة البيانات
```

---

## 🔐 الأمان | Security

✅ **تشفير SSL/TLS** - All connections encrypted
✅ **التحقق من التوقيع** - Webhook signature verification
✅ **معرفات فريدة** | Unique session IDs
✅ **متغيرات البيئة** | Sensitive data in environment variables
✅ **معالجة الأخطاء** | Proper error handling

---

## 🚀 الاستخدام في الصفحات | Usage Examples

### مثال 1: صفحة تفاصيل الطابع | Stamp Detail Page

```tsx
// client/src/pages/StampDetail.tsx
import { DirectPayment } from '@/components/DirectPayment';

export default function StampDetail() {
  const stamp = useStamp(stampId);
  
  return (
    <div className="grid grid-cols-2 gap-8">
      <StampImage src={stamp.imageUrl} />
      <StampInfo stamp={stamp} />
      
      <DirectPayment
        stampId={stamp.id}
        stampTitle={stamp.title}
        amount={parseFloat(stamp.price)}
        onSuccess={() => {
          // Handle success
        }}
      />
    </div>
  );
}
```

### مثال 2: سلة التسوق | Shopping Cart

```tsx
// استخدام متعدد | Multiple stamps
export function ShoppingCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <DirectPayment
      stampId={items[0]?.id}
      stampTitle={`Purchase of ${items.length} stamps`}
      amount={total}
      description={`Cart total: ${items.map(i => i.title).join(', ')}`}
    />
  );
}
```

---

## 📈 المراقبة والتتبع | Monitoring

### في لوحة Stripe
1. اذهب إلى https://dashboard.stripe.com
2. عرض جميع المعاملات | View all transactions
3. تتبع الدفعات | Track payments
4. إدارة المردودات | Handle refunds

### في قاعدة البيانات
```sql
SELECT * FROM transactions 
WHERE status = 'completed' 
ORDER BY completedAt DESC;

SELECT * FROM users 
WHERE stripeConnectedAccountId IS NOT NULL;
```

---

## ⚠️ استكشاف الأخطاء | Troubleshooting

### المشكلة: الدفع غير مفعل | Payment not enabled

**الحل:**
1. تحقق من أن `STRIPE_SECRET_KEY` مضبوط بشكل صحيح
2. تأكد من أن المفتاح يبدأ بـ `sk_test_` أو `sk_live_`
3. أعد تشغيل الخادم

```bash
pnpm dev:server
```

### المشكلة: خطأ في الدفع | Payment processing error

**الحل:**
1. تحقق من سجلات الخادم | Check server logs
2. تحقق من حالة حسابك على Stripe
3. تأكد من أن الإنترنت متصل

### المشكلة: لم يكمل الدفع | Payment not completing

**الحل:**
1. حاول مع بيانات اختبار Stripe:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `567`
2. تحقق من سجلات Stripe webhook

---

## 📝 ملاحظات مهمة | Important Notes

⚠️ **المفتاح الحالي اختبار** | Current key is for testing
- يمكنك استخدام بيانات بطاقة اختبار فقط
- للانتقال للإنتاج، استخدم `sk_live_...`

🔄 **نقل للإنتاج** | Moving to Production:
```dotenv
# في .env.production
STRIPE_SECRET_KEY=sk_live_your_actual_key
NODE_ENV=production
```

💡 **Best Practices:**
- لا تشارك المفتاح السري أبداً
- استخدم متغيرات البيئة فقط
- تفعيل الـ 2FA على حساب Stripe
- راجع السجلات بانتظام

---

## 🆘 الدعم | Support

للمساعدة:
1. اطلع على [Stripe Documentation](https://stripe.com/docs)
2. راجع سجلات الخادم: `pnpm dev:server`
3. تحقق من console للأخطاء: F12 في المتصفح

---

## 📌 الملفات المتعلقة | Related Files

```
server/
├── routers/
│   ├── direct-payment.ts          ← API تطبيق الدفع
│   ├── stripe-account-session.ts  ← إدارة حساب Stripe
│   └── ...
├── stripe-webhook.ts              ← معالجات الأحداث
└── routers.ts                      ← التسجيل والتكامل

client/
├── src/
│   ├── components/
│   │   └── DirectPayment.tsx       ← مكون الدفع
│   ├── pages/
│   │   └── PaymentSuccess.tsx      ← صفحة النجاح
│   └── App.tsx                     ← المسارات

drizzle/
└── schema.ts                       ← تحديثات قاعدة البيانات

.env.local                          ← متغيرات البيئة
```

---

**تم التحديث:** 2026-01-09
**النسخة:** 1.0.0
**الحالة:** ✅ جاهز للاستخدام | Ready for Use
