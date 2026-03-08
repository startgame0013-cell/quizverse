/**
 * Game data for mini games
 */

export const WORD_SCRAMBLE_WORDS = [
  { word: 'book', lang: 'en' },
  { word: 'water', lang: 'en' },
  { word: 'happy', lang: 'en' },
  { word: 'school', lang: 'en' },
  { word: 'learn', lang: 'en' },
  { word: 'read', lang: 'en' },
  { word: 'علم', lang: 'ar' },
  { word: 'كتاب', lang: 'ar' },
  { word: 'ماء', lang: 'ar' },
  { word: 'بيت', lang: 'ar' },
  { word: 'قلم', lang: 'ar' },
  { word: 'شمس', lang: 'ar' },
]

export const TRUE_FALSE_QUESTIONS = [
  { statement: 'The capital of Kuwait is Kuwait City.', answer: true },
  { statement: 'Water boils at 100 degrees Celsius.', answer: true },
  { statement: 'There are 9 planets in our solar system.', answer: false },
  { statement: 'Arabic is written from right to left.', answer: true },
  { statement: 'The sun rises in the west.', answer: false },
  { statement: '2 + 2 equals 5.', answer: false },
  { statement: 'Kuwait gained independence in 1961.', answer: true },
  { statement: 'Humans have 10 fingers.', answer: false },
  { statement: 'The Earth orbits the Sun.', answer: true },
  { statement: 'Fish live in water.', answer: true },
  { statement: 'عاصمة الكويت الرياض.', answer: false },
  { statement: 'الماء يغلي عند ١٠٠ درجة مئوية.', answer: true },
]

export const FLAG_COUNTRIES = [
  { name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼' },
  { name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦' },
  { name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪' },
  { name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭' },
  { name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦' },
  { name: 'Oman', nameAr: 'عُمان', flag: '🇴🇲' },
  { name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬' },
  { name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴' },
  { name: 'France', nameAr: 'فرنسا', flag: '🇫🇷' },
  { name: 'USA', nameAr: 'أمريكا', flag: '🇺🇸' },
  { name: 'UK', nameAr: 'بريطانيا', flag: '🇬🇧' },
  { name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵' },
  { name: 'India', nameAr: 'الهند', flag: '🇮🇳' },
  { name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪' },
  { name: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷' },
]

export const QUICK_TRIVIA_QUESTIONS = [
  { q: 'What is the capital of Kuwait?', a: 'Kuwait City', aAr: 'مدينة الكويت' },
  { q: 'How many days in a week?', a: '7', aAr: '٧' },
  { q: 'What color is the sky?', a: 'Blue', aAr: 'أزرق' },
  { q: 'What is 5 + 3?', a: '8', aAr: '٨' },
  { q: 'How many planets orbit the Sun?', a: '8', aAr: '٨' },
  { q: 'ما عاصمة الكويت؟', a: 'مدينة الكويت', aAr: 'مدينة الكويت' },
  { q: 'What do bees make?', a: 'Honey', aAr: 'عسل' },
  { q: 'What is the largest ocean?', a: 'Pacific', aAr: 'المحيط الهادئ' },
  { q: 'كم أركان الإسلام؟', a: 'خمسة', aAr: 'خمسة' },
  { q: 'What is H2O?', a: 'Water', aAr: 'ماء' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getScrambledWord() {
  const item = shuffle(WORD_SCRAMBLE_WORDS)[0]
  const letters = item.word.split('').filter((c) => c.trim())
  return { ...item, scrambled: shuffle(letters).join('') }
}

export function getTrueFalseQuestion() {
  return shuffle(TRUE_FALSE_QUESTIONS)[0]
}

export function getFlagQuestion(lang) {
  const items = shuffle(FLAG_COUNTRIES).slice(0, 4)
  const correct = items[0]
  const options = shuffle(items)
  return {
    flag: correct.flag,
    correctName: lang === 'ar' ? correct.nameAr : correct.name,
    options: options.map((o) => (lang === 'ar' ? o.nameAr : o.name)),
    correctIndex: options.findIndex((o) => o.name === correct.name),
  }
}

export function getTriviaQuestion(lang) {
  const q = shuffle(QUICK_TRIVIA_QUESTIONS)[0]
  const correct = lang === 'ar' ? q.aAr : q.a
  const others = QUICK_TRIVIA_QUESTIONS.filter((x) => x !== q)
    .slice(0, 3)
    .map((x) => (lang === 'ar' ? x.aAr : x.a))
  const options = shuffle([correct, ...others])
  return {
    question: q.q,
    correct,
    options,
    correctIndex: options.indexOf(correct),
  }
}
