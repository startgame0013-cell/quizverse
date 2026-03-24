import mongoose from 'mongoose'

const responseSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    questionId: { type: String, default: '' },
    answerIndex: { type: Number, required: true },
    correct: { type: Boolean, required: true },
    timeMs: { type: Number, default: 0 },
  },
  { _id: false }
)

const soloQuizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: String, required: true, index: true },
    quizTitle: { type: String, default: '' },
    mode: { type: String, enum: ['solo'], default: 'solo' },
    /** Client-generated idempotency key (one finished run). */
    sessionKey: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timeSpentSec: { type: Number, default: 0 },
    responses: [responseSchema],
    /** Institutional: link to Class so teachers can aggregate cloud reports */
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null, index: true },
    /** XP granted for this attempt (gamification) */
    xpEarned: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

soloQuizAttemptSchema.index({ user: 1, quizId: 1, createdAt: -1 })
soloQuizAttemptSchema.index({ classId: 1, createdAt: -1 })
soloQuizAttemptSchema.index({ user: 1, sessionKey: 1 }, { unique: true })

export default mongoose.model('SoloQuizAttempt', soloQuizAttemptSchema)
