# QuizVerse — Project File Guide

Press **Cmd+P** (Mac) or **Ctrl+P** (Windows) and type the file name to open it quickly.

---

## Project Structure

```
quizverse/
├── src/                 ← MAIN FRONTEND (active app, deployed to Vercel)
├── frontend/            ← Alternate frontend (older/different version)
├── backend/             ← Node.js API server
├── index.html
├── vercel.json
└── package.json
```

---

## ROOT — Main Frontend (`src/`)

This is the main QuizVerse app: React + Vite. Deployed to Vercel.

### Core Files
| File | Description |
|------|-------------|
| `index.html` | Entry point — loads the app |
| `vercel.json` | Vercel deployment config |
| `vite.config.js` | Vite config |
| `package.json` | Dependencies and scripts |
| `tailwind.config.js` | Tailwind theme |
| `src/index.css` | Global styles (dark theme, yellow accents) |

### App
| File | Description |
|------|-------------|
| `src/main.jsx` | React app entry |
| `src/App.jsx` | All routes (Home, CreateQuiz, Leaderboard, etc.) |

### Pages (`src/pages/`)
| File | Description |
|------|-------------|
| `src/pages/Home.jsx` | Landing page |
| `src/pages/CreateQuiz.jsx` | Create/edit quiz |
| `src/pages/MyQuizzes.jsx` | My quizzes list (pagination) |
| `src/pages/QuizDetails.jsx` | Quiz details |
| `src/pages/PlayQuiz.jsx` | Play quiz |
| `src/pages/JoinGame.jsx` | Join by PIN |
| `src/pages/WaitingRoom.jsx` | Waiting room |
| `src/pages/Leaderboard.jsx` | Leaderboard |
| `src/pages/MiniGames.jsx` | Mini games list |
| `src/pages/MemoryMatch.jsx` | Memory Match game |
| `src/pages/WordScramble.jsx` | Word Scramble game |
| `src/pages/QuickMath.jsx` | Quick Math game |
| `src/pages/TrueOrFalse.jsx` | True or False game |
| `src/pages/FlagChallenge.jsx` | Flag Challenge game |
| `src/pages/QuickTrivia.jsx` | Quick Trivia game |
| `src/pages/AiQuizGenerator.jsx` | AI quiz generator |
| `src/pages/SignIn.jsx` | Sign in |
| `src/pages/Register.jsx` | Register |
| `src/pages/GetStarted.jsx` | Get started |
| `src/pages/NotFound.jsx` | 404 page |

### Components (`src/components/`)
| File | Description |
|------|-------------|
| `src/components/Layout.jsx` | Main layout + sidebar |
| `src/components/Navbar.jsx` | Top navbar |
| `src/components/HomeSection.jsx` | Home page sections |
| `src/components/Section.jsx` | Generic section |
| `src/components/Pagination.jsx` | Previous/Next pagination |

### UI Components (`src/components/ui/`)
| File | Description |
|------|-------------|
| `src/components/ui/button.jsx` | Button |
| `src/components/ui/card.jsx` | Card |
| `src/components/ui/input.jsx` | Input field |
| `src/components/ui/textarea.jsx` | Textarea |
| `src/components/ui/select.jsx` | Select dropdown |
| `src/components/ui/tabs.jsx` | Tabs |
| `src/components/ui/badge.jsx` | Badge |
| `src/components/ui/label.jsx` | Label |
| `src/components/ui/skeleton.jsx` | Loading skeleton |
| `src/components/ui/index.js` | UI exports |

### Contexts (`src/context/`)
| File | Description |
|------|-------------|
| `src/context/LanguageContext.jsx` | Arabic/English language |
| `src/context/AuthContext.jsx` | Auth state |
| `src/context/ToastContext.jsx` | Toast notifications |

### Data (`src/data/`)
| File | Description |
|------|-------------|
| `src/data/demoContent.js` | Demo data (leaderboard, etc.) |
| `src/data/gameData.js` | Game data (words, flags, trivia) |
| `src/data/kuwaitElementary2026.js` | Kuwait curriculum quizzes |
| `src/data/mockAiQuestions.js` | Mock AI questions |

### Lib (`src/lib/`)
| File | Description |
|------|-------------|
| `src/lib/quizStore.js` | Quiz storage (LocalStorage) |
| `src/lib/utils.js` | Utilities (cn, etc.) |

### i18n (`src/i18n/`)
| File | Description |
|------|-------------|
| `src/i18n/translations.js` | All app text (ar/en) |

---

## BACKEND (`backend/`)

Node.js + Express API. Run with `cd backend && npm start`.

### Core
| File | Description |
|------|-------------|
| `backend/server.js` | Express app, routes |
| `backend/config/db.js` | Database connection |
| `backend/package.json` | Backend dependencies |

### Models (`backend/models/`)
| File | Description |
|------|-------------|
| `backend/models/User.js` | User model |
| `backend/models/Quiz.js` | Quiz model |
| `backend/models/Score.js` | Score model |
| `backend/models/Class.js` | Class model |

### Routes (`backend/routes/`)
| File | Description |
|------|-------------|
| `backend/routes/auth.js` | `/api/auth` |
| `backend/routes/quizzes.js` | `/api/quizzes` |
| `backend/routes/scores.js` | `/api/scores` |
| `backend/routes/classes.js` | `/api/classes` |
| `backend/routes/ai.js` | `/api/ai` |

### Middleware
| File | Description |
|------|-------------|
| `backend/middleware/auth.js` | Auth middleware |

---

## FRONTEND (alternate) (`frontend/`)

Alternate frontend. Separate from main `src/`.

| File | Description |
|------|-------------|
| `frontend/package.json` | Dependencies |
| `frontend/vite.config.js` | Vite config |
| `frontend/src/main.jsx` | Entry |
| `frontend/src/App.jsx` | App |
| `frontend/src/components/Navbar.jsx` | Navbar |
| `frontend/src/components/Layout.jsx` | Layout |
| `frontend/src/context/AuthContext.jsx` | Auth |
| `frontend/src/pages/Home.jsx` | Home |
| `frontend/src/pages/Login.jsx` | Login |
| `frontend/src/pages/Register.jsx` | Register |
| `frontend/src/pages/CreateQuiz.jsx` | Create quiz |
| `frontend/src/pages/QuizList.jsx` | Quiz list |
| `frontend/src/pages/TakeQuiz.jsx` | Take quiz |
| `frontend/src/pages/Leaderboard.jsx` | Leaderboard |
| `frontend/src/pages/Classes.jsx` | Classes |
| `frontend/src/pages/Dashboard.jsx` | Dashboard |

---

## How to run

| Part | Command | URL |
|------|---------|-----|
| Main frontend | `npm run dev` | http://localhost:5173 |
| Backend | `cd backend && npm start` | http://localhost:4000 |
| Alternate frontend | `cd frontend && npm run dev` | (check port) |
