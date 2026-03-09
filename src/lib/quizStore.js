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

/** Get question text/options in the current language */
export function getQuestionDisplay(question, lang) {
  if (!question) return { text: '', options: [] }
  const isAr = lang === 'ar'
  const text = (isAr && question.textAr) ? question.textAr : (question.text || '')
  const options = (isAr && question.optionsAr?.length) ? question.optionsAr : (question.options || [])
  return { text, options }
}

/** Get quiz title/description in the current language */
export function getQuizDisplay(quiz, lang) {
  if (!quiz) return { title: '', description: '' }
  const isAr = lang === 'ar'
  const title = (isAr && quiz.titleAr) ? quiz.titleAr : (quiz.title || '')
  const description = (isAr && quiz.descriptionAr) ? quiz.descriptionAr : (quiz.description || '')
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
      title: 'Welcome to QuizNova',
      titleAr: 'مرحباً بك في QuizNova',
      description: 'أول كويز على QuizNova. جرّب وتعلم!',
      descriptionAr: 'أول كويز على QuizNova. جرّب وتعلم!',
      category: 'general',
      audience: 'students',
      difficulty: 'easy',
      language: 'ar',
      questions: [
        { text: 'What is QuizNova?', textAr: 'ما هو QuizNova؟', options: ['A game', 'A quiz platform', 'A social app', 'A music app'], optionsAr: ['لعبة', 'منصة كويزات', 'تطبيق تواصل', 'تطبيق موسيقى'], correctIndex: 1 },
        { text: 'How do you create a quiz?', textAr: 'كيف تنشئ كويزاً؟', options: ['Join game', 'Create Quiz', 'Play only', 'Sign out'], optionsAr: ['انضم للعبة', 'إنشاء كويز', 'العب فقط', 'تسجيل خروج'], correctIndex: 1 },
        { text: 'Can you play in Arabic?', textAr: 'هل يمكنك اللعب بالعربية؟', options: ['No', 'Yes', 'English only', 'Maybe'], optionsAr: ['لا', 'نعم', 'إنجليزي فقط', 'ربما'], correctIndex: 1 },
      ],
    },
    {
      title: 'Kuwait History Grade 5',
      titleAr: 'تاريخ الكويت الصف الخامس',
      description: 'Basic Kuwait history for fifth grade students.',
      descriptionAr: 'تاريخ الكويت الأساسي لطلاب الصف الخامس.',
      category: 'history',
      audience: 'students',
      difficulty: 'easy',
      language: 'ar',
      questions: [
        { text: 'When did Kuwait gain independence?', textAr: 'متى تأسست دولة الكويت؟', options: ['1961', '1950', '1962', '1970'], optionsAr: ['١٩٦١', '١٩٥٠', '١٩٦٢', '١٩٧٠'], correctIndex: 0, explanation: 'استقلت الكويت عام ١٩٦١' },
        { text: 'What is the capital of Kuwait?', textAr: 'ما هي عاصمة الكويت؟', options: ['Ahmadi', 'Jahra', 'Kuwait City', 'Hawally'], optionsAr: ['الأحمدي', 'الجهراء', 'الكويت', 'حولي'], correctIndex: 2 },
        { text: 'How many governorates in Kuwait?', textAr: 'كم عدد المحافظات في الكويت؟', options: ['4', '5', '6', '7'], optionsAr: ['٤', '٥', '٦', '٧'], correctIndex: 2 },
      ],
    },
    {
      title: 'Arabic Vocabulary Challenge',
      titleAr: 'تحدي المفردات العربية',
      description: 'Test your Arabic vocabulary skills.',
      descriptionAr: 'اختبر مهاراتك في المفردات العربية.',
      category: 'language',
      audience: 'students',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: "What does the word 'سريع' mean?", textAr: 'ما معنى كلمة "سريع"؟', options: ['slow', 'fast', 'big', 'small'], optionsAr: ['بطيء', 'سريع', 'كبير', 'صغير'], correctIndex: 1 },
        { text: "What is the opposite of 'حار'?", textAr: 'ما عكس كلمة "حار"؟', options: ['warm', 'cold', 'mild', 'dry'], optionsAr: ['دافئ', 'بارد', 'معتدل', 'جاف'], correctIndex: 1 },
        { text: "What is the plural of 'كتاب'?", textAr: 'ما جمع كلمة "كتاب"؟', options: ['كتب', 'كتابات', 'كتيبة', 'مكتبة'], optionsAr: ['كتب', 'كتابات', 'كتيبة', 'مكتبة'], correctIndex: 0 },
      ],
    },
    {
      title: 'Family Fun Night',
      titleAr: 'ليلة العائلة الممتعة',
      description: 'Light trivia for family game night.',
      descriptionAr: 'أسئلة ترفيهية خفيفة للعائلة.',
      category: 'general',
      audience: 'families',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'How many days are in a leap year?', textAr: 'كم يوماً في السنة الكبيسة؟', options: ['364', '365', '366', '367'], optionsAr: ['٣٦٤', '٣٦٥', '٣٦٦', '٣٦٧'], correctIndex: 2 },
        { text: 'What color is the sky?', textAr: 'ما لون السماء؟', options: ['Green', 'Blue', 'Red', 'Yellow'], optionsAr: ['أخضر', 'أزرق', 'أحمر', 'أصفر'], correctIndex: 1 },
        { text: 'How many continents are there?', textAr: 'كم عدد القارات؟', options: ['5', '6', '7', '8'], optionsAr: ['٥', '٦', '٧', '٨'], correctIndex: 2 },
      ],
    },
    {
      title: 'Science Basics',
      titleAr: 'أساسيات العلوم',
      description: 'Basic science for elementary students.',
      descriptionAr: 'علوم أساسية لطلاب المرحلة الابتدائية.',
      category: 'science',
      audience: 'students',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'What is the powerhouse of the cell?', textAr: 'ما هو مصنع الطاقة في الخلية؟', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], optionsAr: ['النواة', 'الميتوكوندريا', 'الريبوسوم', 'جهاز جولجي'], correctIndex: 1 },
        { text: 'How many planets orbit the Sun?', textAr: 'كم كوكباً يدور حول الشمس؟', options: ['7', '8', '9', '10'], optionsAr: ['٧', '٨', '٩', '١٠'], correctIndex: 1 },
        { text: 'What is H2O?', textAr: 'ما هو H2O؟', options: ['Salt', 'Sugar', 'Water', 'Oil'], optionsAr: ['ملح', 'سكر', 'ماء', 'زيت'], correctIndex: 2 },
      ],
    },
    {
      title: 'Ramadan Quiz',
      titleAr: 'كويز رمضان',
      description: 'Islamic trivia for Ramadan.',
      descriptionAr: 'أسئلة إسلامية لرمضان.',
      category: 'religion',
      audience: 'families',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: 'How many pillars of Islam?', textAr: 'كم عدد أركان الإسلام؟', options: ['4', '5', '6', '7'], optionsAr: ['٤', '٥', '٦', '٧'], correctIndex: 1 },
        { text: 'In which month do Muslims fast?', textAr: 'في أي شهر يصوم المسلمون؟', options: ['Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Hijja'], optionsAr: ['شعبان', 'رمضان', 'شوال', 'ذو الحجة'], correctIndex: 1 },
        { text: 'What is the first surah in the Quran?', textAr: 'ما أول سورة في القرآن؟', options: ['Al-Baqarah', 'Al-Fatiha', 'Al-Ikhlas', 'An-Nas'], optionsAr: ['البقرة', 'الفاتحة', 'الإخلاص', 'الناس'], correctIndex: 1 },
      ],
    },
    {
      title: 'GCC Capitals',
      titleAr: 'عواصم دول الخليج',
      description: 'Capitals of Gulf Cooperation Council countries.',
      descriptionAr: 'عواصم دول مجلس التعاون الخليجي.',
      category: 'geography',
      audience: 'students',
      difficulty: 'medium',
      language: 'en',
      questions: [
        { text: 'What is the capital of Saudi Arabia?', textAr: 'ما عاصمة السعودية؟', options: ['Jeddah', 'Riyadh', 'Mecca', 'Medina'], optionsAr: ['جدة', 'الرياض', 'مكة', 'المدينة'], correctIndex: 1 },
        { text: 'What is the capital of UAE?', textAr: 'ما عاصمة الإمارات؟', options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'], optionsAr: ['دبي', 'أبوظبي', 'الشارقة', 'عجمان'], correctIndex: 1 },
        { text: 'What is the capital of Bahrain?', textAr: 'ما عاصمة البحرين؟', options: ['Manama', 'Muharraq', 'Riffa', 'Sitra'], optionsAr: ['المنامة', 'المحرق', 'الرفاع', 'سترة'], correctIndex: 0 },
      ],
    },
    {
      title: 'Islamic Trivia',
      titleAr: 'ترافيا إسلامية',
      description: 'General Islamic knowledge.',
      descriptionAr: 'معرفة إسلامية عامة.',
      category: 'religion',
      audience: 'families',
      difficulty: 'medium',
      language: 'ar',
      questions: [
        { text: 'How many surahs in the Quran?', textAr: 'كم عدد سور القرآن الكريم؟', options: ['112', '113', '114', '115'], optionsAr: ['١١٢', '١١٣', '١١٤', '١١٥'], correctIndex: 2 },
        { text: 'What is the first mosque built in Islam?', textAr: 'ما اسم أول مسجد بني في الإسلام؟', options: ['Al-Masjid An-Nabawi', 'Masjid Quba', 'Al-Masjid Al-Haram', 'Masjid Al-Qiblatayn'], optionsAr: ['المسجد النبوي', 'مسجد قباء', 'المسجد الحرام', 'مسجد القبلتين'], correctIndex: 1 },
      ],
    },
    {
      title: 'Kids General Knowledge',
      titleAr: 'معرفة عامة للأطفال',
      description: 'Fun facts for kids.',
      descriptionAr: 'معلومات ممتعة للأطفال.',
      category: 'general',
      audience: 'students',
      difficulty: 'easy',
      language: 'en',
      questions: [
        { text: 'What do bees make?', textAr: 'ماذا يصنع النحل؟', options: ['Milk', 'Honey', 'Butter', 'Cheese'], optionsAr: ['حليب', 'عسل', 'زبدة', 'جبن'], correctIndex: 1 },
        { text: 'How many legs does a spider have?', textAr: 'كم رجلاً للعنكبوت؟', options: ['6', '8', '10', '12'], optionsAr: ['٦', '٨', '١٠', '١٢'], correctIndex: 1 },
        { text: 'What is the largest animal on Earth?', textAr: 'ما أكبر حيوان على الأرض؟', options: ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], optionsAr: ['فيل', 'الحوت الأزرق', 'زرافة', 'الدب القطبي'], correctIndex: 1 },
      ],
    },
  ]
}
