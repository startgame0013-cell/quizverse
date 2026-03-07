import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { seedDemoQuizzesIfNeeded } from './lib/quizStore'
import App from './App'
import './index.css'

seedDemoQuizzesIfNeeded()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
