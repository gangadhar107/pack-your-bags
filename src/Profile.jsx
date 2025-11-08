import React, { useMemo, useRef, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function GradientAmount({ value }) {
  return (
    <div className="text-3xl font-bold bg-gradient-to-r from-teal to-sky bg-clip-text text-transparent">₹{value.toLocaleString('en-IN')}</div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(0)
  const [referralEarn, setReferralEarn] = useState(0)
  const [autopayOn, setAutopayOn] = useState(true)
  const [logoutOpen, setLogoutOpen] = useState(false)

  useEffect(() => {
    const readArray = (key) => {
      try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
    }
    const sumSoloCurrents = (arr) => arr.reduce((acc, item) => acc + (parseInt(item?.current || 0, 10) || 0), 0)

    const recompute = () => {
      const groups = readArray('tripjar.groups')
      const goals = readArray('tripjar.userGoals')
      // Per-user group savings (prefer yourSaved, else approximate by split current/membersCount)
      const groupSaved = Array.isArray(groups) ? groups.reduce((acc, grp) => {
        const members = grp.membersCount || (Array.isArray(grp.members) ? grp.members.length : 0) || 1
        const yourSaved = typeof grp.yourSaved === 'number' ? grp.yourSaved : Math.round((grp.current || 0) / members)
        return acc + (parseInt(yourSaved || 0, 10) || 0)
      }, 0) : 0
      // Solo goals savings (user-created goals)
      const soloSaved = Array.isArray(goals) ? sumSoloCurrents(goals) : 0
      const referral = parseInt(localStorage.getItem('tripjar.referralEarnings') || '0', 10) || 0
      setReferralEarn(referral)
      setWallet(groupSaved + soloSaved + referral)
    }

    // Initial compute
    recompute()
    // Update when app signals data changes or on storage changes (other tabs)
    const handler = () => recompute()
    window.addEventListener('tripjar:dataUpdated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('tripjar:dataUpdated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return (
    <div className="min-h-screen pb-40">
      {/* Top bar with back button */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Profile</h1>
      </header>

      {/* Header */}
      <section className="px-5 pt-3">
        <div className="slide-up flex items-center gap-4">
          <div className="relative">
            <img alt="Avatar" src="https://api.dicebear.com/9.x/initials/svg?seed=G" className="w-20 h-20 rounded-full shadow-soft" />
            <button className="absolute bottom-0 right-0 card p-1 text-xs">✏️</button>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Gangadhar</h1>
            <p className="text-slate-600 text-sm">Student Saver | Joined May 2025</p>
          </div>
        </div>
        <div className="mt-3">
          <button onClick={() => navigate('/profile/autopay')} className="bounce-soft bg-white rounded-full px-4 py-2 shadow-soft text-sm">Edit Profile ✏️</button>
        </div>
      </section>

      {/* Wallet summary */}
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-700">Pack Your Bags Wallet</div>
              <GradientAmount value={(wallet > 0 ? wallet : 23550)} />
              <div className={`mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ${autopayOn ? 'bg-teal/10 text-teal' : 'bg-orange/10 text-orange'}`}>{autopayOn ? 'AutoPay ON 🔁' : 'AutoPay OFF'}</div>
            </div>
            <button onClick={() => navigate('/profile/autopay')} className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft text-sm">Manage AutoPay</button>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <NavLink to="/earn" className="card p-4 text-center hover:translate-y-[-2px] transition-transform">
            <div className="text-xl">💸</div>
            <div className="text-sm text-slate-600">Referral Earnings</div>
            <div className="font-semibold">₹{(referralEarn > 0 ? referralEarn : 50).toLocaleString('en-IN')}</div>
          </NavLink>
          <NavLink to="/new-solo-trip" className="card p-4 text-center hover:translate-y-[-2px] transition-transform">
            <div className="text-xl">🎯</div>
            <div className="text-sm text-slate-600">Active Goals</div>
            <div className="font-semibold">2</div>
          </NavLink>
          <NavLink to="/groups" className="card p-4 text-center hover:translate-y-[-2px] transition-transform">
            <div className="text-xl">👥</div>
            <div className="text-sm text-slate-600">Trip Groups</div>
            <div className="font-semibold">1</div>
          </NavLink>
        </div>
      </section>

      {/* Settings */}
      <section className="px-5 mt-6">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 grid gap-2">
            <NavLink to="/profile/autopay" className="flex items-center justify-between px-3 py-2 rounded-xl bg-white">
              <span>⚙️ Manage AutoPay</span>
              <span>›</span>
            </NavLink>
            <button className="flex items-center justify-between px-3 py-2 rounded-xl bg-white">
              <span>🏦 Linked Accounts (UPI / Bank)</span>
              <span>›</span>
            </button>
            <button className="flex items-center justify-between px-3 py-2 rounded-xl bg-white">
              <span>🔔 Notifications</span>
              <span>›</span>
            </button>
            <NavLink to="/profile/help" className="flex items-center justify-between px-3 py-2 rounded-xl bg-white">
              <span>💬 Help & Support</span>
              <span>›</span>
            </NavLink>
            <button className="flex items-center justify-between px-3 py-2 rounded-xl bg-white">
              <span>🔒 Privacy & Security</span>
              <span>›</span>
            </button>
            <button onClick={() => setLogoutOpen(true)} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white text-red-600">
              <span>🚪 Logout</span>
              <span>›</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 mt-6 text-center text-slate-700">
        Pack Your Bags v1.0.0 — Made with 💙 for students
        <div className="mt-2 text-sm">
          <a href="#" className="underline">Terms of Use</a> | <a href="#" className="underline">Privacy Policy</a>
        </div>
      </footer>

      {/* Logout confirm modal */}
      {logoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-[92%] max-w-[420px] rounded-2xl shadow-2xl bg-white/80 border border-white/60 p-6">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-700">Are you sure you want to log out?</p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={() => setLogoutOpen(false)} className="px-4 py-2 rounded-full bg-slate-200">Cancel</button>
              <button onClick={() => { setLogoutOpen(false); navigate('/') }} className="px-4 py-2 rounded-full bg-red-600 text-white">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
