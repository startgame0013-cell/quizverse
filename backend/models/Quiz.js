import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  questionAr: { type: String, default: '' },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true, min: 0 },
  timeLimit: { type: Number, default: 30 },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, default: '' },
    description: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [questionSchema],
    category: { type: String, default: 'general' },
    language: { type: String, enum: ['en', 'ar'], default: 'en' },
    isPublic: { type: Boolean, default: true },
    totalTime: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
