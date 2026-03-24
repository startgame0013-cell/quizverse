/**
 * قائمة المواضع: كل عنصر = درس/ملف/فيديو/رابط مرتبط بمادة + صف + وحدة.
 * النوع type: summary | pdf | video | link
 *
 * - ملخص (summary): النص داخل الكود (bodyEn / bodyAr).
 * - pdf / video / link: حقل url (رابط تضعينه أنت؛ قد يكون ملفاً رفعتموه على موقعكم أو فيديو يوتيوب).
 *
 * هذا لا يجلب محتوى من الإنترنت تلقائياً — مثل مواقع المراجعة من ناحية الشكل (تصفح، بحث، فلترة)،
 * لكن البيانات نفسها من ملفاتكم داخل المستودع.
 */

/** @typedef {'summary' | 'pdf' | 'video' | 'link'} StudyEntryType */

/**
 * @type {Array<{
 *   id: string
 *   subjectId: string
 *   gradeId: string
 *   unitId: string
 *   unitTitleEn: string
 *   unitTitleAr: string
 *   type: StudyEntryType
 *   titleEn: string
 *   titleAr: string
 *   descriptionEn?: string
 *   descriptionAr?: string
 *   bodyEn?: string
 *   bodyAr?: string
 *   url?: string
 *   tags?: string[]
 *   updatedAt?: string
 * }>}
 */
export const STUDY_ENTRIES = [
  {
    id: 'math-g5-fractions-summary',
    subjectId: 'math',
    gradeId: 'G5',
    unitId: 'fractions',
    unitTitleEn: 'Fractions & decimals',
    unitTitleAr: 'الكسور والأعداد العشرية',
    type: 'summary',
    titleEn: 'Quick review: comparing fractions',
    titleAr: 'مراجعة سريعة: مقارنة الكسور',
    descriptionEn: 'Same denominator, equivalent fractions, and ordering on a number line.',
    descriptionAr: 'مقارنة كسور لها نفس المقام، الكسور المتكافئة، والترتيب على خط الأعداد.',
    bodyEn:
      'When denominators match, compare numerators only. For unlike denominators, find a common denominator first. Equivalent fractions (e.g. 1/2 = 2/4) help simplify problems.',
    bodyAr:
      'عند تساوي المقامات، قارن البسط فقط. وإذا اختلفت المقامات، أوحّد المقام أولاً. الكسور المتكافئة (مثل ١/٢ = ٢/٤) تسهّل الحل.',
    tags: ['review', 'numbers'],
    updatedAt: '2026-01',
  },
  {
    id: 'science-g5-matter-pdf',
    subjectId: 'science',
    gradeId: 'G5',
    unitId: 'matter',
    unitTitleEn: 'Matter & properties',
    unitTitleAr: 'المادة وخصائصها',
    type: 'pdf',
    titleEn: 'States of matter — reference sheet (sample)',
    titleAr: 'حالات المادة — ورقة مرجعية (نموذج)',
    descriptionEn: 'Placeholder link for a PDF worksheet; replace URL when you host your file.',
    descriptionAr: 'رابط نموذجي لملف PDF؛ استبدل الرابط عند رفع الملف على موقعك.',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['reference'],
    updatedAt: '2026-01',
  },
  {
    id: 'arabic-g4-reading-video',
    subjectId: 'arabic',
    gradeId: 'G4',
    unitId: 'reading',
    unitTitleEn: 'Reading comprehension',
    unitTitleAr: 'الفهم القرائي',
    type: 'video',
    titleEn: 'Sample educational video (YouTube)',
    titleAr: 'فيديو تعليمي نموذجي (يوتيوب)',
    descriptionEn: 'Replace with your curriculum-aligned lesson.',
    descriptionAr: 'استبدله بدرس يتوافق مع منهجك.',
    url: 'https://www.youtube.com/watch?v=5MgBikgcWnY',
    tags: ['listening'],
    updatedAt: '2026-01',
  },
  {
    id: 'social-g6-citizenship-link',
    subjectId: 'social',
    gradeId: 'G6',
    unitId: 'citizenship',
    unitTitleEn: 'Citizenship & values',
    unitTitleAr: 'المواطنة والقيم',
    type: 'link',
    titleEn: 'Official MOE resources (example)',
    titleAr: 'موارد رسمية (مثال)',
    descriptionEn: 'External portal link pattern — point to your ministry or school hub.',
    descriptionAr: 'نمط رابط خارجي — وجّهه لبوابة الوزارة أو مدرستك.',
    url: 'https://www.moe.edu.kw',
    tags: ['official'],
    updatedAt: '2026-01',
  },
  {
    id: 'math-g6-ratios-summary',
    subjectId: 'math',
    gradeId: 'G6',
    unitId: 'ratios',
    unitTitleEn: 'Ratios & proportions',
    unitTitleAr: 'النسب والتناسب',
    type: 'summary',
    titleEn: 'Ratio tables in word problems',
    titleAr: 'جداول النسب في المسائل اللفظية',
    descriptionEn: 'Build a table: quantity A, quantity B, then scale or find unit rate.',
    descriptionAr: 'ابنِ جدولاً: الكمية أ، الكمية ب، ثم قياس أو إيجاد المعدل لكل وحدة.',
    bodyEn:
      'A ratio compares two quantities. A proportion states two ratios are equal. Use cross-multiplication carefully and keep units consistent.',
    bodyAr:
      'النسبة تقارن كميتين. والتناسب يعني تساوي نسبتين. استخدم الضرب التقاطعي بحذر وحافظ على وحدات متسقة.',
    tags: ['word problems'],
    updatedAt: '2026-02',
  },
  {
    id: 'science-g4-ecosystems-summary',
    subjectId: 'science',
    gradeId: 'G4',
    unitId: 'ecosystems',
    unitTitleEn: 'Ecosystems',
    unitTitleAr: 'النظم البيئية',
    type: 'summary',
    titleEn: 'Producers, consumers, decomposers',
    titleAr: 'المُنتِجون، المستهلِكون، المحلِّلات',
    descriptionEn: 'Energy flow in a food chain.',
    descriptionAr: 'تدفق الطاقة في السلسلة الغذائية.',
    bodyEn:
      'Producers (plants) capture energy from sunlight. Consumers eat other organisms. Decomposers break down dead matter and recycle nutrients.',
    bodyAr:
      'المُنتِجون (النباتات) يخزنون الطاقة من الشمس. المستهلِكون يأكلون كائناً آخر. المحلِّلات تفكك المادة الميتة وتعيد تدوير المغذيات.',
    tags: ['biology'],
    updatedAt: '2026-02',
  },
]
