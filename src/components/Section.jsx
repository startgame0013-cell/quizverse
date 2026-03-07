import { cn } from '@/lib/utils'

export default function Section({ title, subtitle, children, className, as = 'section' }) {
  const Comp = as
  return (
    <Comp className={cn('px-4 py-14 sm:px-6 sm:py-16 lg:px-8', className)}>
      <div className="mx-auto max-w-6xl">
        {(title || subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {title && (
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-muted-foreground text-base sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </Comp>
  )
}
