import mongoose from 'mongoose'
import Quiz from '../backend/models/Quiz.js'
import User from '../backend/models/User.js'
import Class from '../backend/models/Class.js'

let cached = null

async function connect() {
  const uri = process.env.MONGODB_URI || process.env.ATLAS_URI
  if (!uri) return null
  if (cached) return cached
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
    const conn = await connect()
    if (!conn) {
      return res.json({ ok: true, quizzes: 0, players: 0, schools: 0 })
    }
    const [quizzes, players, schools] = await Promise.all([
      Quiz.countDocuments(),
      User.countDocuments(),
      Class.countDocuments(),
    ])
    res.json({ ok: true, quizzes, players, schools })
  } catch (err) {
    console.error('Stats error:', err.message)
    res.json({ ok: true, quizzes: 0, players: 0, schools: 0 })
  }
}
