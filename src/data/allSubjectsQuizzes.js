/**
 * QuizVerse — All Subjects Quiz Bank
 * Geography, History, Science, Math, Arabic, English, Religion, Art, etc.
 * Bilingual (Arabic + English), Easy / Medium / Hard
 */

const q = (text, textAr, options, optionsAr, correctIndex, timeLimit = 15, explanation) =>
  ({ text, textAr, options, optionsAr, correctIndex, timeLimit, explanation })

export const ALL_SUBJECTS_QUIZZES = [
  // ═══════════════════════════════════════════════════════════════
  // GEOGRAPHY — Easy
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'World Geography Basics',
    titleAr: 'أساسيات الجغرافيا العالمية',
    description: 'Easy geography for beginners. / جغرافيا سهلة للمبتدئين.',
    descriptionAr: 'جغرافيا سهلة للمبتدئين.',
    category: 'geography',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('What is the capital of France?', 'ما عاصمة فرنسا؟', ['London', 'Paris', 'Berlin', 'Madrid'], ['لندن', 'باريس', 'برلين', 'مدريد'], 1, 10),
      q('Which is the largest ocean?', 'ما أكبر محيط؟', ['Atlantic', 'Indian', 'Pacific', 'Arctic'], ['الأطلسي', 'الهندي', 'الهادئ', 'المتجمد'], 2, 10),
      q('How many continents are there?', 'كم عدد القارات؟', ['5', '6', '7', '8'], ['٥', '٦', '٧', '٨'], 2, 10),
      q('What is the capital of Egypt?', 'ما عاصمة مصر؟', ['Alexandria', 'Cairo', 'Luxor', 'Aswan'], ['الإسكندرية', 'القاهرة', 'الأقصر', 'أسوان'], 1, 10),
      q('Which desert is the largest?', 'ما أكبر صحراء؟', ['Sahara', 'Arabian', 'Gobi', 'Antarctic'], ['الصحراء الكبرى', 'العربية', 'غوبي', 'القارة القطبية'], 0, 12),
    ],
  },
  // GEOGRAPHY — Medium
  {
    title: 'Geography Challenge',
    titleAr: 'تحدي الجغرافيا',
    description: 'Medium difficulty world geography. / جغرافيا متوسطة.',
    descriptionAr: 'جغرافيا متوسطة الصعوبة.',
    category: 'geography',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'en',
    questions: [
      q('What is the longest river in the world?', 'ما أطول نهر في العالم؟', ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], ['الأمازون', 'النيل', 'يانغتسي', 'المسيسيبي'], 1, 15),
      q('Which country has the most population?', 'أي دولة لديها أكبر عدد سكان؟', ['India', 'China', 'USA', 'Indonesia'], ['الهند', 'الصين', 'أمريكا', 'إندونيسيا'], 0, 15),
      q('What is the capital of Japan?', 'ما عاصمة اليابان؟', ['Osaka', 'Tokyo', 'Kyoto', 'Nagoya'], ['أوساكا', 'طوكيو', 'كيوتو', 'ناغويا'], 1, 12),
      q('Which sea is the saltiest?', 'أي بحر هو الأكثر ملوحة؟', ['Mediterranean', 'Dead Sea', 'Red Sea', 'Black Sea'], ['المتوسط', 'البحر الميت', 'الأحمر', 'الأسود'], 1, 15),
      q('What mountain is the tallest?', 'ما أعلى جبل؟', ['K2', 'Everest', 'Kilimanjaro', 'Denali'], ['كيه 2', 'إفرست', 'كليمنجارو', 'دينالي'], 1, 12),
    ],
  },
  // GEOGRAPHY — Hard
  {
    title: 'Geography Expert',
    titleAr: 'خبير الجغرافيا',
    description: 'Hard geography questions. / أسئلة جغرافيا صعبة.',
    descriptionAr: 'أسئلة جغرافيا للمتقدمين.',
    category: 'geography',
    audience: 'students',
    stage: 'secondary',
    difficulty: 'hard',
    language: 'en',
    questions: [
      q('What is the smallest country by area?', 'ما أصغر دولة مساحة؟', ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], ['موناكو', 'الفاتيكان', 'سان مارينو', 'ليختنشتاين'], 1, 20),
      q('Which country has the most time zones?', 'أي دولة لديها أكبر عدد من المناطق الزمنية؟', ['USA', 'Russia', 'France', 'UK'], ['أمريكا', 'روسيا', 'فرنسا', 'بريطانيا'], 2, 20),
      q('What is the capital of Bhutan?', 'ما عاصمة بوتان؟', ['Kathmandu', 'Thimphu', 'Dhaka', 'Colombo'], ['كاتماندو', 'تيمفو', 'دكا', 'كولومبو'], 1, 20),
      q('Which African country was never colonized?', 'أي دولة أفريقية لم تُستعمر؟', ['Ethiopia', 'Liberia', 'Both', 'None'], ['إثيوبيا', 'ليبيريا', 'كلاهما', 'لا شيء'], 2, 25),
      q('What is the deepest point in the ocean?', 'ما أعمق نقطة في المحيط؟', ['Mariana Trench', 'Tonga Trench', 'Philippine Trench', 'Java Trench'], ['خندق ماريانا', 'تونغا', 'الفلبين', 'جافا'], 0, 20),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // HISTORY — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'World History Basics',
    titleAr: 'أساسيات التاريخ العالمي',
    description: 'Easy history questions. / أسئلة تاريخ سهلة.',
    descriptionAr: 'أسئلة تاريخ للمبتدئين.',
    category: 'history',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('When did World War II end?', 'متى انتهت الحرب العالمية الثانية؟', ['1943', '1944', '1945', '1946'], ['١٩٤٣', '١٩٤٤', '١٩٤٥', '١٩٤٦'], 2, 12),
      q('Who was the first man on the moon?', 'من كان أول إنسان على القمر؟', ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'John Glenn'], ['غاغارين', 'أرمسترونغ', 'ألدرين', 'غلين'], 1, 12),
      q('In which year did Kuwait gain independence?', 'في أي عام استقلت الكويت؟', ['1959', '1960', '1961', '1962'], ['١٩٥٩', '١٩٦٠', '١٩٦١', '١٩٦٢'], 2, 10),
      q('Who built the Great Wall of China?', 'من بنى سور الصين العظيم؟', ['Ming Dynasty', 'Qin Dynasty', 'Han Dynasty', 'Tang Dynasty'], ['مينغ', 'تشين', 'هان', 'تانغ'], 1, 15),
      q('What year did the Berlin Wall fall?', 'في أي عام سقط جدار برلين؟', ['1987', '1988', '1989', '1990'], ['١٩٨٧', '١٩٨٨', '١٩٨٩', '١٩٩٠'], 2, 15),
    ],
  },
  {
    title: 'History Challenge',
    titleAr: 'تحدي التاريخ',
    description: 'Medium history. / تاريخ متوسط.',
    descriptionAr: 'أسئلة تاريخ متوسطة.',
    category: 'history',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'en',
    questions: [
      q('Who was the first President of the USA?', 'من كان أول رئيس لأمريكا؟', ['John Adams', 'George Washington', 'Thomas Jefferson', 'Benjamin Franklin'], ['آدامز', 'واشنطن', 'جيفرسون', 'فرانكلين'], 1, 15),
      q('When did the Ottoman Empire fall?', 'متى سقطت الدولة العثمانية؟', ['1918', '1922', '1924', '1926'], ['١٩١٨', '١٩٢٢', '١٩٢٤', '١٩٢٦'], 1, 20),
      q('Who discovered America?', 'من اكتشف أمريكا؟', ['Magellan', 'Columbus', 'Vasco da Gama', 'Marco Polo'], ['ماجلان', 'كولومبوس', 'فاسكو دا غاما', 'ماركو بولو'], 1, 12),
      q('What was the capital of the Byzantine Empire?', 'ما عاصمة الإمبراطورية البيزنطية؟', ['Rome', 'Athens', 'Constantinople', 'Alexandria'], ['روما', 'أثينا', 'القسطنطينية', 'الإسكندرية'], 2, 20),
      q('In which century did the Renaissance begin?', 'في أي قرن بدأت النهضة؟', ['13th', '14th', '15th', '16th'], ['القرن ١٣', 'القرن ١٤', 'القرن ١٥', 'القرن ١٦'], 1, 20),
    ],
  },
  {
    title: 'History Expert',
    titleAr: 'خبير التاريخ',
    description: 'Hard history questions. / أسئلة تاريخ صعبة.',
    descriptionAr: 'أسئلة تاريخ للمتقدمين.',
    category: 'history',
    audience: 'students',
    stage: 'secondary',
    difficulty: 'hard',
    language: 'en',
    questions: [
      q('Who was the last Mughal emperor?', 'من كان آخر إمبراطور مغولي؟', ['Shah Jahan', 'Aurangzeb', 'Bahadur Shah II', 'Akbar'], ['شاه جهان', 'أورنجزيب', 'بهادر شاه الثاني', 'أكبر'], 2, 25),
      q('When did the French Revolution start?', 'متى بدأت الثورة الفرنسية؟', ['1787', '1789', '1791', '1793'], ['١٧٨٧', '١٧٨٩', '١٧٩١', '١٧٩٣'], 1, 20),
      q('Who unified Germany in 1871?', 'من وحد ألمانيا عام ١٨٧١؟', ['Bismarck', 'Wilhelm I', 'Frederick', 'Napoleon'], ['بسمارك', 'فيلهلم', 'فريدريك', 'نابليون'], 0, 25),
      q('What ancient civilization built Machu Picchu?', 'أي حضارة قديمة بنت ماتشو بيتشو؟', ['Aztec', 'Maya', 'Inca', 'Olmec'], ['أزتيك', 'مايا', 'إنكا', 'أولمك'], 2, 25),
      q('When did the Roman Empire split?', 'متى انقسمت الإمبراطورية الرومانية؟', ['284 AD', '395 AD', '476 AD', '565 AD'], ['٢٨٤ م', '٣٩٥ م', '٤٧٦ م', '٥٦٥ م'], 1, 25),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // SCIENCE — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Science Basics',
    titleAr: 'أساسيات العلوم',
    description: 'Easy science. / علوم سهلة.',
    descriptionAr: 'علوم للمبتدئين.',
    category: 'science',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('What planet is closest to the Sun?', 'ما أقرب كوكب للشمس؟', ['Venus', 'Mercury', 'Earth', 'Mars'], ['الزهرة', 'عطارد', 'الأرض', 'المريخ'], 1, 10),
      q('What is the chemical symbol for water?', 'ما الرمز الكيميائي للماء؟', ['H2O', 'CO2', 'NaCl', 'O2'], ['H2O', 'CO2', 'NaCl', 'O2'], 0, 10),
      q('How many bones are in the adult human body?', 'كم عدد العظام في جسم الإنسان البالغ؟', ['186', '206', '226', '246'], ['١٨٦', '٢٠٦', '٢٢٦', '٢٤٦'], 1, 12),
      q('What gas do plants absorb?', 'ما الغاز الذي تمتصه النباتات؟', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], ['الأكسجين', 'ثاني أكسيد الكربون', 'النيتروجين', 'الهيدروجين'], 1, 10),
      q('What is the largest organ in the human body?', 'ما أكبر عضو في جسم الإنسان؟', ['Heart', 'Liver', 'Skin', 'Brain'], ['القلب', 'الكبد', 'الجلد', 'الدماغ'], 2, 12),
    ],
  },
  {
    title: 'Science Challenge',
    titleAr: 'تحدي العلوم',
    description: 'Medium science. / علوم متوسطة.',
    descriptionAr: 'علوم متوسطة الصعوبة.',
    category: 'science',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'en',
    questions: [
      q('What is the speed of light (approx)?', 'ما سرعة الضوء تقريباً؟', ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1 million km/s'], ['٣٠٠ ألف كم/ث', '١٥٠ ألف', '٥٠٠ ألف', 'مليون'], 0, 20),
      q('What is DNA short for?', 'ما اختصار DNA؟', ['Deoxyribonucleic Acid', 'Ribonucleic Acid', 'Protein Acid', 'Nucleic Acid'], ['حمض الديوكسي ريبونوكلييك', 'الريبونوكلييك', 'بروتين', 'نووي'], 0, 15),
      q('What element has the symbol Au?', 'ما العنصر الذي رمزه Au؟', ['Silver', 'Gold', 'Aluminum', 'Argon'], ['فضة', 'ذهب', 'ألومنيوم', 'أرجون'], 1, 15),
      q('What is the powerhouse of the cell?', 'ما مصنع الطاقة في الخلية؟', ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], ['النواة', 'الميتوكوندريا', 'الريبوسوم', 'جولجي'], 1, 12),
      q('What is the boiling point of water (Celsius)?', 'ما نقطة غليان الماء (مئوية)؟', ['90°C', '100°C', '110°C', '120°C'], ['٩٠', '١٠٠', '١١٠', '١٢٠'], 1, 12),
    ],
  },
  {
    title: 'Science Expert',
    titleAr: 'خبير العلوم',
    description: 'Hard science. / علوم صعبة.',
    descriptionAr: 'علوم للمتقدمين.',
    category: 'science',
    audience: 'students',
    stage: 'secondary',
    difficulty: 'hard',
    language: 'en',
    questions: [
      q('What is the atomic number of carbon?', 'ما العدد الذري للكربون؟', ['4', '6', '8', '12'], ['٤', '٦', '٨', '١٢'], 1, 20),
      q('Who proposed the theory of relativity?', 'من طرح نظرية النسبية؟', ['Newton', 'Einstein', 'Hawking', 'Bohr'], ['نيوتن', 'أينشتاين', 'هوكينغ', 'بور'], 1, 15),
      q('What is the chemical formula for table salt?', 'ما الصيغة الكيميائية لملح الطعام؟', ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], 0, 15),
      q('How many chromosomes do humans have?', 'كم عدد الكروموسومات عند الإنسان؟', ['42', '44', '46', '48'], ['٤٢', '٤٤', '٤٦', '٤٨'], 2, 20),
      q('What is the most abundant element in the universe?', 'ما أكثر عنصر وفرة في الكون؟', ['Helium', 'Hydrogen', 'Carbon', 'Oxygen'], ['هيليوم', 'هيدروجين', 'كربون', 'أكسجين'], 1, 20),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // MATH — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Math Basics',
    titleAr: 'أساسيات الرياضيات',
    description: 'Easy math. / رياضيات سهلة.',
    descriptionAr: 'رياضيات للمبتدئين.',
    category: 'math',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('What is 7 × 8?', 'ما ناتج ٧ × ٨؟', ['54', '56', '58', '64'], ['٥٤', '٥٦', '٥٨', '٦٤'], 1, 10),
      q('What is 100 ÷ 4?', 'ما ناتج ١٠٠ ÷ ٤؟', ['20', '25', '30', '40'], ['٢٠', '٢٥', '٣٠', '٤٠'], 1, 10),
      q('What is 15 + 27?', 'ما ناتج ١٥ + ٢٧؟', ['40', '42', '44', '52'], ['٤٠', '٤٢', '٤٤', '٥٢'], 1, 8),
      q('How many sides does a hexagon have?', 'كم ضلعاً في السداسي؟', ['5', '6', '7', '8'], ['٥', '٦', '٧', '٨'], 1, 10),
      q('What is 50% of 200?', 'ما ٥٠٪ من ٢٠٠؟', ['80', '100', '120', '150'], ['٨٠', '١٠٠', '١٢٠', '١٥٠'], 1, 12),
    ],
  },
  {
    title: 'Math Challenge',
    titleAr: 'تحدي الرياضيات',
    description: 'Medium math. / رياضيات متوسطة.',
    descriptionAr: 'رياضيات متوسطة.',
    category: 'math',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'en',
    questions: [
      q('What is the square root of 144?', 'ما الجذر التربيعي لـ ١٤٤؟', ['10', '11', '12', '14'], ['١٠', '١١', '١٢', '١٤'], 2, 15),
      q('What is 2³ (2 cubed)?', 'ما ناتج ٢³؟', ['4', '6', '8', '16'], ['٤', '٦', '٨', '١٦'], 2, 12),
      q('Solve: 3x + 5 = 20. What is x?', 'حل: ٣س + ٥ = ٢٠. ما قيمة س؟', ['3', '4', '5', '6'], ['٣', '٤', '٥', '٦'], 2, 20),
      q('What is the area of a rectangle 5×8?', 'ما مساحة مستطيل ٥×٨؟', ['35', '40', '45', '50'], ['٣٥', '٤٠', '٤٥', '٥٠'], 1, 15),
      q('What is 1/4 + 1/4?', 'ما ناتج ١/٤ + ١/٤؟', ['1/8', '1/4', '1/2', '2/4'], ['١/٨', '١/٤', '١/٢', '٢/٤'], 2, 15),
    ],
  },
  {
    title: 'Math Expert',
    titleAr: 'خبير الرياضيات',
    description: 'Hard math. / رياضيات صعبة.',
    descriptionAr: 'رياضيات للمتقدمين.',
    category: 'math',
    audience: 'students',
    stage: 'secondary',
    difficulty: 'hard',
    language: 'en',
    questions: [
      q('What is 12! / 10!?', 'ما ناتج ١٢! ÷ ١٠!؟', ['11', '12', '132', '144'], ['١١', '١٢', '١٣٢', '١٤٤'], 2, 25),
      q('What is log₁₀(1000)?', 'ما قيمة لوغاريتم ١٠٠٠ للأساس ١٠؟', ['2', '3', '4', '10'], ['٢', '٣', '٤', '١٠'], 1, 25),
      q('In a right triangle, if a=3 and b=4, what is c?', 'في مثلث قائم، إذا أ=٣ و ب=٤، ما ج؟', ['5', '6', '7', '12'], ['٥', '٦', '٧', '١٢'], 0, 20),
      q('What is the sum of angles in a triangle?', 'ما مجموع زوايا المثلث؟', ['90°', '180°', '270°', '360°'], ['٩٠', '١٨٠', '٢٧٠', '٣٦٠'], 1, 12),
      q('What is π (pi) approximately?', 'ما قيمة π تقريباً؟', ['3.12', '3.14', '3.16', '3.18'], ['٣.١٢', '٣.١٤', '٣.١٦', '٣.١٨'], 1, 15),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // ARABIC LANGUAGE — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Arabic Language Basics',
    titleAr: 'أساسيات اللغة العربية',
    description: 'Easy Arabic. / عربي سهل.',
    descriptionAr: 'لغة عربية للمبتدئين.',
    category: 'language',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      q('What is the plural of "كتاب"?', 'ما جمع "كتاب"؟', ['كتب', 'كتابات', 'كتيبة', 'مكتبة'], ['كتب', 'كتابات', 'كتيبة', 'مكتبة'], 0, 12),
      q('What does "سريع" mean?', 'ما معنى "سريع"؟', ['Slow', 'Fast', 'Big', 'Small'], ['بطيء', 'سريع', 'كبير', 'صغير'], 1, 10),
      q('How many letters in the Arabic alphabet?', 'كم حرفاً في الأبجدية العربية؟', ['26', '28', '30', '32'], ['٢٦', '٢٨', '٣٠', '٣٢'], 1, 12),
      q('What is the opposite of "كبير"?', 'ما عكس "كبير"؟', ['طويل', 'صغير', 'قصير', 'ضخم'], ['طويل', 'صغير', 'قصير', 'ضخم'], 1, 10),
      q('What type of sentence is "السماء صافية"?', 'ما نوع الجملة "السماء صافية"؟', ['استفهامية', 'خبرية', 'إنشائية', 'نهية'], ['استفهامية', 'خبرية', 'إنشائية', 'نهية'], 1, 15),
    ],
  },
  {
    title: 'Arabic Language Challenge',
    titleAr: 'تحدي اللغة العربية',
    description: 'Medium Arabic. / عربي متوسط.',
    descriptionAr: 'لغة عربية متوسطة.',
    category: 'language',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'ar',
    questions: [
      q('What is "المبتدأ" in "التلميذُ مجتهدٌ"?', 'ما إعراب "التلميذ" في "التلميذ مجتهد"؟', ['فاعل', 'مفعول به', 'مبتدأ', 'خبر'], ['فاعل', 'مفعول به', 'مبتدأ', 'خبر'], 2, 20),
      q('Which word has hamza on alif?', 'أي كلمة فيها همزة على الألف؟', ['مسألة', 'رأس', 'قراءة', 'ملء'], ['مسألة', 'رأس', 'قراءة', 'ملء'], 0, 20),
      q('What is the synonym of "الفرح"?', 'ما مرادف "الفرح"؟', ['الحزن', 'السعادة', 'الغضب', 'الخوف'], ['الحزن', 'السعادة', 'الغضب', 'الخوف'], 1, 15),
      q('What is "جمع المذكر السالم"?', 'ما جمع المذكر السالم؟', ['مدرسون', 'مدارس', 'معلمون', 'طلاب'], ['مدرسون', 'مدارس', 'معلمون', 'طلاب'], 0, 25),
      q('How many types of "ال" (al)?', 'كم نوعاً لـ "ال" التعريف؟', ['1', '2', '3', '4'], ['١', '٢', '٣', '٤'], 1, 25),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // ENGLISH LANGUAGE — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'English Basics',
    titleAr: 'أساسيات الإنجليزية',
    description: 'Easy English. / إنجليزي سهل.',
    descriptionAr: 'لغة إنجليزية للمبتدئين.',
    category: 'language',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('What is the past tense of "go"?', 'ما الماضي من "go"؟', ['goed', 'went', 'gone', 'going'], ['goed', 'went', 'gone', 'going'], 1, 12),
      q('Which is a noun?', 'أي كلمة اسم؟', ['run', 'beautiful', 'school', 'quickly'], ['run', 'beautiful', 'school', 'quickly'], 2, 12),
      q('What is the plural of "child"?', 'ما جمع "child"؟', ['childs', 'children', 'childes', 'childern'], ['childs', 'children', 'childes', 'childern'], 1, 12),
      q('Choose the correct: "She ___ to school."', 'اختر الصحيح: "She ___ to school."', ['go', 'goes', 'going', 'gone'], ['go', 'goes', 'going', 'gone'], 1, 15),
      q('What is the opposite of "hot"?', 'ما عكس "hot"؟', ['warm', 'cold', 'cool', 'freeze'], ['دافئ', 'بارد', 'بارد', 'تجمد'], 1, 10),
    ],
  },
  {
    title: 'English Challenge',
    titleAr: 'تحدي الإنجليزية',
    description: 'Medium English. / إنجليزي متوسط.',
    descriptionAr: 'لغة إنجليزية متوسطة.',
    category: 'language',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'en',
    questions: [
      q('What figure of speech is "The stars danced"?', 'ما نوع التشبيه في "The stars danced"؟', ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], ['تشبيه', 'استعارة', 'تشخيص', 'مبالغة'], 2, 25),
      q('What is the past participle of "write"?', 'ما التصريف الثالث لـ "write"؟', ['writed', 'wrote', 'written', 'writing'], ['writed', 'wrote', 'written', 'writing'], 2, 15),
      q('Which sentence is correct?', 'أي جملة صحيحة؟', ['Me and him went', 'He and I went', 'Him and me went', 'I and he went'], ['Me and him went', 'He and I went', 'Him and me went', 'I and he went'], 1, 20),
      q('What does "benevolent" mean?', 'ما معنى "benevolent"؟', ['Evil', 'Kind', 'Strict', 'Lazy'], ['شرير', 'طيب', 'صارم', 'كسول'], 1, 20),
      q('What is a synonym for "happy"?', 'ما مرادف "happy"؟', ['Sad', 'Joyful', 'Angry', 'Tired'], ['حزين', 'فرحان', 'غاضب', 'متعب'], 1, 12),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // RELIGION (Islamic) — Easy, Medium, Hard
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'Islamic Studies Basics',
    titleAr: 'أساسيات التربية الإسلامية',
    description: 'Easy Islamic studies. / تربية إسلامية سهلة.',
    descriptionAr: 'تربية إسلامية للمبتدئين.',
    category: 'religion',
    audience: 'students',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'ar',
    questions: [
      q('How many pillars of Islam?', 'كم عدد أركان الإسلام؟', ['4', '5', '6', '7'], ['٤', '٥', '٦', '٧'], 1, 10),
      q('What is the first surah in the Quran?', 'ما أول سورة في القرآن؟', ['Al-Baqarah', 'Al-Fatiha', 'Al-Ikhlas', 'An-Nas'], ['البقرة', 'الفاتحة', 'الإخلاص', 'الناس'], 1, 10),
      q('In which month do Muslims fast?', 'في أي شهر يصوم المسلمون؟', ['Shaban', 'Ramadan', 'Shawwal', 'Dhu al-Hijja'], ['شعبان', 'رمضان', 'شوال', 'ذو الحجة'], 1, 10),
      q('How many daily prayers?', 'كم عدد الصلوات المفروضة؟', ['3', '4', '5', '6'], ['٣', '٤', '٥', '٦'], 2, 10),
      q('What is the first pillar of Islam?', 'ما أول أركان الإسلام؟', ['Prayer', 'Shahada', 'Fasting', 'Zakat'], ['الصلاة', 'الشهادة', 'الصوم', 'الزكاة'], 1, 12),
    ],
  },
  {
    title: 'Islamic Studies Challenge',
    titleAr: 'تحدي التربية الإسلامية',
    description: 'Medium Islamic studies. / تربية إسلامية متوسطة.',
    descriptionAr: 'تربية إسلامية متوسطة.',
    category: 'religion',
    audience: 'students',
    stage: 'intermediate',
    difficulty: 'medium',
    language: 'ar',
    questions: [
      q('How many surahs in the Quran?', 'كم عدد سور القرآن؟', ['112', '113', '114', '115'], ['١١٢', '١١٣', '١١٤', '١١٥'], 2, 15),
      q('What is the first mosque in Islam?', 'ما أول مسجد في الإسلام؟', ['Al-Masjid An-Nabawi', 'Masjid Quba', 'Al-Masjid Al-Haram', 'Masjid Al-Aqsa'], ['المسجد النبوي', 'مسجد قباء', 'المسجد الحرام', 'المسجد الأقصى'], 1, 20),
      q('Who was the first Caliph?', 'من كان أول خليفة؟', ['Umar', 'Abu Bakr', 'Uthman', 'Ali'], ['عمر', 'أبو بكر', 'عثمان', 'علي'], 1, 15),
      q('How many verses in Al-Fatiha?', 'كم آية في سورة الفاتحة؟', ['5', '6', '7', '8'], ['٥', '٦', '٧', '٨'], 2, 15),
      q('What is the night of power called?', 'ما اسم ليلة القدر؟', ['Laylat al-Qadr', 'Laylat al-Baraa', 'Laylat al-Miraj', 'Laylat al-Isra'], ['ليلة القدر', 'ليلة البراءة', 'ليلة المعراج', 'ليلة الإسراء'], 0, 20),
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // GENERAL / MIXED — All difficulties
  // ═══════════════════════════════════════════════════════════════
  {
    title: 'General Knowledge Mix',
    titleAr: 'معرفة عامة متنوعة',
    description: 'Mixed easy questions. / أسئلة عامة سهلة.',
    descriptionAr: 'معرفة عامة للمبتدئين.',
    category: 'general',
    audience: 'families',
    stage: 'elementary',
    difficulty: 'easy',
    language: 'en',
    questions: [
      q('What do bees make?', 'ماذا يصنع النحل؟', ['Milk', 'Honey', 'Butter', 'Cheese'], ['حليب', 'عسل', 'زبدة', 'جبن'], 1, 10),
      q('How many legs does a spider have?', 'كم رجلاً للعنكبوت؟', ['6', '8', '10', '12'], ['٦', '٨', '١٠', '١٢'], 1, 10),
      q('What color is the sky?', 'ما لون السماء؟', ['Green', 'Blue', 'Red', 'Yellow'], ['أخضر', 'أزرق', 'أحمر', 'أصفر'], 1, 8),
      q('How many days in a leap year?', 'كم يوماً في السنة الكبيسة؟', ['364', '365', '366', '367'], ['٣٦٤', '٣٦٥', '٣٦٦', '٣٦٧'], 2, 12),
      q('What is the largest animal?', 'ما أكبر حيوان؟', ['Elephant', 'Blue whale', 'Giraffe', 'Polar bear'], ['فيل', 'الحوت الأزرق', 'زرافة', 'الدب القطبي'], 1, 10),
    ],
  },
]
