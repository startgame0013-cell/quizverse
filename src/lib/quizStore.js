/**
 * QuizVerse Quiz Store - localStorage persistence
 * Extended data model for full MVP.
 */

const STORAGE_KEY = 'quizverse_quizzes'
const DEMO_SEEDED_KEY = 'quizverse_demo_seeded'
const KUWAIT_2026_SEEDED_KEY = 'quizverse_kuwait2026_seeded'

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

/** Seed demo quizzes on first load if storage is empty */
export async function seedDemoQuizzesIfNeeded() {
  try {
    if (!localStorage.getItem(DEMO_SEEDED_KEY)) {
      const existing = getAllQuizzes()
      if (existing.length === 0) {
        const demos = getDemoQuizzes()
        demos.forEach((q) => saveQuiz(q))
        localStorage.setItem(DEMO_SEEDED_KEY, '1')
      } else {
        localStorage.setItem(DEMO_SEEDED_KEY, '1')
      }
    }
    if (!localStorage.getItem(KUWAIT_2026_SEEDED_KEY)) {
      const { KUWAIT_ELEMENTARY_2026_QUIZZES } = await import('@/data/kuwaitElementary2026.js')
      KUWAIT_ELEMENTARY_2026_QUIZZES.forEach((q) => saveQuiz(q))
      localStorage.setItem(KUWAIT_2026_SEEDED_KEY, '1')
    }
  } catch {}
}

function getDemoQuizzes() {
  return [
    {
      title: 'Kuwait History Grade 5',
      description: 'Basic Kuwait history for fifth grade students.',
      category: 'history',
      audience: 'students',
      difficulty: 'easy',
      language: 'ar',
      questions: [
        { text: 'متى تأسست دولة الكويت؟', options: ['١٩٦١', '١٩٥٠', '١٩٦٢', '١٩٧٠'], correctIndex: 0, explanation: 'استقلت الكويت عام ١٩٦١' },
        { text: 'ما هي عاصمة الكويت؟', options: ['الأحمدي', 'الجهراء', 'الكويت', 'حولي'], correctIndex: 2 },
        { text: 'كم عدد المحافظات في الكويت؟', options: ['٤', '٥', '٦', '٧'], correctIndex: 2 },
      ],
    },
    {
      title: 'Arabic Vocabulary Challenge',
      description: 'Test your Arabic vocabulary skills.',
      category: 'language',
      audience: 'students',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: 'ما معنى كلمة "سريع"؟', options: ['بطيء', 'سريع', 'كبير', 'صغير'], correctIndex: 1 },
        { text: 'ما عكس كلمة "حار"؟', options: ['دافئ', 'بارد', 'معتدل', 'جاف'], correctIndex: 1 },
        { text: 'ما جمع كلمة "كتاب"؟', options: ['كتب', 'كتابات', 'كتيبة', 'مكتبة'], correctIndex: 0 },
      ],
    },
    {
      title: 'Family Fun Night',
      description: 'Light trivia for family game night.',
      category: 'general',
      audience: 'families',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correctIndex: 2 },
        { text: 'What color is the sky?', options: ['Green', 'Blue', 'Red', 'Yellow'], correctIndex: 1 },
        { text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
      ],
    },
    {
      title: 'Science Basics',
      description: 'Basic science for elementary students.',
      category: 'science',
      audience: 'students',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], correctIndex: 1 },
        { text: 'How many planets orbit the Sun?', options: ['7', '8', '9', '10'], correctIndex: 1 },
        { text: 'What is H2O?', options: ['Salt', 'Sugar', 'Water', 'Oil'], correctIndex: 2 },
      ],
    },
    {
      title: 'Ramadan Quiz',
      description: 'Islamic trivia for Ramadan.',
      category: 'religion',
      audience: 'families',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: 'كم عدد أركان الإسلام؟', options: ['٤', '٥', '٦', '٧'], correctIndex: 1 },
        { text: 'في أي شهر يصوم المسلمون؟', options: ['شعبان', 'رمضان', 'شوال', 'ذو الحجة'], correctIndex: 1 },
        { text: 'ما أول سورة في القرآن؟', options: ['البقرة', 'الفاتحة', 'الإخلاص', 'الناس'], correctIndex: 1 },
      ],
    },
    {
      title: 'GCC Capitals',
      description: 'Capitals of Gulf Cooperation Council countries.',
      category: 'geography',
      audience: 'students',
      difficulty: 'medium',
      language: 'en',
      questions: [
        { text: 'What is the capital of Saudi Arabia?', options: ['Jeddah', 'Riyadh', 'Mecca', 'Medina'], correctIndex: 1 },
        { text: 'What is the capital of UAE?', options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], correctIndex: 1 },
        { text: 'What is the capital of Bahrain?', options: ['Manama', 'Muharraq', 'Riffa', 'Sitra'], correctIndex: 0 },
      ],
    },
    {
      title: 'Islamic Trivia',
      description: 'General Islamic knowledge.',
      category: 'religion',
      audience: 'families',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: 'كم عدد سور القرآن الكريم؟', options: ['١١٢', '١١٣', '١١٤', '١١٥'], correctIndex: 2 },
        { text: 'ما اسم أول مسجد بني في الإسلام؟', options: ['المسجد النبوي', 'مسجد قباء', 'المسجد الحرام', 'مسجد القبلتين'], correctIndex: 1 },
      ],
    },
    {
      title: 'Kids General Knowledge',
      description: 'Fun facts for kids.',
      category: 'general',
      audience: 'students',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'What do bees make?', options: ['Milk', 'Honey', 'Butter', 'Cheese'], correctIndex: 1 },
        { text: 'How many legs does a spider have?', options: ['6', '8', '10', '12'], correctIndex: 1 },
        { text: 'What is the largest animal on Earth?', options: ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], correctIndex: 1 },
      ],
    },
  ]
}
