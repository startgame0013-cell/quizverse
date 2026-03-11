import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { seedDemoQuizzesIfNeeded } from './lib/quizStore'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import App from './App'
import './index.css'

try {
  seedDemoQuizzesIfNeeded()
} catch (e) {
  console.warn('seedDemoQuizzesIfNeeded:', e)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
