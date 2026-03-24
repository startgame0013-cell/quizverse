import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    /** Display name for reports (e.g. school or stage) */
    institutionName: { type: String, trim: true, default: '' },
    code: { type: String, required: true, unique: true, uppercase: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
  { timestamps: true }
);

export default mongoose.model('Class', classSchema);
