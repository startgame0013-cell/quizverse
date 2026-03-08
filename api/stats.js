import mongoose from 'mongoose'
import Quiz from '../backend/models/Quiz.js'
import User from '../backend/models/User.js'
import Class from '../backend/models/Class.js'

let cached = null

async function connect() {
  if (cached) return cached
  const uri = process.env.MONGODB_URI || process.env.ATLAS_URI
  if (!uri) {
    throw new Error('MONGODB_URI or ATLAS_URI not set')
  }
  cached = mongoose.connection
  if (cached.readyState === 0) {
    await mongoose.connect(uri)
  }
  return cached
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    await connect()
    const [quizzes, players, schools] = await Promise.all([
      Quiz.countDocuments(),
      User.countDocuments(),
      Class.countDocuments(),
    ])
    res.json({ ok: true, quizzes, players, schools })
  } catch (err) {
    console.error('Stats error:', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
}
