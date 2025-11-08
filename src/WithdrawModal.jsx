import React, { useEffect, useMemo, useState } from 'react'
import TermsModal from './TermsModal'

export default function WithdrawModal({ open, onClose, trip, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [termsOpen, setTermsOpen] = useState(false)
  const saved = Math.max(0, parseInt((trip?.type === 'group' ? (trip?.yourSaved || 0) : (trip?.current || 0)) || 0, 10))
  const total = Math.max(1, parseInt((trip?.type === 'group' ? (trip?.yourShare || 0) : (trip?.total || 0)) || 1, 10))
  const progress = Math.min(1, saved / total)
  const basePenalty = 0.05
  const penaltyRate = progress >= 1 ? 0 : (basePenalty * (1 - progress))
  const withdrawAmount = Math.max(0, parseInt(amount || '0', 10))
  const penaltyAmount = Math.round(withdrawAmount * penaltyRate)
  const finalAmount = Math.max(0, withdrawAmount - penaltyAmount)
  const percentStr = Math.round(progress * 100) + '%'

  useEffect(() => {
    if (!open) setAmount('')
  }, [open])

  if (!open) return null

  const canConfirm = withdrawAmount > 0 && withdrawAmount <= saved

  const handleConfirm = async () => {
    if (!canConfirm) return
    const nowISO = new Date().toISOString()
    try {
      if (trip?.type === 'solo') {
        const raw = localStorage.getItem('tripjar.userGoals')
        const arr = raw ? JSON.parse(raw) : []
        const idx = arr.findIndex((g) => (g.id && trip.id ? g.id === trip.id : g.title === trip.title))
        if (idx >= 0) {
          const g = arr[idx]
          const nextCurrent = Math.max(0, (g.current || 0) - withdrawAmount)
          const hist = Array.isArray(g.history) ? g.history.slice() : []
          hist.unshift({ id: 'txn_' + Math.random().toString(36).slice(2, 9), type: 'withdraw', amount: withdrawAmount, penalty: penaltyAmount, final: finalAmount, date: nowISO })
          arr[idx] = { ...g, current: nextCurrent, history: hist }
          localStorage.setItem('tripjar.userGoals', JSON.stringify(arr))
        }
      } else if (trip?.type === 'group') {
        const raw = localStorage.getItem('tripjar.groups')
        const arr = raw ? JSON.parse(raw) : []
        const idx = arr.findIndex((grp) => (trip.id ? grp.id === trip.id : grp.name === trip.title))
        if (idx >= 0) {
          const grp = arr[idx]
          const members = grp.membersCount || (Array.isArray(grp.members) ? grp.members.length : 0) || 1
          const yourSavedPrev = typeof grp.yourSaved === 'number' ? grp.yourSaved : Math.round((grp.current || 0) / members)
          const combinedNext = Math.max(0, (grp.current || 0) - withdrawAmount)
          const yourSavedNext = Math.max(0, yourSavedPrev - withdrawAmount)
          const hist = Array.isArray(grp.history) ? grp.history.slice() : []
          hist.unshift({ id: 'txn_' + Math.random().toString(36).slice(2, 9), type: 'withdraw', amount: withdrawAmount, penalty: penaltyAmount, final: finalAmount, date: nowISO })
          arr[idx] = { ...grp, current: combinedNext, yourSaved: yourSavedNext, history: hist }
          localStorage.setItem('tripjar.groups', JSON.stringify(arr))
        }
      }
      window.dispatchEvent(new Event('tripjar:dataUpdated'))
      if (typeof onSuccess === 'function') {
        onSuccess({ finalAmount, penaltyAmount, type: trip?.type })
      }
    } finally {
      if (typeof onClose === 'function') onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full sm:w-[520px] m-0 sm:m-6 rounded-2xl shadow-2xl bg-white/80 border border-white/60 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Withdraw from {trip?.type === 'group' ? 'Group Trip' : 'Solo Trip'} 💳</h2>
          <button aria-label="Close" onClick={onClose} className="card p-2">✖</button>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-700">
          <div className="flex items-center justify-between"><span>Saved</span><span className="font-semibold">₹{saved.toLocaleString('en-IN')}</span></div>
          <div className="flex items-center justify-between"><span>Target</span><span className="font-semibold">₹{total.toLocaleString('en-IN')}</span></div>
          <div className="flex items-center justify-between"><span>Progress</span><span className="font-semibold">{percentStr}</span></div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-600">Amount to withdraw</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
            inputMode="numeric"
            placeholder="Enter amount"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800"
          />
          {withdrawAmount > saved && (
            <div className="mt-1 text-xs text-red-600">You cannot withdraw more than your saved amount.</div>
          )}
        </div>

        <div className="mt-4 grid gap-1 text-sm">
          <div className="flex items-center justify-between text-slate-700"><span>Penalty rate</span><span>{Math.round(penaltyRate * 100)}%</span></div>
          <div className="flex items-center justify-between text-slate-700"><span>Penalty amount</span><span>₹{penaltyAmount.toLocaleString('en-IN')}</span></div>
          <div className="flex items-center justify-between font-semibold text-slate-800"><span>Final credited</span><span>₹{finalAmount.toLocaleString('en-IN')}</span></div>
        </div>

        <div className="mt-4 text-xs text-slate-600">
          ⚠️ Withdrawing before completing your savings goal may apply a small penalty to encourage consistent saving. Your savings remain yours, and you can withdraw anytime.{' '}
          <button className="text-teal font-semibold" onClick={() => setTermsOpen(true)}>View Terms →</button>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-slate-200 text-slate-800">Cancel</button>
          <button disabled={!canConfirm} onClick={handleConfirm} className={`px-4 py-2 rounded-full text-white shadow-soft ${canConfirm ? 'bg-gradient-to-r from-teal to-orange' : 'bg-slate-400'}`}>Confirm Withdraw</button>
        </div>
      </div>
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  )
}
