import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'

function Bar({ value = 50, label }) {
  const height = useMemo(() => Math.max(4, Math.min(100, value)), [value])
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-6 rounded-md bg-gradient-to-b from-teal to-sky" style={{ height: `${height}px` }} />
      <div className="text-xs text-slate-600">{label}</div>
    </div>
  )
}

export default function GrowthAnalytics() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Growth Analytics 📈</h1>
      </header>

      {/* Savings growth */}
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3">
            <h3 className="text-sm font-semibold text-slate-700">Monthly Savings</h3>
            <div className="mt-3 flex items-end gap-3 h-32">
              <Bar value={24} label="Jan" />
              <Bar value={36} label="Feb" />
              <Bar value={52} label="Mar" />
              <Bar value={68} label="Apr" />
              <Bar value={74} label="May" />
              <Bar value={88} label="Jun" />
            </div>
          </div>
        </div>
      </section>

      {/* Referral growth */}
      <section className="px-5 mt-6">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-orange to-teal" />
          <div className="pt-3">
            <h3 className="text-sm font-semibold text-slate-700">Referral Earnings</h3>
            <p className="text-sm text-slate-600">₹150 earned this month from 4 invites 🎉</p>
          </div>
        </div>
      </section>

      {/* AutoPay health */}
      <section className="px-5 mt-6">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-sky to-mint" />
          <div className="pt-3">
            <h3 className="text-sm font-semibold text-slate-700">AutoPay Health</h3>
            <p className="text-sm text-slate-600">On-time rate: 92% • Upcoming: ₹500 in 2 days</p>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  )
}

