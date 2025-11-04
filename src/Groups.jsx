import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import BottomNav from './BottomNav'

function ProgressBar({ percent = 0, color = '#22c55e' }) {
  const barRef = useRef(null)
  useEffect(() => {
    const el = barRef.current
    if (el) requestAnimationFrame(() => { el.style.width = `${Math.min(100, Math.max(0, percent))}%` })
  }, [percent])
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div ref={barRef} className="progress-fill h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

function AvatarsRow({ members = [] }) {
  return (
    <div className="flex items-center">
      {members.map((m, i) => (
        <div key={i} className={`-ml-2 first:ml-0 w-8 h-8 rounded-full shadow-soft ring-2 ring-white overflow-hidden transition-transform hover:-translate-y-[2px] hover:scale-105 bg-white flex items-center justify-center text-sm font-semibold text-slate-700`}> 
          {m.img ? (
            <img alt={m.name} src={m.img} className="w-full h-full object-cover" />
          ) : (
            <span>{m.initials || m.name?.[0] || '?'}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function GroupCard({ name, current, target, members, autopaySummary }) {
  const percent = useMemo(() => Math.round((current / (target || 1)) * 100), [current, target])
  const navigate = useNavigate()
  return (
    <div className="card p-4 slide-up">
      <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
      <div className="pt-3 grid gap-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{name}</div>
          <button onClick={() => navigate('/groups/goa-squad')} className="bounce-soft bg-teal-sky text-white rounded-full px-3 py-1.5 shadow-soft text-sm">View Group</button>
        </div>
        <div className="text-sm text-slate-600">₹{current.toLocaleString('en-IN')} / ₹{target.toLocaleString('en-IN')}</div>
        <ProgressBar percent={percent} color="#38bdf8" />
        <div className="flex items-center justify-between">
          <AvatarsRow members={members} />
          <div className="text-xs text-teal">{autopaySummary}</div>
        </div>
      </div>
    </div>
  )
}

function SuggestedCard({ title, meta, percent, membersCount }) {
  const p = Math.min(100, Math.max(0, percent || 0))
  return (
    <div className="min-w-[240px] card p-4 slide-up">
      <div className="accent-bar bg-gradient-to-r from-orange to-teal" />
      <div className="pt-3">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-slate-600">{meta}</div>
        {typeof percent === 'number' && (
          <div className="mt-2">
            <ProgressBar percent={p} color="#f59e0b" />
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-slate-600">Members: {membersCount}</div>
          <button className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-3 py-1.5 shadow-soft text-sm hover:shadow-[0_0_0_3px_rgba(255,255,255,0.5)]">Join Now +</button>
        </div>
      </div>
    </div>
  )
}

export default function Groups() {
  const [query, setQuery] = useState('')
  const groups = [
    {
      name: 'Goa Squad 🏖️',
      current: 12500,
      target: 60000,
      members: [
        { name: 'Gangadhar', initials: 'G' },
        { name: 'Arjun', initials: 'A' },
        { name: 'Priya', initials: 'P' },
        { name: 'Rahul', initials: 'R' },
      ],
      autopaySummary: '3/4 have AutoPay ON 🔁',
    },
  ]
  const filtered = groups.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <header className="px-5 pt-6 slide-up">
        <h1 className="text-lg font-semibold">Your Trip Groups 👥</h1>
        <p className="text-slate-600 text-sm">Save together, travel together!</p>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search group or friend…"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>
      </header>

      {/* Active Groups */}
      <section className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Active Groups</h2>
        {filtered.length === 0 ? (
          <div className="card p-6 slide-up text-center">
            <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
            <div className="pt-3">
              <div className="text-5xl">🫙</div>
              <p className="mt-2 text-slate-700">No groups yet! Create your first trip group and start saving together 🚀</p>
              <NavLink to="/plan-trip" className="inline-block mt-3 bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft font-semibold">Create Trip Group</NavLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((g, idx) => (
              <GroupCard key={idx} name={g.name} current={g.current} target={g.target} members={g.members} autopaySummary={g.autopaySummary} />
            ))}
          </div>
        )}
      </section>

      {/* Suggested Groups */}
      <section className="px-5 mt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">Trending Groups 🌍</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <SuggestedCard title="Manali Backpackers" meta="78 members saving ₹20L+" membersCount={78} />
          <SuggestedCard title="College Goa ’25" meta="65% progress" percent={65} membersCount={32} />
          <SuggestedCard title="Delhi Explorers" meta="45% progress" percent={45} membersCount={15} />
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-40">
        <NavLink to="/plan-trip" className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-3 shadow-soft inline-flex items-center gap-2">
          <span className="text-lg">➕</span>
          <span className="font-semibold">Create New Group</span>
        </NavLink>
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
