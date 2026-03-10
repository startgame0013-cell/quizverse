import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    nav: { home: 'Home', quizzes: 'Quizzes', createQuiz: 'Create Quiz', login: 'Login', register: 'Register', dashboard: 'Dashboard', classes: 'Classes' },
    home: { title: 'QuizVerse', subtitle: 'Create and play interactive quizzes. For teachers, parents, and students.', browse: 'Browse Quizzes', getStarted: 'Get Started' },
    settings: { language: 'Language' },
  },
  ar: {
    nav: { home: 'الرئيسية', quizzes: 'الكويزات', createQuiz: 'إنشاء كويز', login: 'تسجيل الدخول', register: 'التسجيل', dashboard: 'لوحة التحكم', classes: 'الفصول' },
    home: { title: 'QuizVerse', subtitle: 'أنشئ وشارك في كويزات تفاعلية. للمعلمين والأهالي والطلاب.', browse: 'تصفح الكويزات', getStarted: 'ابدأ الآن' },
    settings: { language: 'اللغة' },
  },
}

const STORAGE_KEY = 'quizverse_lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en'
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = (newLang) => {
    if (translations[newLang]) setLangState(newLang)
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    return value ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
