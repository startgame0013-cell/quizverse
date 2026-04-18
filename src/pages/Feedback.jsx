import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/context/LanguageContext'
import { useToast } from '@/context/ToastContext'
import API from '@/lib/api.js'

export default function Feedback() {
  const { t, lang } = useLanguage()
  const { success, error } = useToast()
  const { pathname } = useLocation()
  const [kind, setKind] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const msg = message.trim()
    if (msg.length < 4) {
      error(t('feedback.tooShort'))
      return
    }
    setSending(true)
    try {
      const res = await fetch(`${API}/api/community/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, message: msg, email: email.trim(), path: pathname }),
      })
      const d = await res.json()
      if (!d.ok) throw new Error(d.error || 'fail')
      setDone(true)
      setMessage('')
      setEmail('')
      success(t('feedback.thanks'))
    } catch {
      error(t('feedback.sendError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <MessageSquarePlus className="size-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('feedback.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('feedback.subtitle')}</p>
        </div>
      </div>

      {done ? (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-6 py-8 text-center">
          <p className="font-medium text-foreground">{t('feedback.thanks')}</p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/">{t('feedback.backHome')}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fb-kind">{t('feedback.kind')}</Label>
            <select
              id="fb-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="suggestion">{t('visitorStats.kindSuggestion')}</option>
              <option value="bug">{t('visitorStats.kindBug')}</option>
              <option value="other">{t('visitorStats.kindOther')}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-msg">{t('feedback.message')}</Label>
            <Textarea
              id="fb-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={4000}
              required
              className="bg-background/80"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-email">{t('feedback.email')}</Label>
            <Input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
          </div>
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? '…' : t('feedback.submit')}
          </Button>
        </form>
      )}
    </div>
  )
}
