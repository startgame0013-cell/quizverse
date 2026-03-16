import { Component } from 'react'
import { Link } from 'react-router-dom'

export class AppErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('AppErrorBoundary:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>حدث خطأ / Something went wrong</h1>
        <p style={{ color: '#a3a3a3', marginBottom: '1.5rem', maxWidth: '400px' }}>
          الصفحة لم تُحمّل بشكل صحيح. استخدم الزر للعودة.
          <br />
          The page did not load correctly. Use the button to go back.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FACC15',
            color: '#0a0a0a',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1.1rem',
          }}
        >
          ← رجوع / Back to Home
        </Link>
      </div>
    )
  }
}
