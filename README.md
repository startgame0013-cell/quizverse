# QuizVerse

Arabic-first, mobile-first quiz platform for schools, teachers, students, families, and events.

**Brand:** QuizVerse — premium dark UI (#0a0a0a), yellow accents (#FACC15), RTL support, bilingual (Arabic/English).

## Tech stack

**Language:** **JavaScript** (ES modules) end-to-end — no TypeScript requirement.

- **Frontend (site):** **React 18** + **Vite 5** — SPA, bilingual (AR/EN), RTL.
- **Styling:** Tailwind CSS (dark theme, yellow highlights)
- **Routing:** React Router 6
- **State:** React Context (Language, Auth, Toast)
- **Persistence:** LocalStorage (quizzes, user, language); server features use MongoDB when API is connected
- **Icons:** lucide-react, react-icons
- **UI:** shadcn-style components (Button, Card, Input, Select, Tabs, Badge, etc.)

**Backend API:** **`backend/`** is **Node.js + Express** (REST, Socket.IO for live games, JWT auth). You can swap Express for **Fastify** in the same role if you prefer; the repo is structured as a classic JS API server.

**Deployment options:**

| Piece | Typical setup |
|-------|----------------|
| Frontend | **Vercel** (static `dist/`, `vercel.json` SPA fallback) |
| API + WebSockets | **Render**, Railway, Fly.io, or any Node host — set `VITE_API_URL` / `VITE_SOCKET_URL` on Vercel to this URL |
| Serverless on Vercel | Optional: move individual routes to **Vercel Serverless Functions** (`/api/*`) — same JavaScript; this repo currently ships a **single Express app** in `backend/` for simplicity |

Environment variables: see root `.env.example` (Vite) and `backend/.env.example` (MongoDB, `JWT_SECRET`, `OPENAI_API_KEY`, `FRONTEND_URL`).

## Features

- **Bilingual:** Arabic / English with language toggle and RTL layout
- **6 Mini Games:** Memory Match, Word Scramble, Quick Math, True or False, Flag Challenge, Quick Trivia
- **Pagination:** My Quizzes (5 per page), Leaderboard
- **Kuwait Curriculum:** Demo quizzes for elementary school
- **Create Quiz:** Manual builder with questions, options, difficulty
- **AI Generator:** Topic and/or **text-based PDF** → questions via OpenAI when `OPENAI_API_KEY` is set on the backend; mock data if API offline
- **Leaderboard:** Tabs (Global, School, Family, This Week)
- **Auth:** Sign in / Register (demo with LocalStorage)

## Routes / Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/create-quiz` | Create Quiz |
| `/my-quizzes` | My Quizzes |
| `/quiz/:id` | Play Quiz |
| `/quiz/:id/details` | Quiz Details |
| `/join` | Join Game |
| `/waiting` | Waiting Room |
| `/leaderboard` | Leaderboard |
| `/mini-games` | Mini Games |
| `/mini-games/memory` | Memory Match |
| `/mini-games/word-scramble` | Word Scramble |
| `/mini-games/quick-math` | Quick Math |
| `/mini-games/true-false` | True or False |
| `/mini-games/flag-challenge` | Flag Challenge |
| `/mini-games/quick-trivia` | Quick Trivia |
| `/ai-generator` | AI Generator (topic / PDF) |
| `/study` | Study library |
| `/study/:id` | Study library entry |
| `/live/report/:pin` | Live game detailed report |
| `/quiz/:id/reports` | Solo attempt reports |
| `/sign-in` | Sign In |
| `/register` | Register |
| `/get-started` | Get Started |

## How to run

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

**Build:**
```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy — `vercel.json` handles SPA routing (no 404 on refresh)
