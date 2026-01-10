# Metrics & Analytics (Free‑First)

## ما الذي نقيسه؟
- زيارات/تفاعل: DAU/WAU، التحويل للتسجيل، بدء عملية شراء
- قِصَص المحتوى: CTR من السوشال، وقت على الصفحة
- مسار الشراء: عرض → إضافة للسلة → دفع → سكّ NFT

## أدوات مجانية
- GA4: تتبع صفحات/أحداث أساسي
- PostHog Cloud (Free tier): تتبع أحداث مخصص + Funnels

## تفعيل عبر المتغيرات
- ANALYTICS_ENABLED=true
- GA4_MEASUREMENT_ID=G-XXXXXX
- POSTHOG_API_KEY=phc_...
- POSTHOG_HOST=https://us.posthog.com (أو self-host لاحقاً)

ملاحظة: دمج الكود في الواجهة يمكن تفعيله شرطياً عند توفر المتغيرات.
