import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const titleParam = params.get('title') || 'Trip'
  const destParam = params.get('destination') || ''
  const dateParam = params.get('date') || ''
  const currentInit = parseInt(params.get('current') || '0', 10) || 0
  const totalInit = parseInt(params.get('total') || '0', 10) || 1
  const [current, setCurrent] = useState(currentInit)
  const [target, setTarget] = useState(totalInit)
  const percent = useMemo(() => Math.round((current / target) * 100), [current, target])
  const [modalOpen, setModalOpen] = useState(false)

  const formatMonthYear = (dateStr) => {
    if (dateStr) {
      try {
        const d = new Date(dateStr)
        const month = d.toLocaleString('en-US', { month: 'long' })
        const year = d.getFullYear()
        if (!isNaN(year)) return `${month} ${year}`
      } catch {}
    }
    if ((titleParam || '').toLowerCase().includes('ladakh')) {
      return 'February 2026'
    }
    return '—'
  }

  const handleSuccess = (added) => {
    setCurrent((c) => c + added)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">{titleParam} 🎯</h1>
      </header>

      {/* Summary Card */}
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 grid gap-3">
            <div className="flex items-center justify-between">
              {/* Left: Saved (combined values), Target by */}
              <div>
                <div className="text-sm text-slate-600">Saved</div>
                <div className="text-2xl font-bold">₹{current.toLocaleString('en-IN')} / ₹{target.toLocaleString('en-IN')}</div>
                <div className="mt-2 text-xs text-slate-600">Target by: <span className="font-semibold">{formatMonthYear(dateParam)}</span></div>
              </div>
              {/* Right: Progress, percent */}
              <div className="text-right">
                <div className="text-sm text-slate-600">Progress</div>
                <div className="font-semibold text-slate-700">{percent}%</div>
              </div>
            </div>
            <ProgressBar percent={percent} color="#22c55e" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div />
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
