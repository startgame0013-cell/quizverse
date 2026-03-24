# دليل ربط Paddle – خطوة بخطوة

Paddle يدعم الكويت والدينار الكويتي ✓

---

## ١. إنهاء إنشاء حساب Paddle

1. أكمل نموذج **Business details** (اسم العمل، النوع، الإيرادات، الموقع)
2. أدخل **الحساب البنكي** (IBAN) لاستلام المبالغ
3. أكمل التحقق إن طُلب منك

---

## ٢. الحصول على API Key

1. من Paddle Dashboard: **Developer tools** → **Authentication**
2. **Create API key** ← اختر الصلاحيات (Transactions: Create, Read)
3. انسخ الـ API key (يبدأ بـ `pdl_`)

**Sandbox (اختبار):** استخدم مفتاح من Sandbox أولاً  
**Live (حقيقي):** استخدم مفتاح من Live للإنتاج

---

## ٣. إنشاء المنتجات والخطط

1. من القائمة: **Catalog** → **Products** → **Add product**
2. أضف كل خطة:

| الاسم   | السعر (KWD أو USD) | التكرار  |
|--------|---------------------|----------|
| Basic  | 0.9 أو 2.99         | Monthly  |
| Pro    | 2.1 أو 6.99         | Monthly  |
| School | 3.6 أو 11.99        | Monthly  |

3. بعد الحفظ، انقر على السعر وانسخ **Price ID** (يبدأ بـ `pri_`)

---

## ٤. إعداد Default Payment Link

1. **Checkout** → **Checkout settings** → **Default payment link**
2. أدخل نطاق موقعك: `https://quizverse-lyart.vercel.app` (أو دومينك)
3. احفظ التغييرات

---

## ٥. إضافة المتغيرات في Render

1. ادخل [dashboard.render.com](https://dashboard.render.com)
2. اختر خدمة الـ API
3. **Environment** ← أضف:
   - `PADDLE_API_KEY` = `pdl_xxx` (المفتاح من الخطوة ٢)
   - `PADDLE_PRICE_BASIC` = `pri_xxx`
   - `PADDLE_PRICE_PRO` = `pri_xxx`
   - `PADDLE_PRICE_SCHOOL` = `pri_xxx`
   - `FRONTEND_URL` = `https://quizverse-lyart.vercel.app`
   - `PADDLE_WEBHOOK_SECRET` = (بعد إعداد الـ webhook في القسم ٦)

**للتجربة (Sandbox):** أضف `PADDLE_SANDBOX` = `true`

---

## ٦. Webhook (تحديث الخطة تلقائياً)

بعد الدفع، الخادم يحدّث `plan` و`planExpiresAt` للمستخدم عبر **إشعارات Paddle**.

1. في Paddle: **Developer tools** → **Notifications** → أنشئ **destination** من نوع URL.
2. عنوان الـ webhook (استبدل بنطاق الـ API الفعلي، مثل Render):

   `https://YOUR-API.onrender.com/api/subscription/webhook`

3. فعّل الأحداث على الأقل:
   - `transaction.completed`
   - `subscription.updated`
   - `subscription.canceled`

4. انسخ **Secret key** للوجهة وأضفه في بيئة الخادم:

   - `PADDLE_WEBHOOK_SECRET` = القيمة التي يعطيك إياها Paddle (مثل `pdl_ntfset_...`)

بدون هذا المتغير، المسار يعيد `503` ولن يُحدَّث اشتراك المستخدمين من الويب هوك.

---

## ٦.١ اشتراكات مدرسية (Monetization) — جاهز في التطبيق

- صفحة **الأسعار** (`/pricing`) تعرض الخطط: Basic و Pro و **School** مع دفع Paddle.
- **المعلمون والمسؤولون فقط** يمكنهم بدء دفع خطة **School**؛ الحسابات كطالب ترى تلميحاً للتسجيل كمعلم أو التواصل مع المدرسة.
- **تسجيل كمعلم:** الرابط ` /register?role=teacher ` ثم يعيّن الـ backend الدور `teacher`.
- **API:**
  - `GET /api/subscription/plans` — يعيد `paddle: true/false` و`plans.basic|pro|school` حسب وجود `PADDLE_PRICE_*` صحيحة (`pri_`).
  - `POST /api/subscription/create-checkout` — جسم: `{ "plan": "basic" | "pro" | "school" }` مع `Authorization: Bearer`.
- بعد الدفع الناجح، يحدّث **الويب هوك** حقل `plan` في المستخدم (`free` | `basic` | `pro` | `school`) و`planExpiresAt` عندما تتوفر بيانات التجديد من Paddle.

---

## ٧. كيف تستلم المبالغ؟

1. المدفوعات تظهر في **Paddle Dashboard** → **Revenue**
2. Paddle يحوّل الفلوس لحسابك البنكي حسب جدول الدفع الذي تضبطه
3. من **Settings** → **Payouts** تكدر تغيّر التوقيت
