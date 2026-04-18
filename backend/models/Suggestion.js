import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['suggestion', 'bug', 'other'], default: 'suggestion' },
    message: { type: String, required: true, maxlength: 4000 },
    email: { type: String, default: '', maxlength: 200 },
    path: { type: String, default: '' },
    ip: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  { timestamps: true }
);

suggestionSchema.index({ createdAt: -1 });

export default mongoose.model('Suggestion', suggestionSchema);
