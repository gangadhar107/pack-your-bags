import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import CreateGoal from './CreateGoal'
import PlanTrip from './PlanTrip'
import GoaGroup from './GoaGroup'
import EarnRewards from './EarnRewards'
import BottomNav from './BottomNav'
import Onboarding from './Onboarding'
import Groups from './Groups'
import Profile from './Profile'
import AutoPaySettings from './AutoPaySettings'
import SupportHelp from './SupportHelp'
import GoalDetail from './GoalDetail'
import AddMoneyPage from './AddMoneyPage'

// Shared goals data used by both the summary and goals list
const goalsData = [
  { title: 'Goa Trip 2026', current: 3000, total: 15000, autopay: { amount: 500 } },
  { title: 'Ladakh 2026', current: 20000, total: 25000 },
]

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
  const deg = useMemo(() => `${percent * 3.6}deg`, [percent])
  return (
    <div className="ring" style={{ ['--ring-color']: color, ['--ring-deg']: deg }}>
      {label && (
        <div className="ring-inner">
          <div className="text-center">
            <div className="text-[10px] text-slate-500">Target</div>
            <div className="text-xs font-semibold">{label}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompletionDonut({ goals = [], saved = 0, target = 1, size = 96, thickness = 22 }) {
  const [showTip, setShowTip] = useState(false)
  const palette = ['#22c55e', '#38bdf8', '#f59e0b', '#a78bfa', '#ef4444', '#10b981', '#6366f1']
  const percent = Math.max(0, Math.min(100, Math.round((saved / (target || 1)) * 100)))
  const values = goals.map(g => Math.max(0, g.current || 0))
  const totalCurrent = values.reduce((a, b) => a + b, 0) || 1
  const colorFor = (name, i) => {
    if (!name) return palette[i % palette.length]
    let h = 0
    for (let c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
    return palette[h % palette.length]
  }
  let acc = 0
  const portionEnd = percent
  const coloredStops = values.map((v, i) => {
    const start = (acc / totalCurrent) * portionEnd
    acc += v
    const end = (acc / totalCurrent) * portionEnd
    const color = colorFor(goals[i]?.title, i)
    return `${color} ${start}% ${end}%`
  }).join(', ')
  const remainderColor = '#e2e8f0'
  const gradient = `conic-gradient(${coloredStops}${coloredStops ? ', ' : ''}${remainderColor} ${portionEnd}% 100%)`
  const style = { width: size, height: size, borderRadius: '50%', background: gradient }
  const holeSize = size - thickness * 2
  return (
    <div className="relative inline-block" aria-label="Total savings donut" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      <div className="relative">
        <div style={style} className="shadow-soft rounded-full" />
        <div style={{ width: holeSize, height: holeSize }} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 border border-white/60" />
      </div>
      {showTip && (
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-30 card p-3 w-[220px] text-sm">
          <div className="font-semibold">Total Savings</div>
          <div className="text-slate-600">₹{saved.toLocaleString('en-IN')} of ₹{target.toLocaleString('en-IN')} • {percent}%</div>
          <div className="mt-2 grid gap-1">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: palette[i % palette.length] }} />
                  <span className="text-slate-700">{g.title}</span>
                </div>
                <span className="text-slate-600">₹{(g.current || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressBar({ percent = 0, color = '#22c55e' }) {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (el) {
      // trigger animation after mount
      requestAnimationFrame(() => {
        el.style.width = `${percent}%`
      })
    }
  }, [percent])
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div ref={barRef} className="progress-fill h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

function Header({ onOpenStreak, streakCount = 0 }) {
  const navigate = useNavigate()
  return (
    <header className="px-5 pt-6">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-mint via-teal to-sky shadow-soft">
        <div className="flex items-center justify-between">
          {/* Left: Title and subtitle */}
          <div className="slide-up">
            <h1 className="text-xl font-semibold text-slate-900">Hi Gangadhar 👋</h1>
            <p className="text-slate-700 text-sm">Let’s reach your goal faster today!</p>
          </div>
          {/* Right: Buttons and avatar */}
          <div className="flex items-center gap-3 slide-up">
            {/* Referral earnings */}
            <button
              onClick={() => navigate('/earn')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-mint to-white text-slate-800 shadow-soft hover:translate-y-[-1px] transition-transform"
              aria-label="Referral earnings"
            >
              <span>💰</span>
              <span className="font-semibold">₹150</span>
            </button>
            {/* Streak button */}
            <button
              onClick={() => (typeof onOpenStreak === 'function' ? onOpenStreak() : navigate('/?streak=1'))}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-orange to-coral text-white shadow-soft hover:shadow-lg transition-all"
              aria-label="Savings streak"
            >
              <span>🔥</span>
              <span className="font-semibold">{streakCount} Days</span>
            </button>
            {/* Avatar */}
            <button onClick={() => navigate('/profile')} aria-label="Profile" className="inline-block">
              <img alt="Profile" src="https://api.dicebear.com/9.x/initials/svg?seed=G" className="w-9 h-9 rounded-full shadow-soft hover:translate-y-[-1px] transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function SavingsSummary({ goals }) {
  const navigate = useNavigate()
  const sumSaved = goals.reduce((acc, g) => acc + (g.current || 0), 0)
  const amount = useCountUp(sumSaved, 1200)
  const targetTotal = goals.reduce((acc, g) => acc + (g.total || 0), 0)
  const percent = Math.round((amount / (targetTotal || 1)) * 100)
  return (
    <section className="px-5 mt-5">
      <div className="card slide-up">
        <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
        <div className="p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <h2 className="text-sm text-slate-600 font-medium">Total Savings</h2>
            <div className="text-3xl font-bold bg-gradient-to-r from-teal to-sky bg-clip-text text-transparent">₹{amount.toLocaleString('en-IN')}</div>
          </div>
          <div className="justify-self-center">
            <div className="relative w-[96px] h-[96px]">
              <CompletionDonut goals={goals} saved={amount} target={targetTotal} size={96} thickness={22} />
              <div className="absolute inset-0 z-10 flex items-center justify-center text-[11px] font-semibold text-slate-800 text-center leading-tight px-1">
                ₹{targetTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/add-money')} className="justify-self-end bounce-soft bg-orange-gradient text-white rounded-full px-4 py-2 shadow-soft inline-flex items-center gap-2">
            <span className="text-lg">➕</span>
            <span className="font-semibold">Add Money</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function GoalCard({ title, current, total, percent, autopay, imageSrc, interactiveTip, emoji }) {
  const [tipOpen, setTipOpen] = useState(false)
  const showImage = Boolean(imageSrc)
  const summaryText = `Saved ₹${current.toLocaleString('en-IN')} / ₹${total.toLocaleString('en-IN')} (${percent}%) · Next AutoPay: ₹${autopay?.amount || 0} on Wed`
  const barColor = '#38bdf8'

  return (
    <div className={`card slide-up relative overflow-hidden rounded-xl ${showImage ? '' : 'p-4'} h-[21rem] group`}
         onClick={(e) => {
           if (interactiveTip) { e.preventDefault(); e.stopPropagation(); setTipOpen(v => !v) }
         }}>
      {showImage && (
        <>
          {/* Top: Image area */}
          <div className="relative h-[13.5rem]">
            <img
              src={imageSrc}
              alt="Goa Beach Shack"
              className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:brightness-105"
              width={800}
              height={500}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            {/* Fallback gradient if image missing */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-sky/20 to-indigo/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/35" />
          </div>

          {/* Bottom: Info area */}
          <div className="relative z-10 px-4 py-3 bg-white flex items-center justify-between h-28">
            {/* Left text */}
            <div className="flex-1 min-w-0 pr-3">
              <div className="font-semibold truncate">{title} {emoji || ''}</div>
              <div className="mt-1 text-sm text-slate-700">Saved: ₹{current.toLocaleString('en-IN')}</div>
              <div className="mt-2 flex items-center gap-2">
                {autopay && (
                  <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal ring-1 ring-teal/30">
                    <span className="font-medium">AutoPay</span>
                    <span>₹{autopay.amount}/week 🔁</span>
                  </div>
                )}
                <button
                  className="text-xs px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Withdraw coming soon') }}
                >
                  Withdraw
                </button>
              </div>
            </div>
            {/* Right donut with center label */}
            <div className="ml-3 shrink-0 relative w-[72px] h-[72px]">
              <CompletionDonut goals={[{ title, current }]} saved={current} target={total} size={72} thickness={12} />
              <div className="absolute inset-0 z-10 flex items-center justify-center text-[11px] font-semibold text-slate-800 text-center leading-tight px-1">
                ₹{total.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Tap tooltip */}
          {interactiveTip && tipOpen && (
            <div className="absolute -top-24 left-4 z-20 card p-3 w-[260px] text-sm text-slate-800">
              {summaryText}
            </div>
          )}
        </>
      )}

      {!showImage && (
        <>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky to-mint flex items-center justify-center text-xl">🏷️</div>
              <div className="flex-1">
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-slate-600">₹{current.toLocaleString('en-IN')} / ₹{total.toLocaleString('en-IN')}</div>
              </div>
              <div className="w-16 text-right font-semibold text-slate-700">{percent}%</div>
            </div>
            <div className="mt-3">
              <ProgressBar percent={percent} color={barColor} />
            </div>
            {autopay && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal">
                <span className="font-medium">AutoPay:</span>
                <span>₹{autopay.amount}/week 🔁</span>
              </div>
            )}
            <div className="mt-3">
              <button
                className="text-xs px-3 py-1 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Withdraw coming soon') }}
              >
                Withdraw
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ActiveGoals({ goals }) {
  return (
    <section className="px-5 mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-2 slide-up">Active Goals</h3>
      <div className="grid gap-3">
        {goals.map((g, idx) => {
          const percent = Math.round((g.current / (g.total || 1)) * 100)
          if (g.title === 'Goa Trip 2026') {
            // Special card with image, tooltip on tap
            return (
              <div key={idx} className="w-full">
                <GoalCard
                  title={g.title}
                  current={g.current}
                  total={g.total}
                  percent={percent}
                  autopay={g.autopay}
                  imageSrc={`${import.meta.env.BASE_URL}assets/goa-shack.png`}
                  emoji="🏖️"
                  interactiveTip
                />
              </div>
            )
          }
          if (g.title === 'Ladakh 2026') {
            return (
              <div key={idx} className="w-full">
                <GoalCard
                  title={g.title}
                  current={g.current}
                  total={g.total}
                  percent={percent}
                  imageSrc={`${import.meta.env.BASE_URL}assets/Ladakh.jpg`}
                  emoji="🏍️"
                />
              </div>
            )
          }
          return (
            <NavLink key={idx} to="/goal-detail" className="w-full">
              <GoalCard
                title={g.title}
                current={g.current}
                total={g.total}
                percent={percent}
                autopay={g.autopay}
              />
            </NavLink>
          )
        })}
      </div>
    </section>
  )
}

function TripGroupCard() {
  return (
    <section className="px-5 mt-6">
      <div className="card p-4 slide-up">
        <div className="accent-bar bg-gradient-to-r from-sky to-teal" />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h3 className="font-semibold">Goa Squad 🏖️</h3>
            <p className="text-sm text-slate-600">Combined: ₹12,500 / ₹60,000</p>
          </div>
          <div className="flex -space-x-2">
            {["A","B","C","D"].map((n, i) => (
              <img key={i} alt={`Member ${i+1}`} src={`https://api.dicebear.com/9.x/initials/svg?seed=${n}`} className="w-8 h-8 rounded-full border border-white shadow-soft" />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <NavLink to="/groups/goa-squad" className="bounce-soft bg-teal-sky text-white rounded-full px-4 py-2 shadow-soft">View Group</NavLink>
          <span className="text-xl" title="Group streaks">🎊</span>
        </div>
      </div>
    </section>
  )
}

// Removed old bottom chips per new design


function StreakCalendar({ open, onClose, today, streakDays = [], randomFireSet = new Set() }) {
  const navigate = useNavigate()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [slideDir, setSlideDir] = useState('none') // 'left' | 'right' | 'none'

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startWeekday = new Date(viewYear, viewMonth, 1).getDay() // 0-6
  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const formatISO = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }
  const isToday = (d) => d != null && viewYear === today.getFullYear() && viewMonth === today.getMonth() && d === today.getDate()
  const isFuture = (d) => {
    if (d == null) return false
    const date = new Date(viewYear, viewMonth, d)
    return date > today
  }
  const isStreakDay = (d) => {
    if (d == null) return false
    const key = formatISO(viewYear, viewMonth, d)
    return streakDays.includes(key)
  }
  const isRandomFire = (d) => {
    if (d == null) return false
    const key = formatISO(viewYear, viewMonth, d)
    return randomFireSet.has(key)
  }
  const tooltip = (d) => {
    if (d == null) return ''
    return isStreakDay(d) ? 'Saved ₹100 💰' : isRandomFire(d) ? 'Old saving day 🔥' : 'No savings logged'
  }

  const canGoNext = () => {
    const cur = today.getFullYear() * 12 + today.getMonth()
    const view = viewYear * 12 + viewMonth
    return view < cur
  }
  const goPrev = () => {
    setSlideDir('left')
    setTimeout(() => setSlideDir('none'), 300)
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11 }
      return m - 1
    })
  }
  const goNext = () => {
    if (!canGoNext()) return
    setSlideDir('right')
    setTimeout(() => setSlideDir('none'), 300)
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0 }
      return m + 1
    })
  }
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex items-end sm:items-center justify-center bg-gradient-to-br from-slate-900/80 to-indigo-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:w-[640px] m-0 sm:m-6 rounded-2xl shadow-2xl bg-white/40 border border-white/50 p-5 sm:p-6 text-white max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Savings Streak 🔥</h2>
            <p className="text-sm text-white/80">Keep your streak alive by saving daily!</p>
          </div>
          <button aria-label="Close" onClick={onClose} className="card p-2 bg-white/10">✖</button>
        </div>
        {/* Month header */}
        <div className="mt-4 flex items-center justify-between">
          <button onClick={goPrev} className="card px-2 py-1 bg-white/10">‹</button>
          <div className="font-semibold">{new Date(viewYear, viewMonth, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</div>
          <button onClick={goNext} disabled={!canGoNext()} className="card px-2 py-1 bg-white/10 disabled:opacity-40">›</button>
        </div>
        {/* Calendar grid */}
        <div className={`mt-3 grid grid-cols-7 gap-3 p-4 rounded-xl bg-white/5 shadow-xl transition-transform duration-300 ${slideDir === 'left' ? '-translate-x-2' : slideDir === 'right' ? 'translate-x-2' : ''}`}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((w) => (
            <div key={w} className="text-xs text-white/70 text-center">{w}</div>
          ))}
          {cells.map((d, i) => {
            const base = 'w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium relative'
            const styles = isToday(d)
              ? 'border-2 border-orange-400 animate-pulse'
              : isStreakDay(d)
                ? 'bg-gradient-to-tr from-orange-400 to-pink-400 text-white shadow-sm'
                : isRandomFire(d)
                  ? 'bg-gradient-to-tr from-yellow-300 to-orange-400 text-white shadow-sm'
                  : isFuture(d)
                    ? 'text-gray-300 opacity-60'
                    : 'text-gray-400'
            return (
              <div key={i} className={`${base} ${styles}`} title={tooltip(d)}>
                {d != null && (isStreakDay(d) || isRandomFire(d)) ? (
                  <span className="animate-flicker">🔥</span>
                ) : (
                  <span>{d ?? ''}</span>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 text-sm text-white/80">Keep your streak going 💪</div>
        <div className="mt-2 text-xs text-white/60">Your current streak: {streakDays.length} days 🔥 since 25 Oct 2025</div>
        <div className="mt-3">
          <button onClick={() => navigate('/add-money')} className="bounce-soft bg-gradient-to-r from-orange-400 to-teal text-white rounded-full px-4 py-2 shadow-soft font-semibold">Add ₹100 Now</button>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [localGroups, setLocalGroups] = useState([])
  const [userGoals, setUserGoals] = useState([])
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tripjar.groups') || '[]')
      setLocalGroups(Array.isArray(stored) ? stored : [])
    } catch {}
  }, [])
  useEffect(() => {
    try {
      const storedGoals = JSON.parse(localStorage.getItem('tripjar.userGoals') || '[]')
      setUserGoals(Array.isArray(storedGoals) ? storedGoals : [])
    } catch {}
  }, [])

  const goals = useMemo(() => {
    const groupGoals = localGroups.map(g => ({ title: g.name, current: g.current || 0, total: g.target || 0 }))
    const userGoalCards = userGoals.map(g => ({
      title: g.title,
      current: g.current || 0,
      total: g.total || 0,
      autopay: g.autoPay ? { amount: g.intervalAmount || 0 } : undefined,
    }))
    return [...goalsData, ...groupGoals, ...userGoalCards]
  }, [localGroups, userGoals])
  const [streakOpen, setStreakOpen] = useState(false)
  const location = useLocation()
  // Base parameters per spec
  const demoToday = new Date('2025-11-05')
  const streakStart = new Date('2025-10-25')
  const [today, setToday] = useState(demoToday)

  // Helpers
  const formatISO = (d) => d.toISOString().split('T')[0]
  const generateRandomFireDays = (startDate, endDate) => {
    const result = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    while (start <= end) {
      if (Math.random() < 0.25) result.push(start.toISOString().split('T')[0])
      start.setDate(start.getDate() + 1)
    }
    return result
  }

  // Continuous streak: all days between streakStart and today
  const streakDays = useMemo(() => {
    const out = []
    const d = new Date(streakStart)
    while (d <= today) {
      out.push(formatISO(d))
      d.setDate(d.getDate() + 1)
    }
    return out
  }, [today])

  // Random historical fires before streakStart (persisted)
  const [randomFireSet, setRandomFireSet] = useState(new Set())
  useEffect(() => {
    const key = 'streakRandom:2025-10'
    const saved = localStorage.getItem(key)
    if (saved) {
      setRandomFireSet(new Set(JSON.parse(saved)))
    } else {
      const rnd = generateRandomFireDays('2025-10-01', '2025-10-24')
      localStorage.setItem(key, JSON.stringify(rnd))
      setRandomFireSet(new Set(rnd))
    }
  }, [])

  // Auto-update daily at midnight
  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0)
    const timer = setTimeout(() => {
      setToday((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1))
    }, nextMidnight - now)
    return () => clearTimeout(timer)
  }, [today])

  // Open modal when arriving with query param (e.g., from other pages)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('streak') === '1') {
      setStreakOpen(true)
    }
  }, [location.search])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (streakOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [streakOpen])
  return (
    <div className="min-h-screen pb-24">
      <Header onOpenStreak={() => setStreakOpen(true)} streakCount={streakDays.length} />
      <SavingsSummary goals={goals} />
      <ActiveGoals goals={goals} />
      <TripGroupCard />
      <BottomNav goals={goals} />
      {streakOpen && (
        <StreakCalendar open={true} onClose={() => setStreakOpen(false)} today={today} streakDays={streakDays} randomFireSet={randomFireSet} />
      )}
    </div>
  )
}

function GroupsPage() {
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <section className="px-5 mt-6">
        <div className="card p-6 slide-up">
          <h2 className="text-lg font-semibold">Groups</h2>
          <p className="text-slate-600">Group management coming soon.</p>
        </div>
      </section>
      <BottomNav />
    </div>
  )
}

function EarnPage() {
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <section className="px-5 mt-6">
        <div className="card p-6 slide-up">
          <h2 className="text-lg font-semibold">Earn</h2>
          <p className="text-slate-600">Rewards and referrals coming soon.</p>
        </div>
      </section>
      <BottomNav />
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <section className="px-5 mt-6">
        <div className="card p-6 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 grid gap-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Settings</h3>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="flex items-center justify-between"><span>Notifications</span><input type="checkbox" defaultChecked /></label>
                <label className="flex items-center justify-between"><span>Show referral badge</span><input type="checkbox" defaultChecked /></label>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">AutoPay history</h3>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex items-center justify-between"><span>₹500 • Goa Trip</span><span className="text-slate-500">2d ago</span></div>
                <div className="flex items-center justify-between"><span>₹500 • Goa Trip</span><span className="text-slate-500">9d ago</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/goa-squad" element={<GoaGroup goals={goalsData} />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/earn" element={<EarnRewards />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/autopay" element={<AutoPaySettings />} />
      <Route path="/profile/help" element={<SupportHelp />} />
      <Route path="/create-goal" element={<CreateGoal />} />
      <Route path="/plan-trip" element={<PlanTrip />} />
      <Route path="/goal-detail" element={<GoalDetail goals={goalsData} />} />
      <Route path="/add-money" element={<AddMoneyPage goals={goalsData} />} />
    </Routes>
  )
}
