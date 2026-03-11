# إضافة دومين خاص (مثل quizverse.com)

## 1. شراء الدومين

من أي مزود (Namecheap, GoDaddy, Google Domains):

- اشترِ دومين مثل `quizverse.com

## 2. ربطه في Vercel

1. ادخل [vercel.com](https://vercel.com) → مشروعك QuizVerse
2. **Settings** → **Domains**
3. اضغط **Add** → اكتب دومينك (مثل `quizverse.com`)
4. اضغط **Add**
5. Vercel يعطيك سجلات DNS (مثل `CNAME` أو `A`)
6. اذهب لمزود الدومين → **DNS Settings** → أضف السجلات كما يطلب Vercel

## 3. SSL

Vercel يفعّل HTTPS تلقائياً بعد ربط الدومين.
