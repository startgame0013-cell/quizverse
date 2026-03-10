# إعداد MongoDB Atlas لـ QuizVerse

## الخطوة 1: إنشاء أو تعديل Database User

**لو عندك مستخدم قديم (مثل startgame001_db_user) وفيه خطأ "bad auth":**
- ادخل **Database Access** → اضغط **Edit** على المستخدم → **Edit Password** → كلمة مرور جديدة بسيطة (بدون رموز) → احفظ

**لو تبي تنشئ مستخدم جديد:**
1. ادخل [cloud.mongodb.com](https://cloud.mongodb.com)
2. من القائمة اليسرى: **Security** → **Database Access**
3. اضغط **Add New Database User**
4. اختر **Password** (مو Certificate)
5. **Username:** مثلاً `quizverse_user`
6. **Password:** اضغط **Autogenerate Secure Password** أو اكتب كلمة مرور بسيطة **بدون رموز خاصة** (مثل `@` `#` `:`)
   - إذا اخترت كلمة مرور يدوياً: احفظها، ستستخدمها في الخطوة التالية
7. **Database User Privileges:** اختر **Atlas admin** أو **Read and write to any database**
8. اضغط **Add User**

---

## الخطوة 2: السماح بالاتصال من أي IP (Network Access)

1. من القائمة اليسرى: **Security** → **Network Access**
2. اضغط **Add IP Address**
3. اختر **Allow Access from Anywhere** (يضيف `0.0.0.0/0`)
4. اضغط **Confirm**

---

## الخطوة 3: نسخ رابط الاتصال

1. من القائمة اليسرى: **Database** → **Browse Collections** أو **Connect**
2. اضغط **Connect** على Cluster الخاص بك
3. اختر **Drivers** (لـ Node.js)
4. انسخ الرابط الظاهر، شكله:
   ```
   mongodb+srv://quizverse_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **مهم:** استبدل `<password>` بكلمة المرور الفعلية للمستخدم
6. **أضف اسم قاعدة البيانات** قبل `?`:
   ```
   mongodb+srv://quizverse_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/quizverse?retryWrites=true&w=majority
   ```
   لاحظ `/quizverse` قبل علامة الاستفهام.

---

## الخطوة 4: إضافة الرابط في Render

1. ادخل [dashboard.render.com](https://dashboard.render.com)
2. اختر مشروع **quizverse**
3. **Environment** → **Edit**
4. عدّل أو أضف:
   - **KEY:** `MONGODB_URI`
   - **VALUE:** الرابط الكامل (مع كلمة المرور واسم قاعدة البيانات)
5. **Save Changes**
6. **Manual Deploy** → **Deploy latest commit**

---

## ملاحظات

- **اسم المتغير بالضبط:** `MONGODB_URI` (مو `NONGODB_URI` أو `MONGO_URI`)
- **كلمة المرور:** إذا فيها رموز خاصة، لازم تترمّز (URL encode)
  - مثلاً `pass@123` → `pass%40123`
- **خطأ "bad auth":** عادة يعني كلمة مرور غلط أو اسم مستخدم غلط — راجع Database Access
