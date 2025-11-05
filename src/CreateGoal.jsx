import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateGoal() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [date, setDate] = useState('')
  const [autoPay, setAutoPay] = useState(false)
  const [frequency, setFrequency] = useState('Weekly')
  const [intervalAmount, setIntervalAmount] = useState('500')

  const summaryText = useMemo(() => {
    const amountText = intervalAmount ? `₹${intervalAmount}` : '₹—'
    const freqText = frequency === 'Weekly' ? 'every Monday' : frequency === 'Daily' ? 'every day' : frequency === 'Monthly' ? 'on the 1st' : frequency === 'Yearly' ? 'every January 1st' : 'every quarter'
    return `This will auto-save ${amountText} ${freqText} 💫`
  }, [intervalAmount, frequency])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">What are you saving for?</h1>
      </header>
      {/* Custom goal form only */}
      <section className="px-5 mt-5">
        <div className="card p-4 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="grid gap-4 pt-3">
            <div>
              <label className="text-sm text-slate-600">Goal name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Goa Trip" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Target amount (₹)</label>
              <input value={target} onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 15000" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Target date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-700 font-medium">Enable AutoPay</label>
              <input type="checkbox" checked={autoPay} onChange={(e) => setAutoPay(e.target.checked)} className="w-5 h-5" />
            </div>
            {autoPay && (
              <div className="grid gap-3">
                <div>
                  <label className="text-sm text-slate-600">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal">
                    {['Daily','Weekly','Monthly','Yearly','Quarterly'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Amount per interval</label>
                  <input value={intervalAmount} onChange={(e) => setIntervalAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 500" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <p className="text-sm text-slate-600">{summaryText}</p>
              </div>
            )}
            <button
              onClick={() => {
                const title = name.trim()
                const total = parseInt(target || '0', 10) || 0
                if (!title || !date || total <= 0) return
                const stored = JSON.parse(localStorage.getItem('tripjar.userGoals') || '[]')
                const id = 'goal_' + Math.random().toString(36).slice(2, 9)
                const newGoal = {
                  id,
                  title,
                  current: 0,
                  total,
                  date,
                  autoPay,
                  frequency,
                  intervalAmount: parseInt(intervalAmount || '0', 10) || 0,
                }
                localStorage.setItem('tripjar.userGoals', JSON.stringify([newGoal, ...stored]))
                // Notify app-wide listeners that data changed
                window.dispatchEvent(new Event('tripjar:dataUpdated'))
                navigate('/')
              }}
              disabled={!name.trim() || !date || !(parseInt(target || '0', 10) > 0)}
              className={`mt-2 bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-3 shadow-soft font-semibold ${(!name.trim() || !date || !(parseInt(target || '0', 10) > 0)) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Create Goal 🎯
            </button>
            {(!name.trim() || !date || !(parseInt(target || '0', 10) > 0)) && (
              <p className="text-xs text-red-600">Enter name, date, and a positive target.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
