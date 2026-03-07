export default function HomeSection({ title, subtitle, children, className = '' }) {
  return (
    <section className={`px-4 py-14 sm:px-6 sm:py-16 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <h2 className="text-2xl font-bold text-white sm:text-3xl text-center">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-3 text-gray-400 text-center max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
