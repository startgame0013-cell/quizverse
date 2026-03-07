// Mock generated questions for AI Quiz Generator (sample data by topic/difficulty)
const MOCK_QUESTIONS_BY_TOPIC = {
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

export function getMockQuestions(topic, difficulty, count = 5) {
  const normalizedTopic = (topic || '').toLowerCase().trim() || 'default'
  const key = Object.keys(MOCK_QUESTIONS_BY_TOPIC).find((k) => normalizedTopic.includes(k)) || 'default'
  let questions = [...(MOCK_QUESTIONS_BY_TOPIC[key] || MOCK_QUESTIONS_BY_TOPIC.default)]
  // Difficulty could shuffle or filter in future; for now we just slice
  if (difficulty === 'hard') questions = questions.reverse()
  return questions.slice(0, Math.min(count, 10))
}
