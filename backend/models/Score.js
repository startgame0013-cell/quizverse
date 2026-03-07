import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
    score: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

scoreSchema.index({ quiz: 1, score: -1 });
scoreSchema.index({ class: 1, quiz: 1, score: -1 });

export default mongoose.model('Score', scoreSchema);
