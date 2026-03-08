import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Class from '../models/Class.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizverse';

async function seed() {
  await mongoose.connect(uri);
  console.log('MongoDB connected');

  // Clear existing data (optional - remove if you want to keep existing)
  await Quiz.deleteMany({});
  await Class.deleteMany({});
  await User.deleteMany({});

  // Create users
  const teacher = await User.create({
    name: 'أحمد المعلم',
    email: 'teacher@quizverse.demo',
    password: 'password123',
    role: 'teacher',
  });

  const students = await Promise.all([
    User.create({ name: 'سارة الطالبة', email: 'sara@quizverse.demo', password: 'password123', role: 'student' }),
    User.create({ name: 'محمد الطالب', email: 'mohamed@quizverse.demo', password: 'password123', role: 'student' }),
    User.create({ name: 'فاطمة الطالبة', email: 'fatima@quizverse.demo', password: 'password123', role: 'student' }),
    User.create({ name: 'علي الطالب', email: 'ali@quizverse.demo', password: 'password123', role: 'student' }),
  ]);

  const teacher2 = await User.create({
    name: 'خالد المعلم',
    email: 'khaled@quizverse.demo',
    password: 'password123',
    role: 'teacher',
  });

  console.log('Created users:', 1 + students.length + 1);

  // Create quizzes
  const quiz1 = await Quiz.create({
    title: 'عواصم الخليج',
    titleAr: 'عواصم دول الخليج',
    description: 'أسماء عواصم دول مجلس التعاون الخليجي',
    createdBy: teacher._id,
    category: 'geography',
    language: 'ar',
    isPublic: true,
    questions: [
      { question: 'ما عاصمة الكويت؟', questionAr: 'ما عاصمة الكويت؟', options: ['دبي', 'الكويت', 'الرياض', 'المنامة'], correctIndex: 1, timeLimit: 30 },
      { question: 'ما عاصمة السعودية؟', questionAr: 'ما عاصمة السعودية؟', options: ['جدة', 'الرياض', 'مكة', 'المدينة'], correctIndex: 1, timeLimit: 30 },
    ],
  });

  const quiz2 = await Quiz.create({
    title: 'World Capitals',
    description: 'Major world capitals',
    createdBy: teacher._id,
    category: 'geography',
    language: 'en',
    isPublic: true,
    questions: [
      { question: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctIndex: 2, timeLimit: 30 },
      { question: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correctIndex: 1, timeLimit: 30 },
    ],
  });

  const quiz3 = await Quiz.create({
    title: 'رياضيات سريعة',
    description: 'مسائل رياضية بسيطة',
    createdBy: teacher2._id,
    category: 'science',
    language: 'ar',
    isPublic: true,
    questions: [
      { question: 'ما ناتج 5 × 7؟', options: ['30', '35', '40', '42'], correctIndex: 1, timeLimit: 30 },
      { question: 'ما ناتج 12 ÷ 3؟', options: ['2', '3', '4', '6'], correctIndex: 2, timeLimit: 30 },
    ],
  });

  const moreQuizzes = await Quiz.insertMany([
    { title: 'Science Basics', description: 'Basic science', createdBy: teacher._id, category: 'science', questions: [{ question: 'H2O is?', options: ['Oxygen', 'Water', 'Salt', 'Carbon'], correctIndex: 1, timeLimit: 30 }] },
    { title: 'Islamic Studies', description: 'Islamic trivia', createdBy: teacher._id, category: 'religion', questions: [{ question: 'How many pillars of Islam?', options: ['4', '5', '6', '7'], correctIndex: 1, timeLimit: 30 }] },
  ]);

  const allQuizzes = [quiz1, quiz2, quiz3, ...moreQuizzes];
  console.log('Created quizzes:', allQuizzes.length);

  // Create classes (schools)
  const class1 = await Class.create({
    name: 'صف السادس أ',
    code: 'GR6A2026',
    teacher: teacher._id,
    students: students.map((s) => s._id),
    quizzes: [quiz1._id, quiz2._id],
  });

  const class2 = await Class.create({
    name: 'صف الخامس ب',
    code: 'GR5B2026',
    teacher: teacher2._id,
    students: students.slice(0, 2).map((s) => s._id),
    quizzes: [quiz3._id],
  });

  const moreClasses = await Class.insertMany([
    { name: 'صف الرابع', code: 'GR4X2026', teacher: teacher._id, students: [], quizzes: [] },
    { name: 'صف الثالث', code: 'GR3X2026', teacher: teacher._id, students: [], quizzes: [] },
  ]);

  const allClasses = [class1, class2, ...moreClasses];
  console.log('Created classes:', allClasses.length);

  const userCount = await User.countDocuments();
  const quizCount = await Quiz.countDocuments();
  const classCount = await Class.countDocuments();

  console.log('\n--- Stats ---');
  console.log('Users (players):', userCount);
  console.log('Quizzes:', quizCount);
  console.log('Schools/Classes:', classCount);
  console.log('\nSeed complete.');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
