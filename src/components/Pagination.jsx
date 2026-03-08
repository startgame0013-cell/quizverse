import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export default function Pagination({ page, totalPages, onPageChange }) {
  const { t } = useLanguage()
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0}
        className="gap-1"
      >
        <ChevronLeft className="size-4" />
        {t('pagination.previous')}
      </Button>
      <span className="text-sm text-muted-foreground px-4">
        {t('pagination.page')} {page + 1} {t('pagination.of')} {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="gap-1"
      >
        {t('pagination.next')}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
