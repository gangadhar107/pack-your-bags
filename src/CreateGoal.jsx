import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const presets = [
  { emoji: '🏖️', label: 'Goa Trip', amount: 15000, gradient: 'from-teal to-sky' },
  { emoji: '🏔️', label: 'Manali', amount: 20000, gradient: 'from-sky to-mint' },
  { emoji: '📱', label: 'New Phone', amount: 25000, gradient: 'from-teal to-orange' },
  { emoji: '💻', label: 'Laptop', amount: 50000, gradient: 'from-sky to-teal' },
  { emoji: '✈️', label: 'International', amount: 100000, gradient: 'from-mint to-sky' },
  { emoji: '➕', label: 'Custom Goal', amount: '', gradient: 'from-slate-300 to-slate-200' },
]

export default function CreateGoal() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(null)
  const active = useMemo(() => (activeIdx != null ? presets[activeIdx] : null), [activeIdx])

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

  const onSelect = (idx) => {
    setActiveIdx(idx)
    const p = presets[idx]
    setName(p.label === 'Custom Goal' ? '' : p.label)
    setTarget(p.amount || '')
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">What are you saving for?</h1>
      </header>

      {/* Preset chips */}
      <section className="px-5 mt-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {presets.map((p, idx) => {
            const activeState = activeIdx === idx
            return (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`min-w-[220px] rounded-xl shadow-soft px-4 py-3 text-left transition-transform ${activeState ? 'scale-[1.03]' : 'scale-100'} bg-gradient-to-br ${p.gradient} text-white`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{p.emoji}</span>
                  {typeof p.amount === 'number' && (
                    <span className="font-semibold">₹{p.amount.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="mt-2 font-semibold">{p.label}</div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Form card */}
      {active && (
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
              <button className="mt-2 bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-3 shadow-soft font-semibold">Create Goal 🎯</button>
            </div>
          </div>
        </section>
      )}

      <footer className="px-5 mt-6 text-center text-slate-700">
        Every rupee brings you closer to your dream ✨
      </footer>
    </div>
  )
}