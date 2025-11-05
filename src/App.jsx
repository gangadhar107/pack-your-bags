import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
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
import GrowthAnalytics from './GrowthAnalytics'
import StreakCalendar from './StreakCalendar'

// Shared goals data used by both the summary and goals list
const goalsData = [
  { title: 'Goa Trip 2024', current: 3000, total: 15000, autopay: { amount: 500 } },
  { title: 'New Phone', current: 240, total: 25000 },
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

function Header({ onShowStreak }) {
  return (
    <header className="flex items-start justify-between px-5 pt-6">
      <div className="slide-up">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-teal to-sky bg-clip-text text-transparent">Hi Gangadhar 👋</h1>
        <p className="text-slate-600 text-sm">Let’s reach your goal faster today!</p>
        <button onClick={onShowStreak} className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/60 shadow-sm hover:shadow-md transition active:scale-[0.98]">
          <span>🔥</span>
          <span className="text-sm">12-day Streak</span>
        </button>
      </div>
      <div className="flex items-center gap-3 slide-up">
        <button aria-label="Notifications" className="card p-2 bounce-soft">
          <span className="text-xl">🔔</span>
        </button>
        <img alt="Profile" src="https://api.dicebear.com/9.x/initials/svg?seed=G" className="w-9 h-9 rounded-full shadow-soft" />
      </div>
    </header>
  )
}

function SavingsSummary({ goals }) {
  const navigate = useNavigate()
  const amount = useCountUp(3240, 1200)
  const [tip, setTip] = useState(null)
  const segments = goals.map(g => g.current)
  const totalSaved = segments.reduce((a,b)=>a+b,0) || 1
  const s1 = Math.round((segments[0] / totalSaved) * 360)
  const s2 = 360 - s1
  const bgStyle = {
    background: `conic-gradient(#00C6AE 0deg ${s1}deg, #FF8F6C ${s1}deg 360deg)`,
  }
  const showTip = (idx) => {
    const g = goals[idx]
    setTip({
      title: g.title,
      saved: g.current,
      total: g.total,
      percent: Math.round((g.current / (g.total || 1)) * 100),
      next: g.autopay?.amount ? `Next AutoPay ₹${g.autopay.amount} on Wed` : 'Manual Save',
    })
  }
  return (
    <section className="px-5 mt-5">
      <div className="card slide-up">
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative w-36 h-36 rounded-full shadow-md bg-white/60">
              <div className="absolute inset-0 m-2 rounded-full" style={bgStyle}>
                <div className="absolute inset-0 m-8 rounded-full bg-white/70" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">₹{amount.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-slate-600">Total Savings</div>
                </div>
              </div>
              <button onClick={()=>showTip(0)} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" aria-label="Goa Trip segment" />
              <button onClick={()=>showTip(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" aria-label="Solo Trip segment" />
              {tip && (
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[200px] rounded-xl bg-white/90 shadow-md p-3 animate-[slide-up_200ms_ease,fadeIn_200ms_ease]">
                  <div className="font-semibold text-sm">{tip.title}</div>
                  <div className="text-xs text-slate-600">Saved ₹{tip.saved.toLocaleString('en-IN')} / ₹{tip.total.toLocaleString('en-IN')} ({tip.percent}%)</div>
                  <div className="text-xs mt-1">{tip.next}</div>
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-sm bg-[#00C6AE]" /> Goa Trip</div>
              <div className="inline-flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-sm bg-[#FF8F6C]" /> Solo Trip</div>
            </div>
          </div>
          <div className="justify-self-end">
            <button onClick={() => navigate('/add-money')} className="bounce-soft bg-gradient-to-r from-orange-400 to-teal-500 text-white rounded-full px-4 py-2 shadow-md inline-flex items-center gap-2 hover:shadow-lg transition">
              <span className="text-lg">➕</span>
              <span className="font-semibold">Add Money</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function GoalCard({ title, current, total, percent, autopay }) {
  return (
    <div className="min-w-[86%] sm:min-w-[300px] card p-4 slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky to-mint flex items-center justify-center text-xl">🏷️</div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-600">₹{current.toLocaleString('en-IN')} / ₹{total.toLocaleString('en-IN')}</div>
        </div>
        <div className="w-16 text-right font-semibold text-slate-700">{percent}%</div>
      </div>
      <div className="mt-3">
        <ProgressBar percent={percent} color="#38bdf8" />
      </div>
      {autopay && (
        <div className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal">
          <span className="font-medium">AutoPay:</span>
          <span>₹{autopay.amount}/week 🔁</span>
        </div>
      )}
    </div>
  )
}

function ActiveGoals({ goals }) {
  return (
    <section className="px-5 mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-2 slide-up">Active Goals ✈️</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g, idx) => (
          <NavLink key={idx} to="/goal-detail" className="block">
            <div className="h-[180px] rounded-xl bg-white/70 backdrop-blur-md shadow-md p-4 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{g.title}</div>
                <div className="text-sm text-slate-600">₹{g.current.toLocaleString('en-IN')} / ₹{g.total.toLocaleString('en-IN')}</div>
              </div>
              <div className="mt-3">
                <ProgressBar percent={Math.round((g.current / (g.total || 1)) * 100)} color="#38bdf8" />
              </div>
              <div className="mt-3">
                {g.autopay?.amount ? (
                  <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal">AutoPay ₹{g.autopay.amount}/week 🔁</span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600">Manual Save</span>
                )}
                {g.autopay?.amount && (
                  <div className="text-xs text-slate-500 mt-1">Next AutoPay on Wed</div>
                )}
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

function TripGroupCard() {
  return (
    <section className="px-5 mt-6">
      <div className="rounded-xl bg-white/70 shadow-md p-4 border border-transparent [border-image:linear-gradient(to_right,#00C6AE,#FF8F6C)_1] slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Your Trip Group 👯‍♂️</h3>
            <div className="mt-1">
              <div className="font-medium">Goa Squad 🏖️</div>
              <div className="text-sm text-slate-600">Combined ₹12,500 / ₹60,000 (21%)</div>
              <div className="text-xs text-slate-500">4 friends saving together 💙</div>
            </div>
          </div>
          <div className="flex -space-x-2">
            {["A","B","C","D"].map((n, i) => (
              <img key={i} alt={`Member ${i+1}`} src={`https://api.dicebear.com/9.x/initials/svg?seed=${n}`} className="w-8 h-8 rounded-full border border-white shadow-soft animate-[float_3s_ease-in-out_infinite]" />
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <NavLink to="/groups/goa-squad" className="bg-gradient-to-r from-teal-500 to-orange-400 text-white rounded-full px-4 py-2 shadow-md">View Group</NavLink>
          <span className="text-xl" title="Milestone">🎉</span>
        </div>
      </div>
    </section>
  )
}

function MetricsRow({ onShowStreak, onOpenReferral, onOpenAutopay }) {
  const Chip = ({ children, onClick }) => (
    <button onClick={onClick} className="bg-white/80 rounded-full shadow-sm px-3 py-2 text-sm slide-up hover:shadow-md active:scale-[0.98] transition">
      {children}
    </button>
  )
  return (
    <section className="px-5 mt-6 flex items-center justify-center gap-3">
      <Chip onClick={onShowStreak}>🔥 12-day Streak</Chip>
      <Chip onClick={onOpenReferral}>💰 Referral ₹150</Chip>
      <Chip onClick={onOpenAutopay}>🔁 AutoPay ON</Chip>
    </section>
  )
}


function Dashboard() {
  const goals = goalsData
  const navigate = useNavigate()
  const [showStreak, setShowStreak] = useState(false)
  return (
    <div className="min-h-screen pb-24">
      <Header onShowStreak={() => setShowStreak(true)} />
      <SavingsSummary goals={goals} />
      <ActiveGoals goals={goals} />
      <TripGroupCard />
      <MetricsRow onShowStreak={() => setShowStreak(true)} onOpenReferral={() => navigate('/earn')} onOpenAutopay={() => navigate('/profile/autopay')} />
      {showStreak && <StreakCalendar onClose={() => setShowStreak(false)} streakDays={12} />}
      <BottomNav goals={goals} />
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
      <Route path="/goal-detail" element={<GoalDetail />} />
      <Route path="/add-money" element={<AddMoneyPage />} />
      <Route path="/analytics" element={<GrowthAnalytics />} />
    </Routes>
  )
}
