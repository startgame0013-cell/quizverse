import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizverse';
  const options = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  };
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await mongoose.connect(uri, options);
      console.log('QuizVerse — MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection error (attempt ${i + 1}/${MAX_RETRIES}):`, err.message);
      if (/bad auth|Authentication failed/i.test(err.message)) {
        console.error('Fix: Atlas → Security → Database Access → Edit user → Reset password. Update MONGODB_URI in Render. See MONGODB_SETUP.md');
      }
      if (i < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      } else {
        console.error('MongoDB connection failed. See MONGODB_SETUP.md');
        process.exit(1);
      }
    }
  }
}
