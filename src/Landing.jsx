import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-gradient-to-br from-teal-400 via-blue-400 to-purple-400">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Pack Your Bags</h1>
            <p className="text-slate-600">Save smart. Travel together.</p>
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-soft hover:opacity-90 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-full px-4 py-3 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-soft hover:bg-slate-50 transition"
            >
              Sign Up
            </button>
            <button
              onClick={handleDemo}
              className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-soft hover:shadow-lg transition"
            >
              Skip Login → Demo Mode
            </button>
            <p className="text-center text-xs text-slate-600">
              Explore without an account — we’ll create a temporary demo profile on this device.
            </p>
          </div>
          <p className="mt-6 text-center text-sm text-slate-700">Let’s plan your next adventure 🌍</p>
        </div>
      </div>
    </div>
  )
}
