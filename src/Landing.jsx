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
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-gradient-to-b from-sky-100 via-teal-50 to-white">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Pack Your Bags</h1>
            <p className="text-slate-600">Save smart. Travel together.</p>
          </div>
          <div className="mt-6 space-y-3">
            {/* Login (primary) */}
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Login
            </button>
            {/* Sign Up (secondary) */}
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              Sign Up
            </button>
            {/* Demo Mode (tertiary, equally visible) */}
            <button
              onClick={handleDemo}
              className="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-center shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
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
