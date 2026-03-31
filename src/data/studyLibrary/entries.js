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
    descriptionEn: 'A practical review sheet for comparing and ordering fractions and decimals.',
    descriptionAr: 'ورقة مراجعة عملية لمقارنة الكسور والأعداد العشرية وترتيبها بسهولة.',
    bodyEn:
      '1. If the denominators are the same, compare the numerators only.\n2. If the denominators are different, convert to equivalent fractions with a common denominator.\n3. Use benchmark fractions such as 1/2 and 1 to estimate quickly.\n4. On a number line, place the fraction between the two whole numbers it belongs to.\n5. To compare decimals, line up the decimal points first, then compare digits from left to right.\n\nQuick example:\n3/8 and 5/8 have the same denominator, so 5/8 is greater.\n1/2 and 3/5 need a common denominator: 1/2 = 5/10 and 3/5 = 6/10, so 3/5 is greater.\n\nCommon mistakes:\n- Comparing the denominator alone.\n- Forgetting to keep equivalent fractions balanced.\n- Mixing decimal place values when writing zeros.',
    bodyAr:
      '١. إذا تساوت المقامات فقارني بين البسطين فقط.\n٢. إذا اختلفت المقامات فحوّلي الكسور إلى كسور متكافئة لها مقام مشترك.\n٣. استخدمي كسوراً مرجعية مثل ١/٢ و١ للمقارنة السريعة.\n٤. على خط الأعداد ضعي الكسر بين العددين الصحيحين المناسبين له.\n٥. عند مقارنة الأعداد العشرية رتّبي الفاصلة أولاً ثم قارني الأرقام من اليسار إلى اليمين.\n\nمثال سريع:\n٣/٨ و٥/٨ لهما المقام نفسه، إذن ٥/٨ أكبر.\n١/٢ و٣/٥ يحتاجان إلى مقام مشترك: ١/٢ = ٥/١٠ و٣/٥ = ٦/١٠، إذن ٣/٥ أكبر.\n\nأخطاء شائعة:\n- المقارنة بالمقام فقط.\n- نسيان توازن الكسر المتكافئ.\n- الخلط بين منازل الأعداد العشرية عند إضافة الأصفار.',
    tags: ['review', 'numbers', 'fractions', 'decimals'],
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
    descriptionEn: 'Reference worksheet for solids, liquids, and gases with simple classroom examples.',
    descriptionAr: 'ورقة مرجعية لحالات المادة: الصلبة والسائلة والغازية مع أمثلة صفية بسيطة.',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['reference', 'worksheet', 'matter'],
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
    descriptionEn: 'Listening and comprehension practice with a short guided lesson video.',
    descriptionAr: 'تدريب على الاستماع والفهم القرائي عبر فيديو قصير موجه للدرس.',
    url: 'https://www.youtube.com/watch?v=5MgBikgcWnY',
    tags: ['listening', 'comprehension', 'reading'],
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
    descriptionEn: 'External official resource for values, citizenship themes, and school activities.',
    descriptionAr: 'مصدر رسمي خارجي لموضوعات القيم والمواطنة والأنشطة المدرسية.',
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
    descriptionEn: 'Use tables, unit rate, and scale-up thinking to solve ratio word problems.',
    descriptionAr: 'استخدمي الجداول ومعدل الوحدة والتكبير لحل المسائل اللفظية في النسب.',
    bodyEn:
      'A ratio compares two related quantities such as 2 cups of juice to 5 cups of water.\nA proportion means two ratios are equal.\n\nStrategy:\n- Write the given ratio clearly.\n- Build a ratio table.\n- Multiply or divide both sides by the same number.\n- Check that units stay matched.\n\nExample:\nIf 3 notebooks cost 1.5 dinars, then 6 notebooks cost 3 dinars.\nIf 4 students share 20 pencils, each student gets 5 pencils.\n\nWatch for:\n- Reversing the order of the quantities.\n- Mixing different units.\n- Using cross multiplication before checking if a simpler unit rate works.',
    bodyAr:
      'النسبة تقارن بين كميتين مرتبطتين مثل ٢ كوب عصير إلى ٥ أكواب ماء.\nأما التناسب فيعني أن نسبتين متساويتان.\n\nاستراتيجية الحل:\n- اكتبي النسبة المعطاة بوضوح.\n- كوّني جدول نسب.\n- اضربي أو اقسمي الطرفين في العدد نفسه.\n- تأكدي أن الوحدات متطابقة.\n\nمثال:\nإذا كانت ٣ دفاتر تكلف ١.٥ دينار، فإن ٦ دفاتر تكلف ٣ دنانير.\nإذا تقاسم ٤ طلاب ٢٠ قلمًا، فلكل طالب ٥ أقلام.\n\nانتبهي إلى:\n- عكس ترتيب الكميتين.\n- خلط الوحدات المختلفة.\n- استخدام الضرب التقاطعي قبل تجربة معدل الوحدة الأبسط.',
    tags: ['word problems', 'ratios', 'proportions'],
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
    descriptionEn: 'Understand energy flow through simple food chains and ecosystems.',
    descriptionAr: 'فهم انتقال الطاقة عبر السلاسل الغذائية والنظم البيئية البسيطة.',
    bodyEn:
      'Producers are plants that make food using sunlight.\nConsumers depend on plants or other animals for food.\nDecomposers break down dead organisms and return nutrients to the soil.\n\nSimple food chain:\nSun → plant → rabbit → fox\n\nMain idea:\nEnergy starts with the sun, moves through living things, and decreases at each step.\nHealthy ecosystems depend on balance between living things and their environment.',
    bodyAr:
      'المنتجون هم النباتات التي تصنع غذاءها باستخدام ضوء الشمس.\nالمستهلكون يعتمدون على النباتات أو الحيوانات الأخرى في الغذاء.\nالمحللات تفكك الكائنات الميتة وتعيد العناصر الغذائية إلى التربة.\n\nسلسلة غذائية بسيطة:\nالشمس ← النبات ← الأرنب ← الثعلب\n\nالفكرة الرئيسة:\nتبدأ الطاقة من الشمس، ثم تنتقل بين الكائنات الحية، وتقل مع كل مرحلة. ويعتمد النظام البيئي الصحي على التوازن بين الكائنات وبيئتها.',
    tags: ['biology', 'ecosystems', 'food chain'],
    updatedAt: '2026-02',
  },
  {
    id: 'arabic-g5-grammar-summary',
    subjectId: 'arabic',
    gradeId: 'G5',
    unitId: 'grammar',
    unitTitleEn: 'Grammar basics',
    unitTitleAr: 'أساسيات النحو',
    type: 'summary',
    titleEn: 'Nominal and verbal sentences',
    titleAr: 'الجملة الاسمية والجملة الفعلية',
    descriptionEn: 'A classroom review to distinguish sentence types and identify the main parts.',
    descriptionAr: 'مراجعة صفية لتمييز نوع الجملة وتحديد عناصرها الأساسية.',
    bodyEn:
      'A nominal sentence starts with a noun and usually contains a subject and predicate.\nA verbal sentence starts with a verb and usually includes the verb, subject, and sometimes an object.\n\nExamples:\n- The sky is clear. (nominal)\n- The student wrote the lesson. (verbal)\n\nTo identify the sentence type, look at the first meaningful word.\nThen mark the main parts and read the sentence aloud to check understanding.',
    bodyAr:
      'الجملة الاسمية تبدأ باسم، وغالباً تتكون من مبتدأ وخبر.\nالجملة الفعلية تبدأ بفعل، وغالباً تتكون من فعل وفاعل، وقد يأتي معها مفعول به.\n\nأمثلة:\n- السماء صافية. (جملة اسمية)\n- كتب الطالب الدرس. (جملة فعلية)\n\nلتمييز نوع الجملة انظري إلى أول كلمة ذات معنى.\nثم حددي الأركان الأساسية واقرئي الجملة بصوت واضح للتأكد من الفهم.',
    tags: ['grammar', 'sentences', 'arabic'],
    updatedAt: '2026-03',
  },
  {
    id: 'math-g4-multiplication-pdf',
    subjectId: 'math',
    gradeId: 'G4',
    unitId: 'multiplication',
    unitTitleEn: 'Multiplication strategies',
    unitTitleAr: 'استراتيجيات الضرب',
    type: 'pdf',
    titleEn: 'Multiplication practice sheet',
    titleAr: 'ورقة تدريب على الضرب',
    descriptionEn: 'Practice using repeated addition, arrays, and place value decomposition.',
    descriptionAr: 'تدريب على الجمع المتكرر والمصفوفات وتحليل القيم المكانية في الضرب.',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['worksheet', 'practice', 'multiplication'],
    updatedAt: '2026-03',
  },
  {
    id: 'science-g6-electricity-summary',
    subjectId: 'science',
    gradeId: 'G6',
    unitId: 'electricity',
    unitTitleEn: 'Electric circuits',
    unitTitleAr: 'الدوائر الكهربائية',
    type: 'summary',
    titleEn: 'Simple circuits and conductors',
    titleAr: 'الدوائر البسيطة والمواد الموصلة',
    descriptionEn: 'Review current flow, open and closed circuits, and safe classroom observations.',
    descriptionAr: 'مراجعة لسريان التيار، والدوائر المفتوحة والمغلقة، وملاحظات صفية آمنة.',
    bodyEn:
      'An electric circuit needs an energy source, wires, and a device such as a bulb.\nA closed circuit allows current to flow. An open circuit breaks the path and stops the device.\nConductors such as metals allow electricity to pass. Insulators such as plastic and rubber do not.\n\nAlways connect simple classroom circuits carefully and never use wall electricity in student experiments.',
    bodyAr:
      'تحتاج الدائرة الكهربائية إلى مصدر طاقة وأسلاك وجهاز مثل المصباح.\nالدائرة المغلقة تسمح بمرور التيار، أما الدائرة المفتوحة فتقطع المسار وتوقف عمل الجهاز.\nالمواد الموصلة مثل المعادن تسمح بمرور الكهرباء، بينما المواد العازلة مثل البلاستيك والمطاط لا تسمح بذلك.\n\nيجب تركيب الدوائر الصفية البسيطة بحذر وعدم استخدام كهرباء الجدار في تجارب الطلاب.',
    tags: ['electricity', 'circuits', 'science'],
    updatedAt: '2026-03',
  },
  {
    id: 'social-g5-kuwait-video',
    subjectId: 'social',
    gradeId: 'G5',
    unitId: 'kuwait-history',
    unitTitleEn: 'Kuwait history',
    unitTitleAr: 'تاريخ الكويت',
    type: 'video',
    titleEn: 'Intro to Kuwait heritage',
    titleAr: 'مقدمة في تراث الكويت',
    descriptionEn: 'Short visual introduction to national identity, traditions, and heritage landmarks.',
    descriptionAr: 'مقدمة بصرية قصيرة عن الهوية الوطنية والعادات والمعالم التراثية في الكويت.',
    url: 'https://www.youtube.com/watch?v=5MgBikgcWnY',
    tags: ['heritage', 'kuwait', 'national'],
    updatedAt: '2026-03',
  },
  {
    id: 'arabic-g6-writing-link',
    subjectId: 'arabic',
    gradeId: 'G6',
    unitId: 'writing',
    unitTitleEn: 'Writing skills',
    unitTitleAr: 'مهارات الكتابة',
    type: 'link',
    titleEn: 'Writing prompts and practice hub',
    titleAr: 'منصة تدريب على التعبير والكتابة',
    descriptionEn: 'External writing practice resource for sentence building and short paragraph organization.',
    descriptionAr: 'مصدر خارجي لتدريب التعبير وبناء الجملة وتنظيم الفقرة القصيرة.',
    url: 'https://www.moe.edu.kw',
    tags: ['writing', 'paragraphs', 'language'],
    updatedAt: '2026-03',
  },
]
