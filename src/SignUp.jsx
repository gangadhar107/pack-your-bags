import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) {
      setError('Please fill in name, email/phone, and password.')
      return
    }
    const user = {
      name: name.trim(),
      email: email.trim(),
      password,
      referralCode: referral.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem('pyb.user', JSON.stringify(user))
      localStorage.setItem('pyb.greetOnce', '1')
      // Inform app about data update
      window.dispatchEvent(new Event('storage'))
    } catch {}
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-gradient-to-br from-teal-400 via-blue-400 to-purple-400">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 text-center">Create your account</h2>
          <p className="text-center text-sm text-slate-600">Let’s plan your next adventure 🌍</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Email / Phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com / 98765 43210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Referral code (optional)</label>
              <input
                type="text"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                placeholder="e.g., FRIEND50"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <button type="submit" className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-soft hover:opacity-90 transition">
              Create Account
            </button>
            <p className="text-xs text-slate-600 text-center">By continuing, you agree to our Terms of Use.</p>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-slate-600">Already have an account?</span>{' '}
            <Link to="/login" className="text-teal-600 font-medium">Login →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

