# تشغيل QuizVerse — طريقتان

## الطريقة 1: سكربت تفاعلي (الأسهل)

شغّل أمر واحد، الصق القيم عندما يُطلب منك:

```bash
npm run setup
```

سيطلب منك:
1. **MONGODB_URI** — من Atlas → Security → Database Access → Edit user → Edit Password → Connect → Drivers
2. **RENDER_API_KEY** — من [dashboard.render.com](https://dashboard.render.com) → Account Settings → API Keys → Create

بعدها يحفظ القيم ويشغّل النشر تلقائياً.

---

## الطريقة 1ب: بدون تفاعل (بعد ملء .env.setup)

```bash
cp .env.setup.example .env.setup
# عدّل .env.setup وضَع القيم
npm run setup:deploy
```

---

## الطريقة 2: GitHub Actions (بدون تشغيل من جهازك)

1. ارفع المشروع لـ GitHub
2. Settings → Secrets and variables → Actions → New repository secret
3. أضف:
   - `MONGODB_URI` = رابط الاتصال كامل
   - `RENDER_API_KEY` = مفتاح Render
   - `RENDER_SERVICE_ID` = `srv-d6n3nn3h46gs73c1qa4g`
4. Actions → setup-and-deploy → Run workflow

---

## الحصول على MONGODB_URI

1. [cloud.mongodb.com](https://cloud.mongodb.com) → **Security** → **Database Access**
2. Edit على المستخدم → **Edit Password** → **Autogenerate Secure Password** → Copy
3. **Database** → **Connect** → **Drivers** → انسخ الرابط
4. استبدل `<password>` بكلمة المرور
5. أضف `/quizverse` قبل `?`:
   ```
   mongodb+srv://user:PASS@cluster.xxx.mongodb.net/quizverse?retryWrites=true&w=majority
   ```
