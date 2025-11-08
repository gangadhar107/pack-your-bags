import React, { useEffect } from 'react'

export default function TermsModal({ open, onClose }) {
  if (!open) return null

  // Lock body scroll and support ESC-to-close while modal is open
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose && onClose() } }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:w-[560px] m-0 sm:m-6 rounded-2xl shadow-2xl bg-white/90 border border-white/60 p-6 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pack Your Bags – Terms & Conditions</h2>
          <button aria-label="Close" onClick={onClose} className="card p-2">✖</button>
        </div>

        <div className="mt-4 text-sm text-slate-800 space-y-4 flex-1 overflow-y-auto pr-2">
          <section>
            <div className="font-semibold mb-1">🎯 Savings Policy</div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700">
              <li>All added funds go toward your selected trip goal.</li>
              <li>You can add money anytime manually or through AutoPay.</li>
              <li>Contributions increase your goal progress and streak.</li>
            </ul>
          </section>

          <section>
            <div className="font-semibold mb-1">💳 Withdrawal Policy</div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700">
              <li>You can withdraw your saved amount anytime.</li>
              <li>If your goal progress is less than 100%, a small penalty (up to 5%) may apply.</li>
              <li>At 100% goal completion, there is no penalty.</li>
              <li>Early withdrawal may pause streak or referral rewards.</li>
            </ul>
          </section>

          <section>
            <div className="font-semibold mb-1">⚙️ AutoPay Policy</div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700">
              <li>AutoPay contributions are added at the user-selected frequency (daily, weekly, monthly, quarterly, or yearly).</li>
              <li>You can pause or cancel AutoPay anytime from your Profile → AutoPay Settings.</li>
            </ul>
          </section>

          <section>
            <div className="font-semibold mb-1">🏆 Reward Policy</div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700">
              <li>Streak bonuses and referral rewards are credited when users maintain consistent savings behavior.</li>
              <li>Early withdrawals or paused AutoPay may temporarily affect eligibility.</li>
            </ul>
          </section>

          <section>
            <div className="font-semibold mb-1">✅ Transparency Note</div>
            <ul className="list-disc ml-5 space-y-1 text-slate-700">
              <li>Pack Your Bags promotes responsible saving. All balances and penalties are transparently calculated and displayed before any action is confirmed.</li>
              <li>No hidden fees or deductions occur without explicit user consent.</li>
            </ul>
          </section>

          <section className="text-slate-700">
            <div>📜 By using Pack Your Bags, you agree to the above terms and understand that this prototype is a conceptual demo for educational purposes.</div>
          </section>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-slate-800 text-white shadow-soft">Got It ✅</button>
        </div>
      </div>
    </div>
  )
}
