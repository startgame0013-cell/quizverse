# Vercel Setup - عرض الإحصائيات للزوار

تم إضافة **Vercel Serverless Functions** للإحصائيات والزيارات. الموقع سيعرض نفس الأرقام للزوار مثل ما تشوف محلياً.

## مطلوب منك خطوة وحدة

**أضف رابط MongoDB في Vercel:**

1. افتح [vercel.com](https://vercel.com) → مشروعك QuizVerse
2. Settings → Environment Variables
3. أضف متغير:
   - **Name:** `MONGODB_URI`
   - **Value:** رابط MongoDB (نفس اللي تستخدمه في backend)
   - إذا عندك MongoDB Atlas: استخدم رابط الاتصال (مثل `mongodb+srv://...`)

4. Redeploy المشروع (Deployments → ⋮ → Redeploy)

بعد هذي الخطوة، الزوار راح يشوفون نفس الإحصائيات اللي عندك.
