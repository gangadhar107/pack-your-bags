import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AutoPaySettings() {
  const navigate = useNavigate()
  const [frequency, setFrequency] = useState('Weekly')
  const [amount, setAmount] = useState('500')
  const [method, setMethod] = useState('UPI')
  const [paused, setPaused] = useState(false)

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/profile')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Manage AutoPay 🔁</h1>
      </header>

      <section className="px-5 mt-5">
        <div className="card p-5 slide-up">
          <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
          <div className="pt-3 grid gap-3">
            <div>
              <label className="text-sm text-slate-700">Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white">
                {['Daily','Weekly','Monthly','Yearly','Quarterly'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-700">Amount per interval (₹)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-slate-700">Payment method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white">
                {['UPI','Bank','Card'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-700 font-medium">Pause AutoPay</label>
              <input type="checkbox" checked={paused} onChange={(e) => setPaused(e.target.checked)} className="w-5 h-5" />
            </div>
            {!paused && (
              <div className="flex items-center justify-between">
                <button className="px-4 py-2 rounded-full bg-slate-800 text-white text-sm">Cancel AutoPay</button>
                <span className="text-xs text-slate-600">Next deduction: ₹{amount} • {frequency}</span>
              </div>
            )}
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-slate-700">Recent deductions</h3>
              <ul className="mt-1 text-sm text-slate-700 grid gap-1">
                <li className="flex items-center justify-between"><span>₹500 • Goa Trip</span><span className="text-slate-500">2d ago</span></li>
                <li className="flex items-center justify-between"><span>₹500 • Goa Trip</span><span className="text-slate-500">9d ago</span></li>
                <li className="flex items-center justify-between"><span>₹500 • Goa Trip</span><span className="text-slate-500">16d ago</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

