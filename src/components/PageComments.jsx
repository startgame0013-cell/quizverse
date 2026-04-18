import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import API from '@/lib/api.js'

export default function PageComments({ pageKey, id: sectionId, className: sectionClass }) {
  const { t, lang } = useLanguage()
  const { isAuthenticated, getToken } = useAuth()
  const { success, error } = useToast()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(() => {
    if (!API || !pageKey) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`${API}/api/community/comments?pageKey=${encodeURIComponent(pageKey)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setComments(d.comments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [pageKey])

  useEffect(() => {
    load()
  }, [load])

  const submit = async (e) => {
    e.preventDefault()
    const text = body.trim()
    if (text.length < 2) return
    const token = getToken?.()
    if (!API || !token) {
      error(t('pageComments.needLogin'))
      return
    }
    setSending(true)
    try {
      const res = await fetch(`${API}/api/community/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pageKey, body: text }),
      })
      const d = await res.json()
      if (!d.ok) throw new Error(d.error || 'fail')
      setBody('')
      success(t('pageComments.sent'))
      load()
    } catch {
      error(t('pageComments.sendError'))
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id={sectionId || undefined}
      className={`mt-12 rounded-2xl border border-border bg-card/40 px-4 py-8 sm:px-6${sectionClass ? ` ${sectionClass}` : ''}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MessageCircle className="size-5 text-primary" />
          {t('pageComments.title')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('pageComments.subtitle')}</p>

        {isAuthenticated ? (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('pageComments.placeholder')}
              rows={3}
              maxLength={800}
              className="resize-y bg-background/80"
            />
            <Button type="submit" disabled={sending || body.trim().length < 2}>
              {sending ? '…' : t('pageComments.submit')}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            <Link to="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
              {t('pageComments.signInLink')}
            </Link>
            {' · '}
            <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              {t('pageComments.registerLink')}
            </Link>
          </p>
        )}

        <div className="mt-8 space-y-4 border-t border-border pt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">{t('pageComments.loading')}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('pageComments.empty')}</p>
          ) : (
            comments.map((c, i) => (
              <div key={`${c.createdAt}-${i}`} className="rounded-lg border border-border/60 bg-background/50 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-primary">{c.displayName || '—'}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString(lang === 'ar' ? 'ar' : 'en') : ''}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{c.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
