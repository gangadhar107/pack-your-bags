import React, { useMemo, useState } from 'react'
import TermsModal from './TermsModal'

export default function AddMoneyModal({ open, onClose, goals = [], onSuccess }) {
  const [amount, setAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedGoalIdx, setSelectedGoalIdx] = useState(0)
  const [smartOpen, setSmartOpen] = useState(false)
  const [autoPayOn, setAutoPayOn] = useState(false)
  const [frequency, setFrequency] = useState('Weekly')
  const [intervalAmount, setIntervalAmount] = useState('500')
  const [isProcessing, setIsProcessing] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const chipValues = [50, 100, 200, 500]

  const displayGoals = Array.isArray(goals) ? goals.filter((g) => !g.hiddenInAddMoney) : []
  const selectedGoal = displayGoals[selectedGoalIdx] || { title: 'My Trip' }
  const computedAmount = useMemo(() => {
    const c = parseInt(customAmount || '0', 10)
    return c > 0 ? c : amount
  }, [amount, customAmount])

  const handleAddMoney = async () => {
    if (!computedAmount || computedAmount <= 0) return
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsProcessing(false)
    try {
      if (typeof onSuccess === 'function') onSuccess({ amount: computedAmount, goal: selectedGoal })
    } finally {
      if (typeof onClose === 'function') onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      {/* Card */}
      <div className="w-full sm:w-[520px] m-0 sm:m-6 rounded-2xl shadow-2xl bg-white/80 border border-white/60 p-5 sm:p-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add to your trip savings 💰</h2>
          <button aria-label="Close" onClick={onClose} className="card p-2">✖</button>
        </div>

        {/* Amount chips */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {chipValues.map((v) => (
              <button
                key={v}
                onClick={() => { setAmount(v); setCustomAmount('') }}
                className={`px-3 py-2 rounded-xl shadow-soft text-sm transition-all ${computedAmount === v ? 'bg-gradient-to-r from-teal to-sky text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
              >
                ₹{v}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white w-28 text-sm"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">Selected: <span className="font-semibold">₹{computedAmount.toLocaleString('en-IN')}</span></div>
        </div>

        {/* Goal dropdown */}
        <div className="mt-5">
          <label className="text-sm text-slate-600">Add money to which trip?</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800"
            value={selectedGoalIdx}
            onChange={(e) => setSelectedGoalIdx(parseInt(e.target.value, 10))}
          >
            {displayGoals.length === 0 && <option value={0}>My Trip</option>}
            {displayGoals.map((g, i) => (
              <option key={i} value={i}>{g.type === 'group' ? `Group: ${g.title}` : `Solo: ${g.title}`}</option>
            ))}
          </select>
        </div>

        {/* Smart Savings accordion */}
        <div className="mt-5">
          <button onClick={() => setSmartOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-sm font-semibold">Smart Savings</span>
            <span className="text-slate-600">{smartOpen ? '▾' : '▸'}</span>
          </button>
          {smartOpen && (
            <div className="mt-3 grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">AutoPay</span>
                <button onClick={() => setAutoPayOn((v) => !v)} className={`px-3 py-1 rounded-full text-sm ${autoPayOn ? 'bg-teal text-white' : 'bg-slate-200 text-slate-700'}`}>{autoPayOn ? 'ON' : 'OFF'}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600">Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white">
                    {['Daily','Weekly','Monthly','Yearly','Quarterly'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600">Amount per interval</label>
                  <input value={intervalAmount} onChange={(e) => setIntervalAmount(e.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white" />
                </div>
              </div>
              <button className="justify-self-start bounce-soft bg-slate-800 text-white rounded-full px-4 py-2 shadow-soft text-sm">Pause AutoPay</button>
              <p className="text-xs text-slate-600">With AutoPay, reach your goals automatically!</p>
            </div>
          )}
        </div>

        {/* UPI options */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-700 mb-2">Pay with UPI</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">Google Pay</button>
            <button className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">PhonePe</button>
            <button className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">Paytm</button>
            <button className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm">BHIM</button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-slate-600">Trip: <span className="font-semibold">{selectedGoal.title}</span></div>
          <button disabled={isProcessing} onClick={handleAddMoney} className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-5 py-3 shadow-soft font-semibold">
            {isProcessing ? 'Processing…' : `Add ₹${computedAmount.toLocaleString('en-IN')}`}
          </button>
        </div>

        {/* Short T&C notice */}
        <div className="mt-3 text-xs text-slate-600">
          💬 By continuing, you agree that your added amount will contribute toward your selected trip savings goal. You can withdraw anytime, but bonuses or streak rewards may pause for early withdrawals.{' '}
          <button className="text-teal font-semibold" onClick={() => setTermsOpen(true)}>View Terms →</button>
        </div>

        <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      </div>
    </div>
  )
}
