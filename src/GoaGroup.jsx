import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'

function ProgressBar({ percent = 0, color = '#38bdf8' }) {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (el) requestAnimationFrame(() => { el.style.width = `${Math.min(100, Math.max(0, percent))}%` })
  }, [percent])
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div ref={barRef} className="progress-fill h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

function useCountUp(target = 0, durationMs = 900) {
  const [value, setValue] = useState(target)
  useEffect(() => {
    let start = performance.now()
    const initial = value
    const delta = target - initial
    const anim = () => {
      const now = performance.now()
      const p = Math.min(1, (now - start) / durationMs)
      setValue(Math.round(initial + delta * p))
      if (p < 1) requestAnimationFrame(anim)
    }
    requestAnimationFrame(anim)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return value
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

function MemberCard({ name, saved, total, emoji, note, accent }) {
  const percent = Math.round((saved / Math.max(1, total)) * 100)
  return (
    <div className={`card p-4 slide-up border border-transparent`} style={{ borderColor: accent }}>
      <div className="flex items-center gap-3">
        <img alt={name} src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`} className="w-10 h-10 rounded-xl shadow-soft" />
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-1">
            <span>{name}</span>
            {emoji && <span className="text-lg">{emoji}</span>}
          </div>
          <div className="text-sm text-slate-600">₹{saved.toLocaleString('en-IN')} saved</div>
        </div>
        <div className="text-sm font-semibold text-slate-700">{percent}%</div>
      </div>
      <div className="mt-3">
        <ProgressBar percent={percent} color={accent} />
      </div>
      {note && <div className="mt-2 text-xs text-slate-500">{note}</div>}
    </div>
  )
}

export default function GoaGroup({ goals = [] }) {
  const navigate = useNavigate()
  const [combinedCurrent, setCombinedCurrent] = useState(12500)
  const combinedTarget = 60000
  const percent = useMemo(() => Math.round((combinedCurrent / combinedTarget) * 100), [combinedCurrent, combinedTarget])
  // Contribution segments for multi-color donut
  const contributions = [
    { name: 'Gangadhar', amount: 3500, color: '#facc15' },
    { name: 'Arjun', amount: 3200, color: '#38bdf8' },
    { name: 'Priya', amount: 3100, color: '#14b8a6' },
    { name: 'Rahul', amount: 2700, color: '#a78bfa' },
  ]
  const donutBackground = useMemo(() => {
    let acc = 0
    const segments = contributions.map(c => {
      const seg = (c.amount / combinedTarget) * 360
      const start = acc
      const end = acc + seg
      acc = end
      return `${c.color} ${start}deg ${end}deg`
    })
    segments.push(`#e5e7eb ${acc}deg 360deg`)
    return `conic-gradient(${segments.join(', ')})`
  }, [combinedTarget])
  const animatedCurrent = useCountUp(combinedCurrent, 900)

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Goa Squad 🏖️</h1>
      </header>

      {/* Top Card */}
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-3">
            {/* Left: Combined amount */}
            <div>
              <div className="text-sm text-slate-600">Combined</div>
              <div className="text-2xl font-bold">₹{animatedCurrent.toLocaleString('en-IN')} / ₹{combinedTarget.toLocaleString('en-IN')}</div>
              <div className="mt-1 text-xs text-slate-600">Days left: <span className="font-semibold">45</span></div>
              <div className="mt-1 text-xs text-teal">Next ₹500 auto-saves in 2 days</div>
            </div>
            {/* Middle: Destination */}
            <div className="justify-self-center text-center">
              <div className="text-xs text-slate-500">Destination</div>
              <div className="text-sm font-semibold">Goa</div>
            </div>
            {/* Right: Multi-color donut chart */}
            <div className="justify-self-end">
              <div className="ring" style={{ background: donutBackground }}>
                <div className="ring-inner">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500">Progress</div>
                    <div className="text-xs font-semibold">{percent}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Leaderboard</h2>
        <div className="grid gap-3">
          <MemberCard name="Gangadhar" saved={3500} total={15000} emoji="🥇" note="" accent="#facc15" />
          <MemberCard name="Arjun" saved={3200} total={15000} accent="#38bdf8" />
          <MemberCard name="Priya" saved={3100} total={15000} accent="#14b8a6" />
          <MemberCard name="Rahul" saved={2700} total={15000} emoji="😴" note="No save in 7 days" accent="#a78bfa" />
        </div>
      </section>

      {/* Activity feed */}
      <section className="px-5 mt-6">
        <div className="card p-4 slide-up">
          <div className="accent-bar bg-gradient-to-r from-orange to-teal" />
          <div className="pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>💸</span>
                <span className="text-sm">Gangadhar added ₹500</span>
              </div>
              <span className="text-xs text-slate-500">2h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🎉</span>
                <span className="text-sm">Priya invited 2 friends</span>
              </div>
              <span className="text-xs text-slate-500">3d ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating actions pinned bottom-left and bottom-right: icon-only by default, expand label on hover */}
      {/* Removed non-functional Group Chat icon */}
      <div className="fixed bottom-20 right-4 z-40 group">
        <button onClick={() => navigate('/add-money')} className="bounce-soft bg-orange-gradient text-white rounded-full h-12 px-3 shadow-soft inline-flex items-center gap-2 transition-all">
          <span className="text-xl">➕</span>
          <span className="text-sm font-semibold overflow-hidden max-w-0 opacity-0 transition-all duration-200 group-hover:max-w-[180px] group-hover:opacity-100">Add to Group Savings</span>
        </button>
      </div>
      <BottomNav />
    </div>
  )
}
