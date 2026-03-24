import { useState, useEffect } from 'react'
import { getQuizById } from '@/lib/quizStore'
import API from '@/lib/api.js'
import { fetchQuizPublic, isMongoObjectId, serverQuizToClient } from '@/lib/quizApi'

/**
 * Loads a quiz: localStorage ids (q_…) or MongoDB ObjectId from GET /api/quizzes/:id
 */
export function useQuiz(id) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setQuiz(null)
      setLoading(false)
      setError('')
      return
    }

    if (!isMongoObjectId(id)) {
      setQuiz(getQuizById(id))
      setLoading(false)
      setError('')
      return
    }

    if (!API) {
      setQuiz(null)
      setLoading(false)
      setError('noApi')
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')
    fetchQuizPublic(id)
      .then((q) => {
        if (!cancelled) setQuiz(serverQuizToClient(q))
      })
      .catch(() => {
        if (!cancelled) {
          setQuiz(null)
          setError('loadError')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return { quiz, loading, error }
}
