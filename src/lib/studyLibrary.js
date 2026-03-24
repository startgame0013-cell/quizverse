import { STUDY_SUBJECTS, STUDY_GRADES, STUDY_ENTRIES } from '@/data/studyLibrary'

export function getSubjects() {
  return STUDY_SUBJECTS
}

export function getGrades() {
  return STUDY_GRADES
}

export function getAllEntries() {
  return STUDY_ENTRIES
}

export function getEntryById(id) {
  return STUDY_ENTRIES.find((e) => e.id === id) || null
}

function norm(s) {
  return (s || '').toString().trim().toLowerCase()
}

/**
 * @param {{ q?: string, subjectId?: string, gradeId?: string, type?: string }} filters
 */
export function filterEntries(filters = {}) {
  const qRaw = (filters.q || '').trim()
  const q = norm(qRaw)
  const subjectId = filters.subjectId || ''
  const gradeId = filters.gradeId || ''
  const type = filters.type || ''

  return STUDY_ENTRIES.filter((e) => {
    if (subjectId && e.subjectId !== subjectId) return false
    if (gradeId && e.gradeId !== gradeId) return false
    if (type && e.type !== type) return false
    if (!q) return true
    const hay = [
      e.titleEn,
      e.titleAr,
      e.descriptionEn,
      e.descriptionAr,
      e.unitTitleEn,
      e.unitTitleAr,
      ...(e.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
    return norm(hay).includes(q) || hay.includes(qRaw)
  })
}

export function subjectLabel(subjectId, lang) {
  const s = STUDY_SUBJECTS.find((x) => x.id === subjectId)
  if (!s) return subjectId
  return lang === 'ar' ? s.labelAr : s.labelEn
}

export function gradeLabel(gradeId, lang) {
  const g = STUDY_GRADES.find((x) => x.id === gradeId)
  if (!g) return gradeId
  return lang === 'ar' ? g.labelAr : g.labelEn
}

export function unitLabel(entry, lang) {
  if (!entry) return ''
  return lang === 'ar' ? entry.unitTitleAr : entry.unitTitleEn
}

export function entryTitle(entry, lang) {
  if (!entry) return ''
  return lang === 'ar' ? entry.titleAr : entry.titleEn
}

export function entryDescription(entry, lang) {
  if (!entry) return ''
  return lang === 'ar' ? entry.descriptionAr || '' : entry.descriptionEn || ''
}

export function entryBody(entry, lang) {
  if (!entry) return ''
  return lang === 'ar' ? entry.bodyAr || '' : entry.bodyEn || ''
}

/** @returns {boolean} */
export function isYoutubeUrl(url) {
  if (!url) return false
  return /youtube\.com|youtu\.be/i.test(url)
}

export function youtubeEmbedUrl(url) {
  if (!url) return ''
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.replace(/^\//, '').split('/')[0]
    } else {
      id = u.searchParams.get('v') || ''
    }
    if (!id) return ''
    return `https://www.youtube-nocookie.com/embed/${id}`
  } catch {
    return ''
  }
}
