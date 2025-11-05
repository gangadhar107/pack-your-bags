import React from 'react'

export default function StreakCalendar({ onClose, streakDays = 12 }) {
  const days = ['M','T','W','T','F','S','S']
  const weeks = 4
  const grid = Array.from({ length: weeks * 7 }, (_, i) => ({
    label: days[i % 7],
    status: i < streakDays ? '🔥' : '⚪',
  }))
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 to-indigo-600/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-md rounded-t-2xl bg-white/80 shadow-lg p-5 animate-[slide-up_300ms_ease]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Your Savings Streak 🔥</h3>
            <p className="text-sm text-slate-600">Keep your streak alive by saving at least once a week!</p>
          </div>
          <button onClick={onClose} className="rounded-full px-3 py-1 bg-slate-100 text-slate-700">✖</button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {days.map((d, i) => (
            <div key={i} className="text-center text-xs text-slate-500">{d}</div>
          ))}
          {grid.map((c, i) => (
            <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-sm bg-white shadow-sm"
                 style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
              <span>{c.status}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-700">Streak maintained: {streakDays} days 🎉</div>
          <button className="rounded-full px-4 py-2 bg-gradient-to-r from-orange-400 to-teal-500 text-white shadow-md active:scale-[0.98] transition">Add ₹100 Now</button>
        </div>
      </div>
    </div>
  )
}

