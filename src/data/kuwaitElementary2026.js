/**
 * أسئلة كويزات مناهج الكويت - المرحلة الابتدائية 2026
 * Kuwait Elementary Curriculum Quiz Questions 2026
 */

export const KUWAIT_ELEMENTARY_2026_QUIZZES = [
  // لغة عربية - الصف الثالث
  {
    title: 'لغة عربية - الصف الثالث ابتدائي 2026',
    description: 'قراءة ونحو وإملاء وفق مناهج الكويت للمرحلة الابتدائية.',
    category: 'language',
    audience: 'students',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      { text: 'ما نوع الجملة: "السماء صافية"؟', options: ['استفهامية', 'خبرية', 'إنشائية', 'نهية'], correctIndex: 1, explanation: 'الجملة الخبرية تخبر عن شيء' },
      { text: 'ما جمع كلمة "مدرسة"؟', options: ['مدارس', 'مدرسون', 'مدرسات', 'مُدَرَّس'], correctIndex: 0 },
      { text: 'اختر الكلمة التي تحتوي على همزة متوسطة على الألف:', options: ['مسألة', 'رأس', 'قراءة', 'ملء'], correctIndex: 0 },
      { text: 'ما مرادف كلمة "الفرح"؟', options: ['الحزن', 'السعادة', 'الغضب', 'الخوف'], correctIndex: 1 },
      { text: 'ما إعراب "التلميذُ" في: التلميذُ مجتهدٌ؟', options: ['فاعل', 'مفعول به', 'مبتدأ', 'خبر'], correctIndex: 2 },
    ],
  },
  // رياضيات - الصف الرابع
  {
    title: 'رياضيات - الصف الرابع ابتدائي 2026',
    description: 'عمليات حسابية وكسور وهندسة للمرحلة الابتدائية.',
    category: 'science',
    audience: 'students',
    difficulty: 'medium',
    language: 'ar',
    questions: [
      { text: 'ما ناتج: ٣٤٧ + ٢٥٦؟', options: ['٥٠٣', '٦٠٣', '٥٩٣', '٦١٣'], correctIndex: 1 },
      { text: 'ما الكسر الذي يعادل نصف (١/٢)؟', options: ['٢/٣', '٣/٦', '٢/٤', '٤/٨'], correctIndex: 2, explanation: '٢/٤ = ١/٢' },
      { text: 'كم ضلعاً في المستطيل؟', options: ['٣', '٤', '٥', '٦'], correctIndex: 1 },
      { text: 'ما ناتج ٧ × ٨؟', options: ['٥٤', '٥٦', '٥٨', '٦٤'], correctIndex: 1 },
      { text: 'ما العدد الذي يقبل القسمة على ٢ و ٥؟', options: ['١٥', '٢٢', '٣٠', '٣٣'], correctIndex: 2, explanation: '٣٠ ينتهي بصفر فيقبل القسمة على ٢ و ٥' },
    ],
  },
  // علوم - الصف الخامس
  {
    title: 'علوم - الصف الخامس ابتدائي 2026',
    description: 'علوم الحياة والطبيعة وفق مناهج وزارة التربية الكويتية.',
    category: 'science',
    audience: 'students',
    difficulty: 'medium',
    language: 'ar',
    questions: [
      { text: 'أين يتم هضم الطعام بشكل أساسي؟', options: ['الفم', 'المعدة والأمعاء', 'الرئتان', 'القلب'], correctIndex: 1 },
      { text: 'ما مصدر الطاقة الرئيسي للنبات؟', options: ['الماء فقط', 'ضوء الشمس', 'التربة فقط', 'الهواء'], correctIndex: 1 },
      { text: 'ما الغاز الذي نستنشقه للتنفس؟', options: ['ثاني أكسيد الكربون', 'الأكسجين', 'النيتروجين', 'الهيدروجين'], correctIndex: 1 },
      { text: 'كيف تنتقل الحرارة في السوائل؟', options: ['التوصيل فقط', 'الحمل الحراري', 'الإشعاع فقط', 'لا تنتقل'], correctIndex: 1 },
      { text: 'ما اسم العملية التي يصنع فيها النبات غذاءه؟', options: ['الهضم', 'البناء الضوئي', 'التنفس', 'الإخراج'], correctIndex: 1 },
    ],
  },
  // تربية إسلامية - ابتدائي
  {
    title: 'تربية إسلامية - المرحلة الابتدائية 2026',
    description: 'أركان الإسلام والإيمان وآداب وسنن.',
    category: 'religion',
    audience: 'students',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      { text: 'كم عدد أركان الإسلام؟', options: ['أربعة', 'خمسة', 'ستة', 'سبعة'], correctIndex: 1 },
      { text: 'ما أول أركان الإسلام؟', options: ['الصلاة', 'شهادة أن لا إله إلا الله', 'الصوم', 'الزكاة'], correctIndex: 1 },
      { text: 'كم عدد الصلوات المفروضة في اليوم والليلة؟', options: ['ثلاث', 'أربع', 'خمس', 'ست'], correctIndex: 2 },
      { text: 'في أي شهر فرض الصيام؟', options: ['شعبان', 'رمضان', 'شوال', 'ذو الحجة'], correctIndex: 1 },
      { text: 'ما اسم أول سورة في المصحف؟', options: ['البقرة', 'الفاتحة', 'الإخلاص', 'الناس'], correctIndex: 1 },
    ],
  },
  // تربية وطنية / اجتماعيات - الكويت
  {
    title: 'تربية وطنية - الكويت والهوية 2026',
    description: 'تاريخ الكويت ومؤسساتها وهوية المواطن.',
    category: 'history',
    audience: 'students',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      { text: 'متى تحتفل الكويت بيوم الاستقلال؟', options: ['٢٥ يناير', '٢٦ فبراير', '١٩ يونيو', '٢ فبراير'], correctIndex: 2, explanation: '١٩ يونيو ١٩٦١' },
      { text: 'كم عدد محافظات الكويت؟', options: ['٥', '٦', '٧', '٨'], correctIndex: 1 },
      { text: 'ما اسم أمير الكويت الحالي (وفق المنهج)؟', options: ['الشيخ صباح', 'الشيخ نواف', 'الشيخ مشعل', 'الشيخ جابر'], correctIndex: 2 },
      { text: 'ما العاصمة الرسمية لدولة الكويت؟', options: ['مدينة الكويت', 'الجهراء', 'الأحمدي', 'حولي'], correctIndex: 0 },
      { text: 'ما لون علم الكويت؟', options: ['أحمر وأبيض وأسود', 'أخضر وأبيض وأحمر', 'أخضر وأبيض وأسود', 'أحمر وأخضر وأبيض وأسود'], correctIndex: 3 },
    ],
  },
  // لغة إنجليزية - الصف الرابع/الخامس
  {
    title: 'English - Grade 4-5 Kuwait 2026',
    description: 'Vocabulary, grammar and reading for elementary level.',
    category: 'language',
    audience: 'students',
    difficulty: 'easy',
    language: 'en',
    questions: [
      { text: 'What is the opposite of "hot"?', options: ['warm', 'cold', 'cool', 'sunny'], correctIndex: 1 },
      { text: 'Choose the correct form: She _____ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1 },
      { text: 'How many days are in a week?', options: ['five', 'six', 'seven', 'eight'], correctIndex: 2 },
      { text: 'What do we call the place where we buy books?', options: ['hospital', 'library', 'bookshop', 'school'], correctIndex: 2 },
      { text: 'Which word is a noun?', options: ['run', 'beautiful', 'Kuwait', 'quickly'], correctIndex: 2 },
    ],
  },
  // رياضيات - الصف الثالث (أسهل)
  {
    title: 'رياضيات - الصف الثالث ابتدائي 2026',
    description: 'جمع وطرح وضرب للأعداد الصحيحة.',
    category: 'science',
    audience: 'students',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      { text: 'ما ناتج ٩ + ٧؟', options: ['١٥', '١٦', '١٧', '١٨'], correctIndex: 1 },
      { text: 'ما ناتج ١٥ − ٨؟', options: ['٦', '٧', '٨', '٩'], correctIndex: 1 },
      { text: 'ما ناتج ٦ × ٤؟', options: ['٢٠', '٢٢', '٢٤', '٢٦'], correctIndex: 2 },
      { text: 'ما العدد الذي يقع بين ٤٩ و ٥١؟', options: ['٤٨', '٥٠', '٥٢', '٥٣'], correctIndex: 1 },
      { text: 'كم تساوي ٣ عشرات + ٥ آحاد؟', options: ['٨', '٣٥', '٥٣', '٣٠٥'], correctIndex: 1 },
    ],
  },
  // علوم - الصف الثالث والرابع
  {
    title: 'علوم - الصف الثالث والرابع 2026',
    description: 'كائنات حية وطبيعة وبسيطة.',
    category: 'science',
    audience: 'students',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      { text: 'ما تحتاجه النبتة لتعيش؟', options: ['ضوء وماء وهواء', 'الثلج فقط', 'النار', 'لا شيء'], correctIndex: 0 },
      { text: 'كم عدد فصول السنة؟', options: ['اثنان', 'ثلاثة', 'أربعة', 'خمسة'], correctIndex: 2 },
      { text: 'أين يعيش السمك؟', options: ['على الأرض', 'في الماء', 'في الهواء', 'تحت التراب'], correctIndex: 1 },
      { text: 'ما شكل القمر عندما يظهر كدائرة كاملة؟', options: ['هلال', 'بدر', 'ربع', 'محاق'], correctIndex: 1 },
      { text: 'ما مصدر الضوء في النهار؟', options: ['القمر', 'النجوم', 'الشمس', 'المصباح'], correctIndex: 2 },
    ],
  },
]
