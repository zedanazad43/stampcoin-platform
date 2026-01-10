# 🚀 البدء السريع - Quick Start Guide

## حسابك على Stripe جاهز الآن! | Your Stripe Account is Ready!

يمكن للعملاء الآن الدفع مباشرة إلى حسابك على Stripe.
Customers can now pay directly to your Stripe account.

---

## خطوات سريعة | Quick Steps

### 1️⃣ تشغيل المنصة | Start the Platform
```bash
# تشغيل المنصة كاملة | Full platform
pnpm dev

# أو الخادم فقط | Or just the backend
pnpm dev:server

# أو الواجهة فقط | Or just the frontend
pnpm dev:client
```

### 2️⃣ اختبار الدفع | Test a Payment

اذهب إلى صفحة أي طابع وانقر على "Pay with Card"
Go to any stamp page and click "Pay with Card"

أو استخدم المكون مباشرة:
Or use the component directly:

```tsx
import { DirectPayment } from '@/components/DirectPayment';

<DirectPayment
  stampId={1}
  stampTitle="Test Stamp"
  amount={9.99}
/>
```

### 3️⃣ استخدام بيانات اختبار Stripe | Use Test Card Data

```
البطاقة | Card: 4242 4242 4242 4242
الصلاحية | Expiry: 12/34
CVC: 567
```

### 4️⃣ تتبع الدفعات | Track Payments

اذهب إلى:
Go to: https://dashboard.stripe.com/test/payments

شاهد جميع المعاملات | See all transactions

---

## الملفات المهمة | Important Files

| الملف | الوصف | Description |
|------|-------|------------|
| `server/routers/direct-payment.ts` | API الدفع | Payment API |
| `client/src/components/DirectPayment.tsx` | مكون الدفع | Payment Component |
| `client/src/pages/PaymentSuccess.tsx` | صفحة النجاح | Success Page |
| `.env.local` | مفتاح Stripe | Stripe Secret Key |
| `DIRECT_PAYMENT_SETUP.md` | توثيق كامل | Full Documentation |

---

## مفتاح Stripe الخاص بك | Your Stripe Secret Key

✅ **بيئة التطوير** | Development:
```
sk_test_YOUR_SECRET_KEY_HERE
```

🔄 **للانتقال للإنتاج** | For Production:
```
اطلب مفتاح sk_live_ من حسابك على Stripe
Request sk_live_ key from your Stripe account
```

---

## نصائح مهمة | Important Tips

✅ **لا تشارك المفتاح** | Don't share the key
✅ **استخدم .env.local فقط** | Use .env.local only
✅ **أعد تشغيل الخادم** | Restart server after changes
✅ **راجع الأخطاء** | Check console for errors

---

## الأوامر المفيدة | Useful Commands

```bash
# التحقق من TypeScript | Check types
pnpm check

# تنسيق الكود | Format code
pnpm format

# تشغيل الاختبارات | Run tests
pnpm test

# بناء المشروع | Build project
pnpm build

# تشغيل في الإنتاج | Run in production
pnpm start
```

---

## المتطلبات الإضافية | Next Steps

1. ✅ **تم**: إضافة مفتاح Stripe | Stripe key added
2. ✅ **تم**: إنشاء API للدفع | Payment API created
3. ✅ **تم**: إنشاء مكون الدفع | Payment component created
4. ⏭️ **تالي**: ربط الدفع بصفحات المنتجات | Connect to product pages
5. ⏭️ **تالي**: إضافة البريد الإلكتروني للتأكيد | Add confirmation emails
6. ⏭️ **تالي**: إعداد webhooks على الإنتاج | Setup webhooks in production

---

## 🆘 هل تحتاج مساعدة؟ | Need Help?

### المشاكل الشائعة | Common Issues

❌ **"الدفع غير متاح"** | "Payment not available"
→ تأكد أن STRIPE_SECRET_KEY موجود في .env.local

❌ **"فشل إنشاء الجلسة"** | "Failed to create session"
→ أعد تشغيل الخادم: `pnpm dev:server`

❌ **"خطأ في الاتصال"** | "Connection error"
→ تأكد من الإنترنت واتصال قاعدة البيانات

---

**آخر تحديث:** 2026-01-09
**الحالة:** ✅ جاهز للاستخدام
