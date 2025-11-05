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

function Header() {
  return (
    <header className="flex items-start justify-between px-5 pt-6">
      <div className="slide-up">
        <h1 className="text-xl font-semibold">Hi, Gangadhar 👋</h1>
        <p className="text-slate-600 text-sm">Let’s reach your goal faster today!</p>
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
            <CircularRing percent={percent} color="#22c55e" label={`₹${targetTotal.toLocaleString('en-IN')}`} />
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
      <h3 className="text-sm font-semibold text-slate-700 mb-2 slide-up">Active Goals</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {goals.map((g, idx) => (
          <NavLink key={idx} to="/goal-detail" className="min-w-[86%] sm:min-w-[300px]">
            <GoalCard title={g.title} current={g.current} total={g.total} percent={Math.round((g.current / (g.total || 1)) * 100)} autopay={g.autopay} />
          </NavLink>
        ))}
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

function MetricsRow() {
  const Chip = ({ children }) => (
    <div className="bg-white rounded-full shadow-soft px-3 py-2 text-sm slide-up">
      {children}
    </div>
  )
  return (
    <section className="px-5 mt-6 flex gap-3">
      <Chip>🔥 12-day Streak</Chip>
      <Chip>💰 Referral Earnings ₹150</Chip>
      <Chip>⚙️ AutoPay ON</Chip>
    </section>
  )
}


function Dashboard() {
  const goals = goalsData
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <SavingsSummary goals={goals} />
      <ActiveGoals goals={goals} />
      <TripGroupCard />
      <MetricsRow />
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
