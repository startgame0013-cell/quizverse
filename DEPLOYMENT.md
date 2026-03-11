# نشر QuizNova Live Game على الإنترنت

هذا الدليل يشرح كيفية نشر اللعبة الحية بحيث يعمل الطلاب والمعلمون من أي مكان.

---

## لماذا لا أرى التحديثات (مثل زر الرجوع) على الموقع؟

الرابط العام (quizverse-lyart.vercel.app) يعرض **آخر نسخة تم نشرها** فقط. إذا عدّلت الكود محلياً ولم ترفعه، الموقع يبقى على النسخة القديمة.

**عشان تظهر التحديثات:**
1. احفظ التعديلات واعمل **push** للمستودع (Git) المربوط مع Vercel.
2. انتظر حتى ينتهي الـ **Deploy** في لوحة Vercel (عادة 1–2 دقيقة).
3. حدّث الصفحة في المتصفح (أو افتح الرابط في نافذة خاصة).

تأكد أن إعدادات المشروع في Vercel: **Root Directory** = `.` (جذر المشروع) وليس `frontend`.

---

## المعمارية

```
الطلاب/المعلمون (المتصفح)
        │
        ▼
QuizNova Frontend (Vercel) — quizverse-lyart.vercel.app
        │
        ▼
Backend API + Socket.IO (Render أو Railway)
        │
        ▼
MongoDB Atlas
```

---

## الخطوة 1: نشر Backend على Render

### 1. إنشاء حساب على [Render](https://render.com)

### 2. ربط المستودع (GitHub)
- New → Web Service
- اختر مستودع `quizverse`
- Render يكتشف `render.yaml` تلقائياً

### 3. إعداد المتغيرات
في **Environment** أضف:
| المفتاح | القيمة |
|---------|--------|
| `MONGODB_URI` | رابط MongoDB Atlas (مثل `mongodb+srv://user:pass@cluster.mongodb.net/quizverse`) |
| `JWT_SECRET` | مفتاح سري عشوائي (مثل `my-super-secret-jwt-key-2024`) |

### 4. النشر
- اضغط **Create Web Service**
- انتظر حتى يكتمل البناء
- ستحصل على رابط مثل: `https://quizverse-6nxn.onrender.com`

---

## الخطوة 2: نشر Backend على Railway (بديل)

### 1. إنشاء حساب على [Railway](https://railway.app)

### 2. New Project → Deploy from GitHub
- اختر المستودع
- حدد **Root Directory**: `backend`

### 3. إضافة المتغيرات
- Settings → Variables
- أضف `MONGODB_URI` برابط Atlas

### 4. الحصول على الرابط
- Settings → Generate Domain
- الرابط مثل: `https://quiznova-api.up.railway.app`

---

## الخطوة 3: تحديث Frontend (Vercel)

### إضافة متغيرات البيئة في Vercel

اذهب إلى: **Project → Settings → Environment Variables**

| المفتاح | القيمة | البيئة |
|---------|--------|--------|
| `VITE_API_URL` | `https://quizverse-6nxn.onrender.com` | Production, Preview |
| `VITE_SOCKET_URL` | `https://quizverse-6nxn.onrender.com` | Production, Preview |

> **ملاحظة:** إذا كان API و Socket على نفس الخادم (وهذا هو الحال)، استخدم نفس الرابط لكليهما.

### إعادة النشر
بعد إضافة المتغيرات، أعد نشر المشروع من Vercel (Redeploy).

---

## الخطوة 4: التحقق من CORS

Backend يستخدم `cors({ origin: true })` مما يسمح بأي مصدر. إذا أردت تقييداً:

في `backend/server.js`:
```js
app.use(cors({
  origin: [
    'https://quizverse-lyart.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

---

## الاختبار

1. افتح `https://quizverse-lyart.vercel.app`
2. اذهب إلى My Quizzes → اختر كويز → **Host Live Game**
3. انسخ الـ PIN
4. من جوالك أو جهاز آخر: ادخل `/join` وأدخل الـ PIN والاسم
5. تحقق أن اللعبة تعمل بشكل مباشر

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| Socket لا يتصل | تأكد أن `VITE_SOCKET_URL` مضبوط في Vercel وأعد البناء |
| CORS error | أضف نطاق Vercel في إعدادات CORS بالـ backend |
| MongoDB connection failed | تحقق من `MONGODB_URI` وصحّة الشبكة في Atlas |
| Render ينام بعد 15 دقيقة | الخطة المجانية تُوقف الخدمة بعد عدم استخدام؛ أول طلب قد يأخذ 30–60 ثانية |

---

## ملاحظة عن Render المجاني

على الخطة المجانية، الخدمة "تنام" بعد 15 دقيقة من عدم النشاط. أول طلب بعد ذلك قد يستغرق 30–60 ثانية. لاستخدام مستمر، يمكن الترقية لخطة مدفوعة.
