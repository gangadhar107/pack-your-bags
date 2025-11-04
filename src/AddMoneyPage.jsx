import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddMoneyModal from './AddMoneyModal'

function ConfettiBurst({ count = 24 }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-start justify-center">
      <div className="relative w-full h-40">
        {Array.from({ length: count }).map((_, i) => {
          const left = Math.random() * 100
          const delay = Math.random() * 200
          const duration = 800 + Math.random() * 600
          const color = ['#22c55e','#38bdf8','#f59e0b','#a78bfa','#ef4444'][i % 5]
          return (
            <div
              key={i}
              style={{ left: `${left}%`, animationDelay: `${delay}ms`, animationDuration: `${duration}ms`, backgroundColor: color }}
              className="absolute top-0 w-2 h-3 rounded-sm animate-[slide-up_1s_ease-out]"
            />
          )
        })}
      </div>
    </div>
  )
}

export default function AddMoneyPage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)
  const [success, setSuccess] = useState(false)
  const goals = [{ title: 'Goa Trip 2024' }, { title: 'New Phone' }]

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Add Money 💰</h1>
      </header>

      <p className="px-5 mt-4 text-sm text-slate-700">Choose amount, goal, and AutoPay options. Supports UPI.</p>

      <AddMoneyModal
        open={open}
        onClose={() => { setOpen(false) }}
        goals={goals}
        onSuccess={(amt) => { setSuccess(true); setTimeout(() => setSuccess(false), 1500); setOpen(false) }}
      />

      {success && <ConfettiBurst count={28} />}
    </div>
  )
}

