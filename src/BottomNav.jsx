import React from 'react'
import { NavLink } from 'react-router-dom'

export default function BottomNav({ goals }) {
  // Compute per-user group savings for tooltip using localStorage groups
  let groupEntries = []
  try {
    const storedGroups = JSON.parse(localStorage.getItem('tripjar.groups') || '[]')
    if (Array.isArray(storedGroups)) {
      groupEntries = storedGroups.map((grp) => {
        const members = grp.membersCount || (Array.isArray(grp.members) ? grp.members.length : 0) || 1
        const yourSaved = typeof grp.yourSaved === 'number' ? grp.yourSaved : Math.round((grp.current || 0) / members)
        const yourShare = Math.round((grp.target || 0) / members)
        return { title: grp.name, yourSaved, yourShare }
      })
    }
  } catch {}
  if (groupEntries.length === 0) {
    // Demo fallback
    groupEntries = [{ title: 'Goa Squad', yourSaved: 3500, yourShare: 15000 }]
  }

  const soloEntries = Array.isArray(goals)
    ? goals.filter((g) => g.type !== 'group' && !g.hiddenInAddMoney).slice(0, 3)
    : []
  const Item = ({ to, icon, label, activeClass, baseClass }) => (
    <NavLink to={to}>
      {({ isActive }) => (
        <div className={`group flex items-center gap-2 rounded-full transition-all ${baseClass} ${isActive ? activeClass : 'text-slate-700 bg-white'}`}>
          <span className="text-sm">{icon}</span>
          <span className={`text-sm overflow-hidden transition-all duration-200 ${isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100'}`}>{label}</span>
        </div>
      )}
    </NavLink>
  )

  const CenterItem = ({ to, icon, label }) => (
    <div className="relative group">
      <NavLink to={to}>
        {({ isActive }) => (
          <div className={`flex items-center gap-2 rounded-full transition-all ${isActive ? 'bg-gradient-to-r from-teal to-orange text-white shadow-soft' : 'bg-gradient-to-r from-teal to-orange text-white'} px-3 py-3`}>
            <span className="text-lg">{icon}</span>
            <span className={`text-sm overflow-hidden transition-all duration-200 ${isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100'}`}>{label}</span>
          </div>
        )}
      </NavLink>
    </div>
  )

  return (
    <nav className="floating-nav">
      <Item to="/" icon="🏠" label="Dashboard" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
      <CenterItem to="/create-trip" icon="➕" label="Create Goal" />
      <Item to="/earn" icon="🎁" label="Rewards" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
    </nav>
  )
}
