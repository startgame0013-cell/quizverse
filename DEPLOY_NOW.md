# Deploy QuizVerse Backend — خطوة بخطوة

## الطريقة 1: Render (مجاني)

### 1. اربط المستودع
1. ادخل [render.com](https://render.com) وسجّل دخول
2. **New** → **Web Service**
3. اختر مستودع `quizverse` من GitHub
4. Render يقرأ `render.yaml` تلقائياً

### 2. أضف المتغيرات
في **Environment**:
| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `FRONTEND_URL` | `https://quizverse-lyart.vercel.app` |

### 3. انشر
- **Create Web Service**
- انتظر 2–3 دقائق
- انسخ الرابط (مثل `https://quizverse-6nxn.onrender.com`)

---

## الطريقة 2: Railway

### 1. New Project
1. ادخل [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. اختر `quizverse`

### 2. إعداد المجلد
- **Settings** → **Root Directory** = `backend`

### 3. المتغيرات
- **Variables** → أضف:
  - `MONGODB_URI` = رابط Atlas
  - `FRONTEND_URL` = `https://quizverse-lyart.vercel.app`

### 4. النطاق
- **Settings** → **Generate Domain**
- انسخ الرابط

---

## بعد نشر Backend

### في Vercel (Frontend)
**Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | رابط Render (مثل `https://quizverse-6nxn.onrender.com`) |
| `VITE_SOCKET_URL` | نفس رابط Backend |

ثم **Redeploy** المشروع.

---

## التحقق
1. افتح `https://quizverse-lyart.vercel.app`
2. My Quizzes → Host Live Game
3. من جوالك: `/join` + PIN
4. اللعبة تعمل من أي مكان
