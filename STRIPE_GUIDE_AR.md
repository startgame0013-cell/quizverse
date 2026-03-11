# دليل ربط Stripe – خطوة بخطوة

## ١. بعد تسجيل الدخول لـ Stripe (Continue)

### أ. إكمال إنشاء الحساب
1. أدخل **معلومات نشاطك التجاري** (الاسم، البلد، نوع العمل)
2. أدخل **الحساب البنكي** (رقم الآيبان أو IBAN) — هنا سيستلم المبالغ
3. أكمل التحقق إن طُلب منك

### ب. الحصول على المفاتيح (API Keys)
1. من القائمة الجانبية: **Developers** ← **API keys**
2. ستجد:
   - **Publishable key** يبدأ بـ `pk_test_` أو `pk_live_`
   - **Secret key** يبدأ بـ `sk_test_` أو `sk_live_`
3. استخدم **Test mode** أولاً (زر في الأعلى) — للاختبار بدون دفع حقيقي

### ج. إنشاء المنتجات والخطط
1. من القائمة: **Product catalog** ← **Products** ← **Add product**
2. أضف كل خطة:

| الاسم      | السعر  | التكرار  |
|-----------|--------|----------|
| Basic     | 2.99   | Monthly  |
| Pro       | 6.99   | Monthly  |
| School    | 11.99  | Monthly  |

3. بعد الحفظ، انقر على السعر وانسخ **Price ID** (يبدأ بـ `price_`)

---

## ٢. إضافة المفاتيح في المشروع

### في Render (Backend)
1. ادخل [dashboard.render.com](https://dashboard.render.com)
2. اختر خدمة الـ API (quizverse-api أو ما شابه)
3. **Environment** ← أضف:
   - `STRIPE_SECRET_KEY` = `sk_test_xxx` (أو `sk_live_xxx`)
   - `FRONTEND_URL` = `https://quizverse-lyart.vercel.app`

### في Vercel (Frontend) — اختياري للدفع
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_xxx` (إذا استخدمت Stripe.js في الواجهة)

---

## ٣. إضافة Price IDs في Backend
في ملف `backend/routes/subscription.js` ضع الـ Price IDs اللي نسختها من Stripe بدل `price_xxx`.

---

## ٤. إضافة Price IDs في Render
بعد نسخ كل Price ID من Stripe، أضفه في Render Environment:
- `STRIPE_PRICE_BASIC` = price_xxx
- `STRIPE_PRICE_PRO` = price_xxx  
- `STRIPE_PRICE_SCHOOL` = price_xxx

---

## ٥. كيف تستلم المبالغ؟
1. المدفوعات تظهر في **Stripe Dashboard** ← **Payments**
2. Stripe يحوّل الفلوس لحسابك البنكي (عادة كل ٧ أيام أو حسب إعداداتك)
3. في **Settings** ← **Payouts** تكدر تغيّر توقيت التحويل
