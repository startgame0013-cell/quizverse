// Mock generated questions for AI Quiz Generator — يدعم العربية والإنجليزية حسب لغة الواجهة

const MOCK_EN = {
  'world capitals': [
    { text: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correctIndex: 2 },
    { text: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correctIndex: 1 },
    { text: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correctIndex: 2 },
    { text: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctIndex: 2 },
    { text: 'What is the capital of Egypt?', options: ['Alexandria', 'Cairo', 'Giza', 'Luxor'], correctIndex: 1 },
  ],
  'science': [
    { text: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
    { text: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correctIndex: 1 },
    { text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], correctIndex: 2 },
    { text: 'What is the boiling point of water in Celsius?', options: ['90°C', '100°C', '110°C', '120°C'], correctIndex: 1 },
    { text: 'Which gas do plants absorb from the air?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correctIndex: 2 },
  ],
  'history': [
    { text: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
    { text: 'Who was the first president of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctIndex: 2 },
    { text: 'The Great Wall of China was built primarily to protect against invasions from which direction?', options: ['South', 'East', 'North', 'West'], correctIndex: 2 },
    { text: 'Which ancient civilization built the Machu Picchu?', options: ['Aztec', 'Maya', 'Inca', 'Olmec'], correctIndex: 2 },
    { text: 'In which country did the Renaissance begin?', options: ['France', 'Germany', 'Italy', 'Spain'], correctIndex: 2 },
  ],
  default: [
    { text: 'What is 7 × 8?', options: ['54', '56', '58', '60'], correctIndex: 1 },
    { text: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1 },
    { text: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
    { text: 'How many continents are there?', options: ['5', '6', '7', '8'], correctIndex: 2 },
    { text: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], correctIndex: 2 },
  ],
}

const MOCK_AR = {
  'world capitals': [
    { text: 'ما عاصمة اليابان؟', options: ['سيول', 'بكين', 'طوكيو', 'بانكوك'], correctIndex: 2 },
    { text: 'ما عاصمة فرنسا؟', options: ['ليون', 'باريس', 'مرسيليا', 'نيس'], correctIndex: 1 },
    { text: 'ما عاصمة البرازيل؟', options: ['ريو دي جانيرو', 'ساو باولو', 'برازيليا', 'سالفادور'], correctIndex: 2 },
    { text: 'ما عاصمة أستراليا؟', options: ['سيدني', 'ملبورن', 'كانبرا', 'بيرث'], correctIndex: 2 },
    { text: 'ما عاصمة مصر؟', options: ['الإسكندرية', 'القاهرة', 'الجيزة', 'الأقصر'], correctIndex: 1 },
  ],
  'science': [
    { text: 'ما الرمز الكيميائي للذهب؟', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
    { text: 'كم عدد الكواكب في مجموعتنا الشمسية؟', options: ['7', '8', '9', '10'], correctIndex: 1 },
    { text: 'ما مصنع الطاقة في الخلية؟', options: ['النواة', 'الريبوسوم', 'الميتوكندريا', 'جهاز غولجي'], correctIndex: 2 },
    { text: 'ما درجة غليان الماء بالمئوي؟', options: ['90°م', '100°م', '110°م', '120°م'], correctIndex: 1 },
    { text: 'أي غاز تمتص النباتات من الهواء؟', options: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيدروجين'], correctIndex: 2 },
  ],
  'history': [
    { text: 'في أي سنة انتهت الحرب العالمية الثانية؟', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
    { text: 'من كان أول رئيس للولايات المتحدة؟', options: ['جون آدامز', 'توماس جيفرسون', 'جورج واشنطن', 'بنجامين فرانكلين'], correctIndex: 2 },
    { text: 'بُني سور الصين العظيم أساساً للحماية من غزوات من أي اتجاه؟', options: ['الجنوب', 'الشرق', 'الشمال', 'الغرب'], correctIndex: 2 },
    { text: 'أي حضارة قديمة بنت ماتشو بيتشو؟', options: ['الأزتك', 'المايا', 'الإنكا', 'الأولمك'], correctIndex: 2 },
    { text: 'في أي بلد بدأت النهضة؟', options: ['فرنسا', 'ألمانيا', 'إيطاليا', 'إسبانيا'], correctIndex: 2 },
  ],
  'عواصم': [
    { text: 'ما عاصمة اليابان؟', options: ['سيول', 'بكين', 'طوكيو', 'بانكوك'], correctIndex: 2 },
    { text: 'ما عاصمة فرنسا؟', options: ['ليون', 'باريس', 'مرسيليا', 'نيس'], correctIndex: 1 },
    { text: 'ما عاصمة البرازيل؟', options: ['ريو دي جانيرو', 'ساو باولو', 'برازيليا', 'سالفادور'], correctIndex: 2 },
    { text: 'ما عاصمة أستراليا؟', options: ['سيدني', 'ملبورن', 'كانبرا', 'بيرث'], correctIndex: 2 },
    { text: 'ما عاصمة مصر؟', options: ['الإسكندرية', 'القاهرة', 'الجيزة', 'الأقصر'], correctIndex: 1 },
  ],
  'علوم': [
    { text: 'ما الرمز الكيميائي للذهب؟', options: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
    { text: 'كم عدد الكواكب في مجموعتنا الشمسية؟', options: ['7', '8', '9', '10'], correctIndex: 1 },
    { text: 'ما مصنع الطاقة في الخلية؟', options: ['النواة', 'الريبوسوم', 'الميتوكندريا', 'جهاز غولجي'], correctIndex: 2 },
    { text: 'ما درجة غليان الماء بالمئوي؟', options: ['90°م', '100°م', '110°م', '120°م'], correctIndex: 1 },
    { text: 'أي غاز تمتص النباتات من الهواء؟', options: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيدروجين'], correctIndex: 2 },
  ],
  'تاريخ': [
    { text: 'في أي سنة انتهت الحرب العالمية الثانية؟', options: ['1943', '1944', '1945', '1946'], correctIndex: 2 },
    { text: 'من كان أول رئيس للولايات المتحدة؟', options: ['جون آدامز', 'توماس جيفرسون', 'جورج واشنطن', 'بنجامين فرانكلين'], correctIndex: 2 },
    { text: 'بُني سور الصين العظيم أساساً للحماية من غزوات من أي اتجاه؟', options: ['الجنوب', 'الشرق', 'الشمال', 'الغرب'], correctIndex: 2 },
    { text: 'أي حضارة قديمة بنت ماتشو بيتشو؟', options: ['الأزتك', 'المايا', 'الإنكا', 'الأولمك'], correctIndex: 2 },
    { text: 'في أي بلد بدأت النهضة؟', options: ['فرنسا', 'ألمانيا', 'إيطاليا', 'إسبانيا'], correctIndex: 2 },
  ],
  default: [
    { text: 'ما ناتج 7 × 8؟', options: ['54', '56', '58', '60'], correctIndex: 1 },
    { text: 'أي كوكب يُعرف بالكوكب الأحمر؟', options: ['الزهرة', 'المريخ', 'المشتري', 'زحل'], correctIndex: 1 },
    { text: 'ما أكبر محيط على الأرض؟', options: ['الأطلسي', 'الهندي', 'المتجمد', 'الهادئ'], correctIndex: 3 },
    { text: 'كم عدد القارات؟', options: ['5', '6', '7', '8'], correctIndex: 2 },
    { text: 'ما أصغر عدد أولي؟', options: ['0', '1', '2', '3'], correctIndex: 2 },
  ],
}

function pickTopicKey(normalizedTopic, lang) {
  const map = lang === 'ar'
    ? [
        ['عواصم', 'عواصم', 'عاصمة', 'world capitals', 'capitals'],
        ['علوم', 'علوم', 'science'],
        ['تاريخ', 'تاريخ', 'history'],
      ]
    : [
        ['world capitals', 'world capitals', 'capitals'],
        ['science', 'science'],
        ['history', 'history'],
      ]
  for (const [key, ...keywords] of map) {
    if (keywords.some((kw) => normalizedTopic.includes(kw))) return key
  }
  return 'default'
}

export function getMockQuestions(topic, difficulty, count = 5, lang = 'en') {
  const normalizedTopic = (topic || '').toLowerCase().trim() || 'default'
  const isAr = lang === 'ar'
  const data = isAr ? MOCK_AR : MOCK_EN
  const key = pickTopicKey(normalizedTopic, lang)
  let questions = [...(data[key] || data.default)]
  if (difficulty === 'hard') questions = [...questions].reverse()
  return questions.slice(0, Math.min(count, 10))
}
