import mongoose from 'mongoose'
import Visit from '../../backend/models/Visit.js'

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

const countryNames = {
  KW: 'Kuwait', SA: 'Saudi Arabia', AE: 'UAE', BH: 'Bahrain', OM: 'Oman', QA: 'Qatar',
  EG: 'Egypt', JO: 'Jordan', LB: 'Lebanon', SY: 'Syria', IQ: 'Iraq', IR: 'Iran',
  US: 'USA', GB: 'UK', IN: 'India', PK: 'Pakistan', BD: 'Bangladesh',
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
      return res.json({ ok: true, total: 0, byCountry: [], recent: [] })
    }
    const total = await Visit.countDocuments()

    const byCountry = await Visit.aggregate([
      { $match: { country: { $ne: '' } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ])

    const recent = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('ip country city path createdAt')
      .lean()

    res.json({
      ok: true,
      total,
      byCountry: byCountry.map((r) => ({
        country: countryNames[r._id] || r._id,
        code: r._id,
        count: r.count,
      })),
      recent: recent.map((v) => ({
        ...v,
        country: countryNames[v.country] || v.country || '-',
      })),
    })
  } catch (err) {
    console.error('Visits error:', err.message)
    res.json({ ok: true, total: 0, byCountry: [], recent: [] })
  }
}
