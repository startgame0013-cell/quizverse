import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Section from '@/components/Section'

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Do I need an account to play?', acceptedAnswer: { '@type': 'Answer', text: 'No. You can join a live game with just a PIN and a nickname. Creating and saving quizzes or using the AI generator may require an account.' } },
    { '@type': 'Question', name: 'How do I join a live game?', acceptedAnswer: { '@type': 'Answer', text: 'Get the game PIN from the host, go to Join Live Game, enter the PIN and a nickname, then join. No sign-up needed to play.' } },
    { '@type': 'Question', name: 'How many players can join one game?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on your plan. Free tier allows a limited number; paid plans support more players per game (e.g. 50–200).' } },
    { '@type': 'Question', name: 'Is QuizVerse available in Arabic?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. QuizVerse is Arabic-first with full English support. You can switch language from the site.' } },
    { '@type': 'Question', name: 'How do I create a quiz?', acceptedAnswer: { '@type': 'Answer', text: 'Go to Create Quiz, add a title and questions (or use the AI generator), then save. Your quizzes are stored and can be played or hosted as live games.' } },
    { '@type': 'Question', name: 'Can I use QuizVerse in the classroom?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Teachers can create quizzes, host live games with one PIN, and use the leaderboard for engagement. Perfect for review and formative assessment.' } },
  ],
}

export default function FAQ() {
  const { t } = useLanguage()
  const items = [
    { q: 'q1', a: 'a1' },
    { q: 'q2', a: 'a2' },
    { q: 'q3', a: 'a3' },
    { q: 'q4', a: 'a4' },
    { q: 'q5', a: 'a5' },
    { q: 'q6', a: 'a6' },
  ]

  return (
    <div className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <Section title={t('faq.title')} subtitle={t('faq.subtitle')}>
        <div className="max-w-none space-y-6">
          <dl className="space-y-6">
            {items.map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <dt className="text-lg font-semibold text-foreground">{t(`faq.${q}`)}</dt>
                <dd className="mt-2 text-muted-foreground">{t(`faq.${a}`)}</dd>
              </div>
            ))}
          </dl>
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <HelpCircle className="size-4" />
            {t('faq.backHome')}
          </Link>
        </div>
      </Section>
    </div>
  )
}
