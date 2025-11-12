import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      const raw = localStorage.getItem('pyb.user')
      const user = raw ? JSON.parse(raw) : null
      if (!user) {
        setError('No account found. Please sign up first.')
        return
      }
      const match = (id.trim().toLowerCase() === (user.email || '').toLowerCase()) && password === user.password
      if (!match) {
        setError('Invalid credentials. Check your email/phone and password.')
        return
      }
      // Onboarding animation, then redirect
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        localStorage.setItem('pyb.greetOnce', '1')
        navigate('/', { replace: true })
      }, 1500)
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  const handleDemo = () => {
    const demoUser = {
      name: 'Traveler',
      email: 'demo@packyourbags.app',
      password: 'demo',
      createdAt: new Date().toISOString(),
      referralCode: 'DEMO50',
      demo: true,
    }
    localStorage.setItem('pyb.user', JSON.stringify(demoUser))
    localStorage.setItem('pyb.greetOnce', '1')
    navigate('/', { replace: true })
  }

  const forgot = () => {
    alert('Demo: We would send a reset link to your email.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-gradient-to-b from-sky-100 via-teal-50 to-white">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white p-6 shadow-xl relative">
          <h2 className="text-xl font-bold text-slate-900 text-center">Welcome back</h2>
          <p className="text-center text-sm text-slate-600">Let’s plan your next adventure 🌍</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email / Phone</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="you@example.com / 98765 43210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm text-slate-700 mb-1">Password</label>
                <button type="button" onClick={forgot} className="text-xs text-teal-600">Forgot Password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            {/* Button stack */}
            <div className="space-y-3">
              {/* Login (primary) */}
              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Login
              </button>

              {/* Sign Up (secondary) */}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Sign Up
              </button>

              {/* Demo Mode (tertiary) */}
              <button
                type="button"
                onClick={handleDemo}
                className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                Skip Login → Demo Mode
              </button>
            </div>
            <p className="text-center text-xs text-slate-600">
              Explore without signing up — a temporary demo profile is created on this device.
            </p>
            <div className="text-center text-sm">
              <span className="text-slate-600">Prefer to sign up from here?</span>{' '}
              <Link to="/signup" className="text-teal-600 font-medium">Sign up →</Link>
            </div>
          </form>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur rounded-3xl">
              <div className="animate-bounce text-3xl">🧳</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
