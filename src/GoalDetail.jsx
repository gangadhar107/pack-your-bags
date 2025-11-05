import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'
import AddMoneyModal from './AddMoneyModal'

function ProgressBar({ percent = 0, color = '#22c55e' }) {
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

export default function GoalDetail({ goals = [] }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(3000)
  const [target] = useState(15000)
  const percent = useMemo(() => Math.round((current / target) * 100), [current, target])
  const [modalOpen, setModalOpen] = useState(false)

  const handleSuccess = (added) => {
    setCurrent((c) => c + added)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Goa Trip 2026 🎯</h1>
      </header>

      {/* Summary Card */}
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 grid gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Saved</div>
                <div className="text-2xl font-bold">₹{current.toLocaleString('en-IN')} / ₹{target.toLocaleString('en-IN')}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Progress</div>
                <div className="font-semibold text-slate-700">{percent}%</div>
              </div>
            </div>
            <ProgressBar percent={percent} color="#22c55e" />
            <div className="text-xs text-teal">AutoPay: ₹500 weekly 🔁</div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-600">Target by: <span className="font-semibold">Dec 2024</span></div>
            <button onClick={() => setModalOpen(true)} className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft font-semibold">Add Money</button>
          </div>
        </div>
      </section>

      {/* Activity */}
      <section className="px-5 mt-6">
        <div className="card p-4 slide-up">
          <div className="accent-bar bg-gradient-to-r from-orange to-teal" />
          <div className="pt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span>💸</span><span>Added ₹500 via UPI</span></div>
              <span className="text-xs text-slate-500">Today</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span>🔁</span><span>AutoPay success ₹500</span></div>
              <span className="text-xs text-slate-500">2d ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <BottomNav />

      {/* Add Money modal */}
      <AddMoneyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        goals={goals}
        onSuccess={(amt) => { handleSuccess(amt); setModalOpen(false) }}
      />
    </div>
  )
}
