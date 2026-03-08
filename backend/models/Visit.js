import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    ip: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    path: { type: String, default: '/' },
    referrer: { type: String, default: '' },
  },
  { timestamps: true }
);

visitSchema.index({ createdAt: -1 });
visitSchema.index({ country: 1 });

export default mongoose.model('Visit', visitSchema);
