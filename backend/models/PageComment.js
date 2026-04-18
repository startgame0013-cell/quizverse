import mongoose from 'mongoose';

const pageCommentSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, maxlength: 220, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String, default: '', maxlength: 120 },
    body: { type: String, required: true, maxlength: 800 },
  },
  { timestamps: true }
);

pageCommentSchema.index({ pageKey: 1, createdAt: -1 });

export default mongoose.model('PageComment', pageCommentSchema);
