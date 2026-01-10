# 🌐 دليل إعداد النطاقات | Domain Setup Guide
**StampCoin Platform - Multiple Domain Configuration**

---

## 📋 النطاقات المقترحة | Suggested Domains

### النطاقات الأساسية | Primary Domains
```
✅ stampcoin.com          - النطاق الرئيسي
✅ stampcoin.io           - للمطورين والتقنيين
✅ stampcoin.app          - تطبيق الويب
✅ stampcoin.xyz          - النطاق البديل
```

### نطاقات العملة | Currency Domains
```
✅ stampcoin.money        - للمعاملات المالية
✅ stampcoin.exchange     - للتداول
✅ stmp.to                - اختصار للعملة
```

### نطاقات السوق | Marketplace Domains
```
✅ stampmarket.com        - السوق الرئيسي
✅ stampnft.com           - NFT خاص بالطوابع
✅ rarestamps.com         - الطوابع النادرة
```

### نطاقات إقليمية | Regional Domains
```
✅ stampcoin.ae           - الإمارات
✅ stampcoin.sa           - السعودية
✅ stampcoin.eg           - مصر
✅ stampcoin.de           - ألمانيا
```

---

## 🛒 مزودي النطاقات | Domain Registrars

### 1. Namecheap (موصى به | Recommended)
**المميزات**:
- ✅ خصوصية WHOIS مجانية
- ✅ أسعار تنافسية
- ✅ إدارة DNS سهلة
- ✅ دعم فني 24/7

**الأسعار**:
- `.com` - $8.88/سنة
- `.io` - $39.98/سنة
- `.app` - $14.98/سنة
- `.xyz` - $1.00/سنة (أول سنة)

**الخطوات**:
```bash
1. اذهب إلى: https://www.namecheap.com
2. ابحث عن النطاق المطلوب
3. أضف للسلة واختر خصوصية WHOIS
4. أكمل عملية الدفع
5. اربط بـ Fly.io/Railway/Vercel
```

---

### 2. Cloudflare Registrar
**المميزات**:
- ✅ أسعار بسعر التكلفة (لا ربح)
- ✅ SSL/CDN مجاني
- ✅ حماية DDoS
- ✅ DNS سريع جداً

**الأسعار**:
- `.com` - $9.77/سنة
- `.io` - $38.00/سنة
- `.app` - $15.00/سنة

**الخطوات**:
```bash
1. قم بالتسجيل في Cloudflare
2. اذهب إلى Domain Registration
3. ابحث واشتري النطاق
4. DNS يتم إعداده تلقائياً
```

---

### 3. Google Domains (الآن Squarespace)
**المميزات**:
- ✅ واجهة بسيطة
- ✅ خصوصية مجانية
- ✅ تكامل مع Google Cloud

---

## ⚙️ إعداد النطاقات مع Fly.io

### 1. إضافة نطاق مخصص
```bash
# إضافة نطاق
flyctl certs add stampcoin.com

# إضافة subdomain
flyctl certs add www.stampcoin.com
flyctl certs add api.stampcoin.com
```

### 2. الحصول على DNS Records
```bash
flyctl certs show stampcoin.com
```

سيعطيك:
```
CNAME: stampcoin-platform.fly.dev
OR
A Record: 66.241.124.147
AAAA Record: 2a09:8280:1::2:9c8f
```

### 3. إضافة السجلات في Namecheap/Cloudflare

**في Namecheap**:
```
Type: A Record
Host: @
Value: 66.241.124.147
TTL: Automatic

Type: AAAA Record
Host: @
Value: 2a09:8280:1::2:9c8f
TTL: Automatic

Type: CNAME
Host: www
Value: stampcoin-platform.fly.dev
TTL: Automatic
```

**في Cloudflare**:
```
Type: A
Name: @
Content: 66.241.124.147
Proxy: Yes (Orange Cloud)

Type: AAAA
Name: @
Content: 2a09:8280:1::2:9c8f
Proxy: Yes

Type: CNAME
Name: www
Content: stampcoin-platform.fly.dev
Proxy: Yes
```

### 4. التحقق من الإعداد
```bash
# تحقق من DNS
dig stampcoin.com
dig www.stampcoin.com

# تحقق من SSL
curl -I https://stampcoin.com

# تحقق من حالة الشهادة
flyctl certs check stampcoin.com
```

---

## 🔗 إعداد نطاقات متعددة

### Script للإعداد التلقائي
```bash
#!/bin/bash
# setup-domains.sh

DOMAINS=(
    "stampcoin.com"
    "www.stampcoin.com"
    "stampcoin.io"
    "www.stampcoin.io"
    "api.stampcoin.com"
    "stampcoin.app"
)

for DOMAIN in "${DOMAINS[@]}"; do
    echo "Adding $DOMAIN to Fly.io..."
    flyctl certs add "$DOMAIN"
    echo "✓ Added $DOMAIN"
    echo ""
done

echo "🎉 All domains added!"
echo "Now configure DNS records in your registrar"
```

استخدام:
```bash
chmod +x setup-domains.sh
./setup-domains.sh
```

---

## 📧 إعداد البريد الإلكتروني

### 1. باستخدام Cloudflare Email Routing (مجاني)
```
1. اذهب إلى Cloudflare Dashboard
2. Email → Email Routing → Get Started
3. أضف عناوين البريد:
   - info@stampcoin.com → your-email@gmail.com
   - support@stampcoin.com → your-email@gmail.com
   - hello@stampcoin.com → your-email@gmail.com
```

### 2. إعداد MX Records
```
Type: MX
Name: @
Priority: 1
Content: route1.mx.cloudflare.net

Type: MX
Name: @
Priority: 2
Content: route2.mx.cloudflare.net

Type: MX
Name: @
Priority: 3
Content: route3.mx.cloudflare.net
```

### 3. إعداد SPF, DKIM, DMARC
```
Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all

Type: TXT
Name: _dmarc
Content: v=DMARC1; p=quarantine; rua=mailto:dmarc@stampcoin.com
```

---

## 🌍 Subdomains للخدمات المختلفة

### البنية المقترحة
```
https://stampcoin.com           - الموقع الرئيسي
https://www.stampcoin.com       - نفس الموقع
https://app.stampcoin.com       - تطبيق الويب
https://api.stampcoin.com       - API فقط
https://admin.stampcoin.com     - لوحة الإدارة
https://docs.stampcoin.com      - التوثيق
https://blog.stampcoin.com      - المدونة
https://status.stampcoin.com    - حالة الخدمة
https://cdn.stampcoin.com       - ملفات ثابتة
```

### إعداد Subdomains في fly.toml
```toml
# إضافة في fly.toml
[[services.ports]]
  force_https = true
  handlers = ["http"]
  port = 80

[[services.ports]]
  handlers = ["tls", "http"]
  port = 443

# Wildcard SSL
[[services.tls_options]]
  alpn = ["h2", "http/1.1"]
  versions = ["TLSv1.2", "TLSv1.3"]
```

---

## 🔒 SSL/TLS Configuration

### تفعيل HTTPS تلقائياً
```bash
# Fly.io يوفر SSL مجاني تلقائياً
flyctl certs add stampcoin.com

# التحقق من الشهادة
flyctl certs show stampcoin.com

# تجديد تلقائي كل 60 يوم
```

### Force HTTPS Redirect
في `server/_core/index.ts`:
```typescript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

## 📊 إدارة النطاقات

### تتبع النطاقات
```markdown
| النطاق | المزود | تاريخ الانتهاء | التجديد التلقائي | الحالة |
|--------|--------|----------------|------------------|--------|
| stampcoin.com | Namecheap | 2027-01-09 | ✅ | Active |
| stampcoin.io | Namecheap | 2027-01-09 | ✅ | Active |
| stampcoin.app | Cloudflare | 2027-01-09 | ✅ | Active |
```

### تنبيهات التجديد
```bash
# أضف في calendar
تجديد stampcoin.com - 2026-12-09 (قبل شهر)
تجديد stampcoin.io - 2026-12-09
تجديد stampcoin.app - 2026-12-09
```

---

## 🎯 استراتيجية النطاقات

### الأولوية 1 (احجز الآن)
```
✅ stampcoin.com      - الأساسي
✅ stampcoin.io       - تقني
✅ stampcoin.app      - تطبيق
```

### الأولوية 2 (خلال شهر)
```
⏳ stampcoin.xyz     - بديل
⏳ stampcoin.money   - مالي
⏳ stmp.to           - اختصار
```

### الأولوية 3 (حسب التوسع)
```
⏳ stampcoin.ae      - إقليمي
⏳ stampnft.com      - سوق NFT
⏳ rarestamps.com    - متخصص
```

---

## 💰 الميزانية المقدرة

### السنة الأولى
```
النطاقات الأساسية (3):
- stampcoin.com: $8.88
- stampcoin.io: $39.98
- stampcoin.app: $14.98
المجموع: $63.84

النطاقات الإضافية (3):
- stampcoin.xyz: $1.00
- stampcoin.money: $24.88
- stmp.to: $29.98
المجموع: $55.86

الإجمالي السنوي: $119.70
```

### التكاليف السنوية
```
الحد الأدنى: $64 (3 نطاقات فقط)
الموصى به: $120 (6 نطاقات)
الكامل: $200+ (10+ نطاقات)
```

---

## 🛠️ أدوات مفيدة

### التحقق من توفر النطاقات
```bash
# استخدم موقع
https://www.namecheap.com/domains/domain-name-search/
https://domains.google.com
https://www.cloudflare.com/products/registrar/
```

### فحص DNS
```bash
# التحقق من DNS
nslookup stampcoin.com
dig stampcoin.com +short

# التحقق من SSL
openssl s_client -connect stampcoin.com:443 -servername stampcoin.com

# اختبار السرعة
curl -w "@curl-format.txt" -o /dev/null -s https://stampcoin.com
```

### مراقبة الأداء
```bash
# Ping test
ping stampcoin.com

# Trace route
traceroute stampcoin.com

# DNS propagation
https://www.whatsmydns.net/#A/stampcoin.com
```

---

## 📱 تكامل مع المنصات الأخرى

### Railway
```bash
railway domains add stampcoin.com
railway domains add www.stampcoin.com
```

### Vercel
```bash
vercel domains add stampcoin.com
vercel domains add www.stampcoin.com
```

### Render
```yaml
# في render.yaml
services:
  - type: web
    name: stampcoin-platform
    env: node
    customDomains:
      - stampcoin.com
      - www.stampcoin.com
```

---

## ✅ Checklist

### قبل الشراء
- [ ] تحقق من توفر النطاقات
- [ ] قارن الأسعار بين المزودين
- [ ] تأكد من خصوصية WHOIS مجانية
- [ ] اقرأ شروط التجديد

### بعد الشراء
- [ ] فعّل خصوصية WHOIS
- [ ] فعّل التجديد التلقائي
- [ ] أضف النطاق إلى Fly.io
- [ ] أعد إعداد DNS Records
- [ ] تحقق من SSL
- [ ] اختبر جميع الروابط

### الصيانة الدورية
- [ ] تحقق من تواريخ الانتهاء شهرياً
- [ ] راقب DNS propagation
- [ ] حدّث SSL certificates
- [ ] احتفظ بنسخة احتياطية من الإعدادات

---

## 🆘 المشاكل الشائعة وحلولها

### 1. DNS لا ينتشر
```bash
# انتظر 24-48 ساعة
# تحقق من:
https://www.whatsmydns.net

# امسح cache:
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # Mac
```

### 2. SSL غير فعال
```bash
# أعد إضافة الشهادة
flyctl certs remove stampcoin.com
flyctl certs add stampcoin.com

# انتظر 1-2 ساعة للتفعيل
```

### 3. Subdomain لا يعمل
```bash
# تأكد من CNAME صحيح
# أضف wildcard:
Type: CNAME
Name: *
Value: stampcoin-platform.fly.dev
```

---

## 📞 الدعم والمساعدة

### Namecheap Support
- Live Chat: 24/7
- Email: support@namecheap.com
- Phone: +1-480-624-2500

### Cloudflare Support
- Dashboard: Help Center
- Community: https://community.cloudflare.com
- Email: support@cloudflare.com

### Fly.io Support
- Community: https://community.fly.io
- Email: support@fly.io
- Docs: https://fly.io/docs

---

## 🎯 التنفيذ السريع

### الآن (10 دقائق)
```bash
1. اذهب إلى Namecheap.com
2. ابحث عن "stampcoin"
3. أضف .com, .io, .app للسلة
4. أكمل الدفع (بطاقة ائتمان)
5. انسخ nameservers أو أعد إعداد DNS
```

### بعد 1 ساعة
```bash
1. flyctl certs add stampcoin.com
2. أضف DNS records في Namecheap
3. انتظر propagation (1-24 ساعة)
4. تحقق من https://stampcoin.com
```

### النتيجة
```
✅ stampcoin.com → موقعك الحي
✅ www.stampcoin.com → نفس الموقع
✅ SSL مفعل تلقائياً
✅ جاهز للاستخدام!
```

---

*آخر تحديث: January 9, 2026*
