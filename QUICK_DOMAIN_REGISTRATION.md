# ⚡ دليل سريع: حجز النطاقات في 10 دقائق
**StampCoin Platform - Quick Domain Registration**

---

## 🎯 الخطوة 1: اختر النطاقات (دقيقة واحدة)

### الحد الأدنى (موصى به):
```
✅ stampcoin.com ($8.88/سنة)
✅ stampcoin.io ($39.98/سنة)
✅ stampcoin.app ($14.98/سنة)

الإجمالي: $63.84
```

---

## 💳 الخطوة 2: سجل في Namecheap (دقيقتان)

1. اذهب إلى: https://www.namecheap.com
2. انقر "Sign Up" في الأعلى
3. املأ:
   - البريد الإلكتروني
   - كلمة المرور
   - الاسم
4. فعّل الحساب من البريد

---

## 🔍 الخطوة 3: ابحث واشتري (3 دقائق)

### في Namecheap:
```
1. في شريط البحث: اكتب "stampcoin.com"
2. انقر "Add to Cart" 🛒
3. اختر المدة: 1 year
4. ✅ فعّل "WhoisGuard" (مجاني)
5. كرر للنطاقات الأخرى:
   - stampcoin.io
   - stampcoin.app
6. انقر "View Cart"
7. مراجعة وإتمام الشراء
```

### معلومات الدفع:
- بطاقة ائتمان/Visa/Mastercard
- أو PayPal
- أو Bitcoin

**💡 نصيحة**: استخدم كود خصم (ابحث في Google عن "Namecheap coupon")

---

## ⚙️ الخطوة 4: إعداد DNS (3 دقائق)

### في Namecheap Dashboard:

1. اذهب إلى **Domain List**
2. انقر على **Manage** بجانب stampcoin.com
3. اذهب إلى تبويب **Advanced DNS**
4. احذف السجلات الافتراضية
5. أضف السجلات التالية:

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

Type: CNAME
Host: api
Value: stampcoin-platform.fly.dev
TTL: Automatic
```

6. انقر **Save All Changes** ✅

---

## 🚀 الخطوة 5: أضف إلى Fly.io (دقيقة واحدة)

```bash
# في Terminal
flyctl certs add stampcoin.com
flyctl certs add www.stampcoin.com
flyctl certs add api.stampcoin.com

# أو استخدم السكريبت:
./setup-domains.sh
```

---

## ✅ الخطوة 6: التحقق (انتظر 1-24 ساعة)

### فحص DNS Propagation:
```bash
# في Terminal
dig stampcoin.com
dig www.stampcoin.com

# أو اذهب إلى:
https://www.whatsmydns.net/#A/stampcoin.com
```

### اختبار الموقع:
```bash
curl -I https://stampcoin.com
curl -I https://www.stampcoin.com
```

يجب أن تحصل على:
```
HTTP/2 200 OK
```

---

## 🎉 تم! أنت الآن تملك:

✅ **stampcoin.com** - موقعك الرئيسي  
✅ **www.stampcoin.com** - النسخة مع www  
✅ **api.stampcoin.com** - API endpoint  
✅ **SSL مفعل تلقائياً** 🔒  
✅ **خصوصية WHOIS محمية** 🛡️  

---

## 🔄 كرر للنطاقات الأخرى

نفس الخطوات لـ:
- stampcoin.io
- stampcoin.app
- أي نطاقات إضافية

---

## ❓ مشاكل شائعة

### "النطاق محجوز"
- جرب variations: stampcoinplatform.com, mystampcoin.com
- جرب نطاقات أخرى: .io, .app, .xyz

### "DNS لا يعمل"
- انتظر 24-48 ساعة
- تحقق من أنك أضفت السجلات الصحيحة
- امسح cache المتصفح: Ctrl+Shift+Delete

### "SSL Error"
- انتظر 1-2 ساعة بعد إعداد DNS
- تحقق: `flyctl certs check stampcoin.com`
- أعد المحاولة: `flyctl certs remove` ثم `add`

---

## 📞 تحتاج مساعدة?

### دعم Namecheap
- Live Chat: 24/7 في الموقع
- Email: support@namecheap.com

### دعم Fly.io
- Community: https://community.fly.io
- Docs: https://fly.io/docs

### الأدلة التفصيلية
- [DOMAIN_SETUP_GUIDE.md](DOMAIN_SETUP_GUIDE.md) - دليل كامل
- [DOMAINS_TRACKING.md](DOMAINS_TRACKING.md) - متابعة النطاقات

---

## 💡 نصائح مهمة

1. **فعّل التجديد التلقائي** - لا تخسر نطاقك!
2. **احفظ بيانات الدخول** - في مكان آمن
3. **فعّل 2FA** - حماية إضافية
4. **تحقق شهرياً** - من تاريخ الانتهاء

---

## 🎯 الخطوة التالية

بعد إعداد النطاقات:

1. ✅ إعداد البريد الإلكتروني (Cloudflare Email Routing مجاناً)
2. ✅ إضافة Google Analytics
3. ✅ إعداد CDN
4. ✅ تحسين SEO

راجع: [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)

---

**⏱️ الوقت الإجمالي**: 10 دقائق + انتظار DNS (1-24 ساعة)  
**💰 التكلفة**: $63.84 للسنة الأولى  
**✅ النتيجة**: نطاقاتك الخاصة جاهزة! 🎉

---

*آخر تحديث: January 9, 2026*
