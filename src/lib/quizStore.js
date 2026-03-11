/**
 * QuizVerse Quiz Store - localStorage persistence
 * Extended data model for full MVP.
 */

const STORAGE_KEY = 'quizverse_quizzes'
const DEMO_SEEDED_KEY = 'quizverse_demo_seeded'
const KUWAIT_2026_SEEDED_KEY = 'quizverse_kuwait2026_seeded'
const ALL_SUBJECTS_SEEDED_KEY = 'quizverse_all_subjects_seeded'

/**
 * Quiz data structure:
 * {
 *   id: string
 *   title: string
 *   description: string
 *   category: string
 *   audience: string
 *   difficulty: 'easy' | 'medium' | 'hard'
 *   language: string
 *   questions: [{ id, text, options[], correctIndex, explanation? }]
 *   createdAt: number
 *   updatedAt: number
 * }
 */

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

/** Seed quizzes on first load. Only ALL_SUBJECTS to avoid duplication (demo/Kuwait overlap). */
export async function seedDemoQuizzesIfNeeded() {
  try {
    if (!localStorage.getItem(DEMO_SEEDED_KEY)) localStorage.setItem(DEMO_SEEDED_KEY, '1')
    if (!localStorage.getItem(KUWAIT_2026_SEEDED_KEY)) localStorage.setItem(KUWAIT_2026_SEEDED_KEY, '1')
    if (!localStorage.getItem(ALL_SUBJECTS_SEEDED_KEY)) {
      const { ALL_SUBJECTS_QUIZZES } = await import('@/data/allSubjectsQuizzes.js')
      const existing = getAllQuizzes()
      if (existing.length === 0) {
        ALL_SUBJECTS_QUIZZES.forEach((quiz) => saveQuiz(quiz))
      }
      localStorage.setItem(ALL_SUBJECTS_SEEDED_KEY, '1')
    }
  } catch {}
}

/** Reset quizzes to default set only (removes duplicates). */
export async function resetQuizzesToDefault() {
  const { ALL_SUBJECTS_QUIZZES } = await import('@/data/allSubjectsQuizzes.js')
  localStorage.setItem(STORAGE_KEY, '[]')
  ALL_SUBJECTS_QUIZZES.forEach((quiz) => saveQuiz(quiz))
}

