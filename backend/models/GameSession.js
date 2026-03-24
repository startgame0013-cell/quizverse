import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
  playerId: String,
  nickname: String,
  /** Which question this answer belongs to (host advancers). */
  questionIndex: { type: Number, default: null },
  answerIndex: Number,
  correct: Boolean,
  points: Number,
  timeTaken: Number, // seconds
  answeredAt: { type: Date, default: Date.now },
})

const playerSchema = new mongoose.Schema({
  socketId: String,
  nickname: { type: String, required: true },
  score: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
})

const gameSessionSchema = new mongoose.Schema(
  {
    pin: { type: String, required: true, unique: true },
    /** When set, live reports roll up under this class for the teacher dashboard */
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null, index: true },
    quizId: { type: String, required: true },
    quizTitle: { type: String, default: '' },
    quizData: { type: mongoose.Schema.Types.Mixed },
    hostId: String,
    hostName: { type: String, default: 'Host' },
    status: { type: String, enum: ['waiting', 'playing', 'ended'], default: 'waiting' },
    currentQuestionIndex: { type: Number, default: 0 },
    players: [playerSchema],
    answers: [answerSchema],
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
)

gameSessionSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('GameSession', gameSessionSchema)
