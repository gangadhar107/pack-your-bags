import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import BottomNav from './BottomNav'

function useCountUp(target = 0, durationMs = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = performance.now()
    const anim = () => {
      const now = performance.now()
      const p = Math.min(1, (now - start) / durationMs)
      setValue(Math.floor(target * p))
      if (p < 1) requestAnimationFrame(anim)
    }
    requestAnimationFrame(anim)
  }, [target, durationMs])
  return value
}

function CircularRing({ percent = 0, color = '#22c55e', label }) {
  const deg = `${Math.min(100, Math.max(0, percent)) * 3.6}deg`
  return (
    <div className="ring" style={{ ['--ring-color']: color, ['--ring-deg']: deg }}>
      <div className="ring-inner">
        <div className="text-center">
          {label && <div className="text-[10px] text-slate-500">{label}</div>}
          <div className="text-xs font-semibold">{percent}%</div>
        </div>
      </div>
    </div>
  )
}

function ConfettiBurst({ trigger = 0 }) {
  const [pieces, setPieces] = useState([])
  useEffect(() => {
    if (trigger <= 0) return
    const colors = ['#22c55e', '#38bdf8', '#fb7185', '#f59e0b', '#a78bfa']
    const count = 24
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: `${trigger}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 150,
      duration: 900 + Math.random() * 800,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
    }))
    setPieces(generated)
    const t = setTimeout(() => setPieces([]), 2200)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute', left: p.left + '%', top: '8%',
            width: p.size, height: p.size,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: 2,
            animation: `fall ${p.duration}ms ease-out ${p.delay}ms forwards`,
            opacity: 0.9,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(320px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function EarnRewards() {
  const goalFriends = 3
  const [joined, setJoined] = useState(1)
  const [burstCount, setBurstCount] = useState(0)
  const percent = useMemo(() => Math.round((joined / goalFriends) * 100), [joined])
  const targetEarnings = joined * 50
  const earnings = useCountUp(targetEarnings, 900)
  const code = 'GANGA2024'
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedMsg, setCopiedMsg] = useState(false)

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const storedJoined = parseInt(localStorage.getItem('tripjar.referrals.joinedCount') || '0', 10) || 0
      if (storedJoined > 0) setJoined(Math.min(goalFriends, storedJoined))
    } catch {}
  }, [])

  const handleShare = () => {
    setJoined((j) => {
      const next = Math.min(goalFriends, j + 1)
      try {
        localStorage.setItem('tripjar.referrals.joinedCount', String(next))
        localStorage.setItem('tripjar.referralEarnings', String(next * 50))
        window.dispatchEvent(new Event('tripjar:dataUpdated'))
      } catch {}
      return next
    })
    setBurstCount((n) => n + 1)
  }

  // Keep localStorage and other screens in sync with joined -> referral earnings
  useEffect(() => {
    try {
      localStorage.setItem('tripjar.referrals.joinedCount', String(joined))
      localStorage.setItem('tripjar.referralEarnings', String(joined * 50))
      window.dispatchEvent(new Event('tripjar:dataUpdated'))
    } catch {}
  }, [joined])

  const shareMessage = `Hey! Join me on Pack Your Bags 🎉\nUse my referral code ${code} to get ₹100 welcome bonus. I earn ₹200 when 3 friends join. Let’s save together!`

  const shareWhatsApp = () => {
    handleShare()
    const url = 'https://wa.me/?text=' + encodeURIComponent(shareMessage)
    window.open(url, '_blank')
  }

  const shareInstagram = () => {
    handleShare()
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareMessage).then(() => {
        setCopiedMsg(true)
        setTimeout(() => setCopiedMsg(false), 1500)
        window.open('https://www.instagram.com/', '_blank')
      })
    } else {
      window.open('https://www.instagram.com/', '_blank')
    }
  }

  const copyCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 1500)
      })
    }
  }

  const arjunJoined = joined >= 2

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="px-5 pt-6">
        <div className="card p-5 slide-up">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Earn Rewards 💰</h1>
            <NavLink to="/" className="card px-3 py-1 text-sm">Back</NavLink>
          </div>
          <div className="mt-3 flex flex-col items-center text-center gap-2">
            <div className="text-xl font-bold">Earn ₹200 by inviting 3 friends!</div>
            <div className="text-sm text-slate-600">Current earnings: <span className="font-semibold">₹{earnings.toLocaleString('en-IN')}</span></div>
            <div className="w-full flex justify-end">
              <button onClick={handleShare} className="bounce-soft bg-orange-gradient text-white rounded-full px-4 py-2 shadow-soft inline-flex items-center gap-2">
                <span className="text-lg">📤</span>
                <span className="font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-5 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '📤', title: 'Share your code' },
            { icon: '👥', title: 'Friend joins' },
            { icon: '💵', title: 'Earn money' },
          ].map((s, i) => (
            <div key={i} className="card p-4 slide-up flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky to-mint flex items-center justify-center text-xl">{s.icon}</div>
              <div className="font-medium text-slate-700">{i + 1}. {s.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral card */}
      <section className="px-5 mt-6">
        <div className="card p-5 slide-up border-2" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Your code</div>
            <div className="flex items-center gap-2">
              <button onClick={shareWhatsApp} aria-label="Share on WhatsApp" title="Share on WhatsApp" className="bounce-soft rounded-full h-10 w-10 flex items-center justify-center shadow-soft" style={{ backgroundColor: '#25D366' }}>
                <img alt="WhatsApp" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" className="w-5 h-5 filter invert" />
              </button>
              <button onClick={shareInstagram} aria-label="Share on Instagram" title="Share on Instagram" className="bounce-soft rounded-full h-10 w-10 flex items-center justify-center shadow-soft bg-gradient-to-br from-pink-500 via-orange-400 to-purple-500">
                <img alt="Instagram" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" className="w-5 h-5 filter invert" />
              </button>
            </div>
          </div>
          <button onClick={copyCode} className="mt-2 w-full text-left">
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white">
              <div className="text-2xl font-bold tracking-wide">{code}</div>
              <div className="mt-1 text-xs text-slate-500">Tap to copy referral code</div>
            </div>
          </button>
          {copiedCode && <div className="mt-2 text-xs text-teal">Copied!</div>}
          {copiedMsg && <div className="mt-2 text-xs text-teal">Draft copied for Instagram</div>}

          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-700 mb-2">History</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span className="text-sm">Priya joined — ₹50 earned</span>
                </div>
                <span className="text-xs text-slate-500">1d ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{arjunJoined ? '✅' : '⏳'}</span>
                  <span className="text-sm">Arjun {arjunJoined ? 'joined — ₹50 earned' : 'pending'}</span>
                </div>
                <span className="text-xs text-slate-500">pending</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer incentive */}
      <section className="px-5 mt-6">
        <div className="card p-4 slide-up bg-white">
          <div className="text-sm text-slate-700">Invite {Math.max(0, goalFriends - joined)} more to unlock ₹200!</div>
          <div className="text-xs text-teal mt-1">Your friends get ₹100 welcome bonus!</div>
        </div>
      </section>

      {/* Confetti overlay when sharing */}
      <ConfettiBurst trigger={burstCount} />
      <BottomNav />
    </div>
  )
}
