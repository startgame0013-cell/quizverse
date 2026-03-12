/**
 * QuizVerse Quiz Store - localStorage persistence
 * Extended data model for full MVP.
 */

const STORAGE_KEY = 'quizverse_quizzes'
const DEFAULTS_VERSION_KEY = 'quizverse_defaults_version'
// Bump this whenever default quiz data changes (so devs/users can choose to reset).
const DEFAULTS_VERSION = '2026-03-12-kuwait2026-v1'

function generateId() {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function generateQuestionId() {
  return `qn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function getAllQuizzes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getQuizById(id) {
  return getAllQuizzes().find((q) => q.id === id) ?? null
}

/** Get question text/options in the selected language only (no fallback — توحيد اللغة). */
export function getQuestionDisplay(question, lang) {
  if (!question) return { text: '', options: [] }
  const isAr = lang === 'ar'
  const text = isAr ? (question.textAr || '') : (question.text || '')
  const options = isAr ? (question.optionsAr || []) : (question.options || [])
  return { text, options }
}

/** Get quiz title/description in the selected language only (no fallback). */
export function getQuizDisplay(quiz, lang) {
  if (!quiz) return { title: '', description: '' }
  const isAr = lang === 'ar'
  const title = isAr ? (quiz.titleAr || '') : (quiz.title || '')
  const description = isAr ? (quiz.descriptionAr || '') : (quiz.description || '')
  return { title, description }
}

export function saveQuiz(quiz) {
  const quizzes = getAllQuizzes()
  const now = Date.now()
  const questions = (quiz.questions || []).map((q) => ({
    ...q,
    id: q.id || generateQuestionId(),
  }))
  const toSave = {
    ...quiz,
    id: quiz.id || generateId(),
    questions,
    updatedAt: now,
    createdAt: quiz.createdAt || now,
  }
  const existing = quizzes.findIndex((q) => q.id === toSave.id)
  if (existing >= 0) {
    quizzes[existing] = toSave
  } else {
    quizzes.push(toSave)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes))
  return toSave
}

export function deleteQuiz(id) {
  const quizzes = getAllQuizzes().filter((q) => q.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes))
}

export function duplicateQuiz(id) {
  const quiz = getQuizById(id)
  if (!quiz) return null
  const copy = { ...quiz, id: undefined, createdAt: undefined, updatedAt: undefined }
  copy.title = `${quiz.title} (Copy)`
  return saveQuiz(copy)
}

async function loadDefaultQuizBank() {
  const [{ ALL_SUBJECTS_QUIZZES }, { KUWAIT_ELEMENTARY_2026_QUIZZES }] = await Promise.all([
    import('@/data/allSubjectsQuizzes.js'),
    import('@/data/kuwaitElementary2026.js'),
  ])
  return [...ALL_SUBJECTS_QUIZZES, ...KUWAIT_ELEMENTARY_2026_QUIZZES]
}

/**
 * Seed quizzes on first load.
 * Note: we intentionally do NOT auto-overwrite existing user data.
 */
export async function seedDemoQuizzesIfNeeded() {
  try {
    const existing = getAllQuizzes()
    if (existing.length > 0) return

    const defaults = await loadDefaultQuizBank()
    defaults.forEach((quiz) => saveQuiz(quiz))

    localStorage.setItem(DEFAULTS_VERSION_KEY, DEFAULTS_VERSION)
  } catch {
    // ignore
  }
}

/** Reset quizzes to default: كل المواد + منهج الكويت الابتدائي 2026 */
export async function resetQuizzesToDefault() {
  const defaults = await loadDefaultQuizBank()
  localStorage.setItem(STORAGE_KEY, '[]')
  defaults.forEach((quiz) => saveQuiz(quiz))
  localStorage.setItem(DEFAULTS_VERSION_KEY, DEFAULTS_VERSION)
}