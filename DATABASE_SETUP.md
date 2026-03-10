# ربط قاعدة البيانات MongoDB

## رابطك من MongoDB Atlas:
```
mongodb+srv://startgame0013_db_user:<db_password>@cluster0.kwdmpdu.mongodb.net/?appName=Cluster0
```

## خطوة 1: ضع كلمة المرور

استبدل `<db_password>` بكلمة مرور مستخدم قاعدة البيانات.

**مثال:** لو كلمة المرور `MyPass123`، الرابط يصير:
```
mongodb+srv://startgame0013_db_user:MyPass123@cluster0.kwdmpdu.mongodb.net/?appName=Cluster0
```

---

## خطوة 2: أضف الرابط في Vercel

1. افتح https://vercel.com
2. اختر مشروع **quizverse** (أو QuizNova)
3. **Settings** → **Environment Variables**
4. **Add New**
5. **Key:** `MONGODB_URI`
6. **Value:** الصق الرابط المعدّل (الذي فيه كلمة المرور)
7. اختر **Production** و **Save**
8. **Deployments** → ⋮ على آخر نشر → **Redeploy**

بعد Redeploy، الإحصائيات على الموقع ستظهر من قاعدة البيانات.

---

## (اختياري) للتشغيل المحلي

أنشئ ملف `backend/.env` وأضف:
```
MONGODB_URI=mongodb+srv://startgame0013_db_user:كلمة_المرور@cluster0.kwdmpdu.mongodb.net/?appName=Cluster0
```
