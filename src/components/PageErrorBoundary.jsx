import { Component } from 'react'
import { Link } from 'react-router-dom'

/** يلتقط أخطاء محتوى الصفحة فقط ويبقي الـ Navbar ظاهراً */
export class PageErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('PageErrorBoundary:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center relative z-[1]">
        <h2 className="text-lg font-semibold text-white">حدث خطأ في الصفحة / Page error</h2>
        <p className="max-w-md text-sm text-gray-400">
          جرّب تحديث الصفحة (خصوصاً بعد تحديث الموقع). أو ارجع للرئيسية.
          <span className="mt-2 block text-xs text-gray-500">
            Try refreshing — often fixes this after a deploy. Or use Home below.
          </span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg border border-[#FACC15]/50 bg-transparent px-4 py-2 font-semibold text-[#FACC15] hover:bg-[#FACC15]/10"
          >
            تحديث الصفحة / Refresh
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FACC15] px-4 py-2 font-semibold text-[#0a0a0a] no-underline hover:opacity-90 cursor-pointer"
          >
            ← الرئيسية / Home
          </Link>
        </div>
      </div>
    )
  }
}
