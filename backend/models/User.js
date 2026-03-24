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
    /** Optional school / SIS identifier for institutional reporting */
    externalStudentId: { type: String, trim: true, default: '' },
    /** Gamification — total XP (solo quizzes + bonuses) */
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    /** Daily streak: consecutive UTC days with at least one qualifying solo completion */
    streak: { type: Number, default: 0, min: 0 },
    lastPlayDay: { type: String, default: '' },
    /** Team code for team leaderboard (uppercase, e.g. PHOENIX) */
    teamCode: { type: String, trim: true, uppercase: true, default: '', maxlength: 12 },
  },
  { timestamps: true }
);

userSchema.index({ xp: -1 });
userSchema.index({ teamCode: 1, xp: -1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
