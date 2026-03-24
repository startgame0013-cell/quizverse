import API from '@/lib/api.js'

export function isMongoObjectId(s) {
  return typeof s === 'string' && /^[a-f0-9]{24}$/i.test(s)
}

/** Maps MongoDB Quiz document to the client shape used by Play / Create / Details */
export function serverQuizToClient(q) {
  if (!q) return null
  const id = String(q._id)
  const createdAt = q.createdAt ? new Date(q.createdAt).getTime() : Date.now()
  const updatedAt = q.updatedAt ? new Date(q.updatedAt).getTime() : createdAt
  return {
    id,
    title: q.title || '',
    titleAr: q.titleAr || '',
    description: q.description || '',
    descriptionAr: q.descriptionAr || '',
    category: q.category || 'general',
    language: q.language || 'en',
    difficulty: q.difficulty || 'medium',
    questions: (q.questions || []).map((qn, i) => ({
      id: `qn_${i}_${id.slice(-6)}`,
      text: qn.question || '',
      textAr: qn.questionAr || '',
      options: Array.isArray(qn.options) ? [...qn.options] : ['', '', '', ''],
      correctIndex: Math.max(0, Number(qn.correctIndex) || 0),
      timeLimit: Math.max(5, Number(qn.timeLimit) || 30),
      explanation: qn.explanation || '',
    })),
    createdAt,
    updatedAt,
    source: 'cloud',
  }
}

export function clientQuizToServerPayload({
  title,
  description,
  difficulty,
  category,
  questions,
  language = 'en',
}) {
  return {
    title: (title || '').trim(),
    titleAr: '',
    description: (description || '').trim(),
    descriptionAr: '',
    category: category || 'general',
    language: language === 'ar' ? 'ar' : 'en',
    isPublic: true,
    questions: (questions || []).map((q) => ({
      question: (q.text || '').trim(),
      questionAr: (q.textAr || '').trim(),
      options: (q.options || ['', '', '', '']).map((o) => (o || '').trim()),
      correctIndex: Math.max(0, Number(q.correctIndex) || 0),
      timeLimit: Math.max(5, Number(q.timeLimit) || 30),
    })),
  }
}

export async function fetchQuizPublic(id) {
  if (!API) throw new Error('No API')
  const res = await fetch(`${API}/api/quizzes/${id}`)
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Quiz not found')
  return data.quiz
}

export async function fetchMyQuizzes(token) {
  if (!API) throw new Error('No API')
  const res = await fetch(`${API}/api/quizzes/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Failed to load quizzes')
  return data.quizzes
}

export async function createQuizOnServer(token, payload) {
  const res = await fetch(`${API}/api/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Create failed')
  return data.quiz
}

export async function updateQuizOnServer(token, id, payload) {
  const res = await fetch(`${API}/api/quizzes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Update failed')
  return data.quiz
}

export async function deleteQuizOnServer(token, id) {
  const res = await fetch(`${API}/api/quizzes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Delete failed')
}

/** Build server payload from a client quiz object (after serverQuizToClient or local save). */
export function quizClientToServerPayload(quiz) {
  return clientQuizToServerPayload({
    title: (quiz.title || '') + '',
    description: quiz.description || '',
    difficulty: quiz.difficulty || 'medium',
    category: quiz.category || 'general',
    questions: quiz.questions || [],
    language: quiz.language || 'en',
  })
}
