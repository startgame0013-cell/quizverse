/**
 * Demo content for QuizVerse MVP
 * Leaderboard, game sessions, mini games
 */

export const DEMO_LEADERBOARD = {
  global: [
    { rank: 1, name: 'QuizMaster99', score: 2450, quiz: 'World Capitals' },
    { rank: 2, name: 'BrainBox', score: 2380, quiz: 'World Capitals' },
    { rank: 3, name: 'TriviaKing', score: 2300, quiz: 'World Capitals' },
    { rank: 4, name: 'SmartCookie', score: 2150, quiz: 'Science Basics' },
    { rank: 5, name: 'ThinkTank', score: 2100, quiz: 'GCC Capitals' },
    { rank: 6, name: 'KnowledgeSeeker', score: 1980, quiz: 'Islamic Trivia' },
    { rank: 7, name: 'StarStudent', score: 1850, quiz: 'Arabic Vocabulary' },
    { rank: 8, name: 'FamilyQuizzer', score: 1720, quiz: 'Family Fun Night' },
  ],
  school: [
    { rank: 1, name: 'Class5A_Top', score: 3200, quiz: 'Kuwait History' },
    { rank: 2, name: 'ScienceStar', score: 2980, quiz: 'Science Basics' },
    { rank: 3, name: 'ArabicPro', score: 2750, quiz: 'Arabic Vocabulary' },
  ],
  family: [
    { rank: 1, name: 'DadQuiz', score: 2100, quiz: 'Family Fun Night' },
    { rank: 2, name: 'MomTrivia', score: 1950, quiz: 'Ramadan Quiz' },
    { rank: 3, name: 'KidsRule', score: 1800, quiz: 'Kids General Knowledge' },
  ],
  week: [
    { rank: 1, name: 'WeeklyChamp', score: 890, quiz: 'GCC Capitals' },
    { rank: 2, name: 'RisingStar', score: 750, quiz: 'Islamic Trivia' },
    { rank: 3, name: 'NewPlayer', score: 620, quiz: 'Science Basics' },
  ],
}

export const DEMO_GAME_SESSION = {
  pin: '123456',
  hostName: 'Teacher Ahmed',
  quizTitle: 'Kuwait History Grade 5',
  playersJoined: 4,
  status: 'waiting',
}

export const MINI_GAMES = [
  { id: 'memory', nameKey: 'miniGames.memoryMatch', descKey: 'miniGames.memoryMatchDesc', status: 'playable', icon: 'brain' },
  { id: 'word', nameKey: 'miniGames.wordScramble', descKey: 'miniGames.wordScrambleDesc', status: 'coming', icon: 'type' },
  { id: 'math', nameKey: 'miniGames.quickMath', descKey: 'miniGames.quickMathDesc', status: 'coming', icon: 'calculator' },
  { id: 'flag', nameKey: 'miniGames.flagChallenge', descKey: 'miniGames.flagChallengeDesc', status: 'coming', icon: 'flag' },
]
