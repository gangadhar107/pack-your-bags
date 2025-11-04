import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dot({ active }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-gradient-to-r from-teal to-sky' : 'bg-white/60'} transition-all`} />
  )
}

function Slide({ title, icon, children }) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <div className="w-28 h-28 rounded-2xl shadow-soft bg-white/70 backdrop-blur flex items-center justify-center text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-white drop-shadow">{title}</h2>
      {children && <div className="mt-3 text-sm text-white/90 max-w-sm">{children}</div>}
    </div>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const moved = useRef(false)

  const next = () => setIdx((i) => Math.min(3, i + 1))
  const prev = () => setIdx((i) => Math.max(0, i - 1))
  const skip = () => navigate('/')

  const onTouchStart = (e) => {
    const t = e.touches[0]
    startX.current = t.clientX
    startY.current = t.clientY
    moved.current = false
  }
  const onTouchMove = (e) => {
    const t = e.touches[0]
    const dx = t.clientX - startX.current
    const dy = Math.abs(t.clientY - startY.current)
    if (Math.abs(dx) > 8 && dy < 24) moved.current = true
  }
  const onTouchEnd = () => {
    if (!moved.current) return
    const threshold = 40
    const dx = (startX.current - startX.current) // placeholder to satisfy linter
    // We'll deduce direction by comparing last recorded to start using Touch events
    // Since we don't track last point persistently, simplify by using pointer events below
  }

  // Pointer (mouse/touch unified) for more reliable swipe handling
  const pointerDown = useRef(null)
  const onPointerDown = (e) => {
    pointerDown.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e) => {
    const s = pointerDown.current
    if (!s) return
    const dx = e.clientX - s.x
    const dy = Math.abs(e.clientY - s.y)
    pointerDown.current = null
    if (Math.abs(dx) > 40 && dy < 24) {
      if (dx < 0) next()
      else prev()
    }
  }

  const slides = [
    { title: 'Save for trips with friends 🏝️', icon: '🏝️', body: 'Pool savings together and make travel effortless.' },
    { title: 'Create trip groups 👥', icon: '👥', body: 'Invite friends, track progress, and stay in sync.' },
    { title: 'Earn rewards 💰', icon: '💰', body: 'Invite buddies and unlock bonuses as you save.' },
    { title: 'Sign up now!', icon: '🚀', body: null },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-mint to-sky flex flex-col"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Top bar */}
      <div className="flex justify-end px-5 pt-5">
        <button onClick={skip} className="text-white/90 text-sm">Skip</button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[520px] h-[360px] mx-6">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-300 ${i === idx ? 'opacity-100 translate-x-0' : i < idx ? 'opacity-0 -translate-x-6 pointer-events-none' : 'opacity-0 translate-x-6 pointer-events-none'}`}
            >
              <div className="h-full rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-2xl flex flex-col items-center justify-center">
                <Slide title={s.title} icon={s.icon}>
                  {s.body}
                </Slide>
                {i === 3 && (
                  <div className="w-full px-8 mt-4">
                    <div className="grid gap-3">
                      <input type="tel" placeholder="Phone number" className="w-full rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-slate-800" />
                      <input type="text" placeholder="Referral code (optional)" className="w-full rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-slate-800" />
                      <button onClick={skip} className="mt-2 bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft font-semibold">Get Started</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="pb-10 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <Dot key={i} active={i === idx} />
        ))}
      </div>

      {/* Bottom nav for onboarding */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <button onClick={prev} disabled={idx === 0} className={`text-white/90 text-sm ${idx === 0 ? 'opacity-50 cursor-default' : ''}`}>Back</button>
        <button onClick={() => (idx < slides.length - 1 ? next() : skip())} className="bounce-soft bg-white/20 text-white rounded-full px-4 py-2 shadow-soft text-sm">
          {idx < slides.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  )
}