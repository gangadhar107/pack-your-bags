import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SupportHelp() {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="w-[92%] max-w-[520px] rounded-2xl shadow-2xl bg-white/80 border border-white/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Help & Support 💬</h2>
          <button aria-label="Close" onClick={() => navigate('/profile')} className="card p-2">✖</button>
        </div>
        <div className="mt-3 grid gap-3 text-sm text-slate-700">
          <div>
            <div className="font-semibold">How do I enable AutoPay?</div>
            <p>Go to Profile → Manage AutoPay and turn it ON.</p>
          </div>
          <div>
            <div className="font-semibold">How to add money?</div>
            <p>Use Add Money from Dashboard or within any goal/group.</p>
          </div>
          <div>
            <div className="font-semibold">Which payment methods are supported?</div>
            <p>UPI, Bank, and Card for this prototype.</p>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button onClick={() => navigate('/profile')} className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft text-sm">Close</button>
        </div>
      </div>
    </div>
  )
}

