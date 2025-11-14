import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateTripSelector() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate('/')} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Create Trip</h1>
      </header>
      <section className="px-5 mt-5">
        <div className="grid gap-4">
          <div className="card p-5 slide-up">
            <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
            <div className="pt-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Option</div>
                <div className="text-xl font-bold">Create Solo Trip</div>
                <div className="mt-1 text-xs text-slate-600">Plan and save for yourself</div>
              </div>
              <button onClick={() => navigate('/new-solo-trip')} className="bounce-soft bg-orange-gradient text-white rounded-full px-4 py-2 shadow-soft font-semibold">Choose</button>
            </div>
          </div>
          <div className="card p-5 slide-up">
            <div className="accent-bar bg-gradient-to-r from-orange to-teal" />
            <div className="pt-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Option</div>
                <div className="text-xl font-bold">Create Group Trip</div>
                <div className="mt-1 text-xs text-slate-600">Plan together and split savings</div>
              </div>
              <button onClick={() => navigate('/plan-trip')} className="bounce-soft bg-teal-sky text-white rounded-full px-4 py-2 shadow-soft font-semibold">Choose</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

