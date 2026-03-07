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
import AiQuizGenerator from './pages/AiQuizGenerator'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import GetStarted from './pages/GetStarted'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/quiz/:id" element={<PlayQuiz />} />
              <Route path="/quiz/:id/details" element={<QuizDetails />} />
              <Route path="/join" element={<JoinGame />} />
              <Route path="/waiting" element={<WaitingRoom />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/mini-games" element={<MiniGames />} />
              <Route path="/mini-games/memory" element={<MemoryMatch />} />
              <Route path="/ai-generator" element={<AiQuizGenerator />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
