import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    /** Public display name for leaderboard/games. If set, used instead of real name. */
    displayName: { type: String, trim: true, default: '' },
    role: {
      type: String,
      enum: ['student', 'teacher', 'parent', 'admin'],
      default: 'student',
    },
    avatar: { type: String, default: '' },
    /** Subscription: free | basic | pro | school */
    plan: { type: String, enum: ['free', 'basic', 'pro', 'school'], default: 'free' },
    planExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
