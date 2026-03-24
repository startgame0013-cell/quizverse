import { Suspense, lazy } from 'react'
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
import LiveGameReport from './pages/LiveGameReport'
import QuizSoloReports from './pages/QuizSoloReports'
import WaitingRoom from './pages/WaitingRoom'
import Leaderboard from './pages/Leaderboard'
import Curricula from './pages/Curricula'
import StudyLibrary from './pages/StudyLibrary'
import StudyLibraryEntry from './pages/StudyLibraryEntry'
import MiniGames from './pages/MiniGames'
import Flashcards from './pages/Flashcards'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import FAQ from './pages/FAQ'
import Pricing from './pages/Pricing'
import About from './pages/About'
import NotFound from './pages/NotFound'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import VisitTracker from './components/VisitTracker'
import { Analytics } from '@vercel/analytics/react'

const MemoryMatch = lazy(() => import('./pages/MemoryMatch'))
const WordScramble = lazy(() => import('./pages/WordScramble'))
const QuickMath = lazy(() => import('./pages/QuickMath'))
const TrueOrFalse = lazy(() => import('./pages/TrueOrFalse'))
const FlagChallenge = lazy(() => import('./pages/FlagChallenge'))
const QuickTrivia = lazy(() => import('./pages/QuickTrivia'))
const Vortex = lazy(() => import('./pages/Vortex'))
const AiQuizGenerator = lazy(() => import('./pages/AiQuizGenerator'))
const GetStarted = lazy(() => import('./pages/GetStarted'))
const VisitorStats = lazy(() => import('./pages/VisitorStats'))
const HostLiveGame = lazy(() => import('./pages/HostLiveGame'))
const LiveGamePlayer = lazy(() => import('./pages/LiveGamePlayer'))
const InstitutionalTracking = lazy(() => import('./pages/InstitutionalTracking'))
const TeacherClassQuizReport = lazy(() => import('./pages/TeacherClassQuizReport'))

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <VisitTracker />
          <Layout>
            <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/quiz/:id" element={<PlayQuiz />} />
              <Route path="/quiz/:id/details" element={<QuizDetails />} />
              <Route path="/join" element={<JoinGame />} />
              <Route path="/live/report/:pin" element={<LiveGameReport />} />
              <Route path="/live/host/:pin" element={<HostLiveGame />} />
              <Route path="/live/play/:pin" element={<LiveGamePlayer />} />
              <Route path="/quiz/:id/reports" element={<QuizSoloReports />} />
              <Route path="/waiting" element={<WaitingRoom />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/curricula" element={<Curricula />} />
              <Route path="/study" element={<StudyLibrary />} />
              <Route path="/study/:id" element={<StudyLibraryEntry />} />

              <Route path="/mini-games" element={<MiniGames />} />
              <Route path="/mini-games/memory" element={<MemoryMatch />} />
              <Route path="/mini-games/word-scramble" element={<WordScramble />} />
              <Route path="/mini-games/quick-math" element={<QuickMath />} />
              <Route path="/mini-games/true-false" element={<TrueOrFalse />} />
              <Route path="/mini-games/flag-challenge" element={<FlagChallenge />} />
              <Route path="/mini-games/quick-trivia" element={<QuickTrivia />} />
              <Route path="/mini-games/vortex" element={<Vortex />} />

              <Route path="/ai-generator" element={<AiQuizGenerator />} />

              {/* Auth */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
              <Route path="/register" element={<Register />} />

              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/flashcards/:quizId" element={<Flashcards />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/visitor-stats" element={<VisitorStats />} />
              <Route path="/tracking" element={<InstitutionalTracking />} />
              <Route path="/tracking/class/:classId/quiz/:quizId" element={<TeacherClassQuizReport />} />
              <Route path="/tracking/class/:classId" element={<InstitutionalTracking />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </Layout>
        </ToastProvider>
      </AuthProvider>
      <Analytics />
    </LanguageProvider>
  )
}