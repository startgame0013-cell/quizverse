import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateQuiz from './pages/CreateQuiz'
import MyQuizzes from './pages/MyQuizzes'
import QuizDetails from './pages/QuizDetails'
import PlayQuiz from './pages/PlayQuiz'
import JoinGame from './pages/JoinGame'
import WaitingRoom from './pages/WaitingRoom'
import Leaderboard from './pages/Leaderboard'
import MiniGames from './pages/MiniGames'
import MemoryMatch from './pages/MemoryMatch'
import WordScramble from './pages/WordScramble'
import QuickMath from './pages/QuickMath'
import TrueOrFalse from './pages/TrueOrFalse'
import FlagChallenge from './pages/FlagChallenge'
import QuickTrivia from './pages/QuickTrivia'
import Vortex from './pages/Vortex'
import AiQuizGenerator from './pages/AiQuizGenerator'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import GetStarted from './pages/GetStarted'
import VisitorStats from './pages/VisitorStats'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import FAQ from './pages/FAQ'
import Pricing from './pages/Pricing'
import About from './pages/About'
import NotFound from './pages/NotFound'
import VisitTracker from './components/VisitTracker'
import { Analytics } from '@vercel/analytics/react'
import HostLiveGame from './pages/HostLiveGame'
import LiveGamePlayer from './pages/LiveGamePlayer'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <VisitTracker />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/quiz/:id" element={<PlayQuiz />} />
              <Route path="/quiz/:id/details" element={<QuizDetails />} />
              <Route path="/join" element={<JoinGame />} />
              <Route path="/live/host/:pin" element={<HostLiveGame />} />
              <Route path="/live/play/:pin" element={<LiveGamePlayer />} />
              <Route path="/waiting" element={<WaitingRoom />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/mini-games" element={<MiniGames />} />
              <Route path="/mini-games/memory" element={<MemoryMatch />} />
              <Route path="/mini-games/word-scramble" element={<WordScramble />} />
              <Route path="/mini-games/quick-math" element={<QuickMath />} />
              <Route path="/mini-games/true-false" element={<TrueOrFalse />} />
              <Route path="/mini-games/flag-challenge" element={<FlagChallenge />} />
              <Route path="/mini-games/quick-trivia" element={<QuickTrivia />} />
              <Route path="/mini-games/vortex" element={<Vortex />} />
              <Route path="/ai-generator" element={<AiQuizGenerator />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/visitor-stats" element={<VisitorStats />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
      <Analytics />
    </LanguageProvider>
  )
}
