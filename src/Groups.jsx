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

function GroupCard({ id, name, destination, current, target, members, autopaySummary, deletable, onDelete }) {
  const percent = useMemo(() => Math.round((current / (target || 1)) * 100), [current, target])
  const navigate = useNavigate()
  return (
    <div className="card p-4 slide-up">
      <div className="accent-bar bg-gradient-to-r from-teal to-sky" />
      <div className="pt-3 grid gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{name}</div>
            {destination && <div className="text-xs text-slate-500">Destination: {destination}</div>}
          </div>
          <div className="flex items-center gap-2">
            {typeof current === 'number' && deletable && current === 0 && (
              <button onClick={() => onDelete?.(id)} className="bounce-soft bg-red-500 text-white rounded-full px-3 py-1.5 shadow-soft text-sm">Delete</button>
            )}
            {name === 'Goa Squad 🏖️' && (
              <button onClick={() => navigate('/groups/goa-squad')} className="bounce-soft bg-teal-sky text-white rounded-full px-3 py-1.5 shadow-soft text-sm">View Group</button>
            )}
          </div>
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
  const [userGroups, setUserGroups] = useState([])
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tripjar.groups') || '[]')
      setUserGroups(Array.isArray(stored) ? stored : [])
    } catch {}
  }, [])

  const defaultGroups = [
    {
      name: 'Goa Squad 🏖️',
      destination: 'Goa',
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
  const merged = [
    // Map user-created groups to card data
    ...userGroups.map(g => ({
      id: g.id,
      name: g.name,
      destination: g.destination,
      current: g.current || 0,
      target: g.target || 0,
      members: new Array(Math.max(0, g.membersCount || 0)).fill(0).map((_, i) => ({ initials: String.fromCharCode(65 + (i % 26)) })),
          autopaySummary: g.minMonthly ? `Min monthly ₹${g.minMonthly}` : 'AutoPay OFF',
      deletable: true,
    })),
    ...defaultGroups.map(g => ({ ...g, deletable: false })),
  ]

  const filtered = merged.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))

  const handleDelete = (id) => {
    const next = userGroups.filter(g => g.id !== id)
    setUserGroups(next)
    localStorage.setItem('tripjar.groups', JSON.stringify(next))
    // Notify app-wide listeners that data changed
    window.dispatchEvent(new Event('tripjar:dataUpdated'))
  }

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <header className="px-5 pt-6 slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Your Trip Groups 👥</h1>
            <p className="text-slate-600 text-sm">Save together, travel together!</p>
          </div>
          <NavLink to="/plan-trip" className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-3 py-2 shadow-soft inline-flex items-center gap-2">
            <span className="text-lg">👥➕</span>
            <span className="font-semibold">Create Group</span>
          </NavLink>
        </div>
        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search group…"
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
              <GroupCard
                key={g.id || idx}
                id={g.id}
                name={g.name}
                destination={g.destination}
                current={g.current}
                target={g.target}
                members={g.members}
                autopaySummary={g.autopaySummary}
                deletable={g.deletable}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending groups section removed per request */}

      {/* Header action moved: removed bottom floating action button */}

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
