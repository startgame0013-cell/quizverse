# QuizVerse

Arabic-first, mobile-first quiz platform MVP for schools, teachers, students, families, and events.

**Brand:** QuizVerse — premium dark UI, yellow accents (#FACC15), RTL support.

## Tech stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Tailwind CSS (dark theme, yellow highlights)
- **Routing:** React Router 6
- **State:** React Context (Language, Auth, Toast)
- **Persistence:** LocalStorage (quizzes, user, language)
- **Icons:** lucide-react
- **UI:** shadcn-style components (Button, Card, Input, Select, Tabs, Badge, etc.)

## Routes / Pages

| Route | Page | Description |
|-------|------|--------------|
| `/` | Home | Landing: hero, stats, features, audience, CTA |
| `/create-quiz` | Create Quiz | Manual builder: title, description, difficulty, category, audience, questions (4 options, correct answer, optional explanation) |
| `/create-quiz?edit=:id` | Create Quiz (edit) | Edit existing quiz |
| `/my-quizzes` | My Quizzes | List with search, filter, play, edit, duplicate, host, delete |
| `/quiz/:id` | Play Quiz | Take quiz, see score |
| `/quiz/:id/details` | Quiz Details | Preview, edit, play, host, duplicate |
| `/join` | Join Game | Enter PIN + nickname |
| `/waiting` | Waiting Room | Demo waiting room (PIN 123456) |
| `/leaderboard` | Leaderboard | Tabs: Global, School, Family, This Week |
| `/mini-games` | Mini Games | Cards: Memory Match (playable), others coming soon |
| `/mini-games/memory` | Memory Match | Playable memory card game |
| `/ai-generator` | AI Generator | Topic + difficulty → mock questions, save or edit |
| `/sign-in` | Sign In | Demo auth (any email/password) |
| `/register` | Register | Demo registration |
| `/get-started` | Get Started | Join game, create quiz, register |
| `*` | 404 | Not found page |

## What is real vs mocked

| Feature | Status |
|---------|--------|
| Create quiz (manual) | ✅ Real — saves to LocalStorage |
| AI quiz generator | ⚠️ Mock — uses template questions by topic; no real API |
| My Quizzes (CRUD) | ✅ Real — LocalStorage |
| Play quiz | ✅ Real |
| Join game | ⚠️ Mock — any PIN routes to waiting room |
| Waiting room | ⚠️ Mock — static demo data |
| Leaderboard | ⚠️ Mock — static demo data |
| Memory Match mini game | ✅ Real — playable |
| Auth (sign in / register) | ⚠️ Mock — LocalStorage; any credentials work |

## Demo content

- **First load:** 8 demo quizzes auto-seeded (Kuwait History, Arabic Vocabulary, Family Fun Night, Science Basics, Ramadan Quiz, GCC Capitals, Islamic Trivia, Kids General Knowledge)
- **Join game:** Use PIN `123456` to enter waiting room
- **Leaderboard:** Demo users (QuizMaster99, BrainBox, etc.) with tabs

## Data model

**Quiz:**
- `id`, `title`, `description`, `category`, `audience`, `difficulty`, `language`, `createdAt`, `updatedAt`
- `questions[]`: `id`, `text`, `options[]`, `correctIndex`, `explanation?`

## How to run

```bash
cd /Users/ajayeb/quizverse
npm install
npm run dev
```

Open **http://localhost:5173** (or the URL Vite prints).

**Build:**
```bash
npm run build
npm run preview
```

## Suggested next steps (priority)

1. **Backend API** — Connect real auth, quiz storage, and live game sessions
2. **Real AI integration** — Replace mock generator with OpenAI/Claude API
3. **Live game flow** — WebSockets or polling for host/player sync
4. **More mini games** — Word Scramble, Quick Math, Flag Challenge
5. **Analytics** — Track quiz plays, scores, and engagement
