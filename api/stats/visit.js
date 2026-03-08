import mongoose from 'mongoose'
import Visit from '../../backend/models/Visit.js'
import geoip from 'geoip-lite'

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

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip ||
    ''
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    await connect()
    const ip = getClientIp(req)
    const userAgent = req.headers['user-agent'] || ''
    const path = req.body?.path || '/'
    const referrer = req.body?.referrer || ''

    let country = ''
    let city = ''
    if (ip && ip !== '127.0.0.1' && ip !== '::1') {
      const geo = geoip.lookup(ip)
      if (geo) {
        country = geo.country || ''
        city = geo.city || ''
      }
    }

    await Visit.create({ ip, country, city, userAgent, path, referrer })
    res.json({ ok: true })
  } catch (err) {
    console.error('Visit error:', err.message)
    res.status(500).json({ ok: false, error: err.message })
  }
}
