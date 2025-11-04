import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function FloatingField({ label, type = 'text', value, onChange }) {
  const isFilled = value !== undefined && value !== null && String(value).length > 0
  return (
    <div className="relative">
      <input
        type={type}
        className="peer w-full rounded-xl border border-slate-200 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal"
        value={value}
        onChange={onChange}
      />
      <label
        className={
          `${isFilled
            ? 'absolute -top-3 left-3 z-10 text-xs text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200'
            : 'absolute top-3 left-3 z-10 text-slate-500'}
           pointer-events-none transition-all
           peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal peer-focus:bg-white peer-focus:px-2 peer-focus:py-0.5 peer-focus:rounded-md peer-focus:border peer-focus:border-teal/40`
        }
      >
        {label}
      </label>
    </div>
  )
}

export default function PlanTrip() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  // Screen 1 fields
  const [tripName, setTripName] = useState('Goa Squad')
  const [budget, setBudget] = useState('60000')
  const [date, setDate] = useState('2024-06-01')
  const [members, setMembers] = useState('4')
  const [minWeekly, setMinWeekly] = useState('500')

  const perPerson = useMemo(() => {
    const b = parseInt(budget || '0', 10)
    const m = parseInt(members || '1', 10)
    return m > 0 ? Math.round(b / m) : 0
  }, [budget, members])

  // Screen 2 state
  const [groupCode] = useState('GOAS24')
  const [joined, setJoined] = useState(0)
  const totalMembers = parseInt(members || '4', 10)
  const joinPercent = Math.min(100, Math.round((joined / Math.max(1, totalMembers)) * 100))

  const handleShareClick = () => {
    // Simulate a friend joining for demo purposes
    setJoined((j) => Math.min(totalMembers, j + 1))
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Plan a trip together! 🚀</h1>
      </header>

      {step === 1 && (
        <section className="px-5 mt-5">
          <div className="card p-5 slide-up">
            <div className="grid gap-4 pt-3">
              <FloatingField label="Trip name" value={tripName} onChange={(e) => setTripName(e.target.value)} />
              <FloatingField label="Total budget (₹)" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))} />
              <FloatingField label="Date" type="month" value={date.slice(0,7)} onChange={(e) => setDate(e.target.value + '-01')} />
              <FloatingField label="Expected members" value={members} onChange={(e) => setMembers(e.target.value.replace(/[^0-9]/g, ''))} />
              <FloatingField label="Minimum weekly save (₹)" value={minWeekly} onChange={(e) => setMinWeekly(e.target.value.replace(/[^0-9]/g, ''))} />

              <p className="text-sm text-slate-700">Each needs to save <span className="font-semibold">₹{perPerson.toLocaleString('en-IN')}</span></p>

              <button onClick={() => setStep(2)} className="mt-2 bounce-soft bg-gradient-to-r from-orange to-teal text-white rounded-full px-4 py-3 shadow-soft font-semibold">Next: Invite Friends</button>
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="px-5 mt-5">
          <div className="card p-5 slide-up">

            <div className="mt-3">
              <div className="rounded-xl p-4 bg-gradient-to-r from-teal to-sky text-white shadow-soft inline-block">Group Code: <span className="font-bold">{groupCode}</span></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={handleShareClick} className="bounce-soft bg-green-500 text-white rounded-full px-4 py-2 shadow-soft">WhatsApp</button>
              <button onClick={handleShareClick} className="bounce-soft bg-slate-800 text-white rounded-full px-4 py-2 shadow-soft">Copy Link</button>
              <button onClick={handleShareClick} className="bounce-soft bg-pink-500 text-white rounded-full px-4 py-2 shadow-soft">Instagram Story</button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-slate-700 mb-1">{joined} / {totalMembers} joined</div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div style={{ width: joinPercent + '%' }} className="h-2 rounded-full bg-gradient-to-r from-teal to-orange transition-[width] duration-700" />
              </div>
            </div>

            <button onClick={() => navigate('/')} className="mt-4 text-teal font-semibold">Skip, I’ll invite later</button>
          </div>
        </section>
      )}
    </div>
  )
}