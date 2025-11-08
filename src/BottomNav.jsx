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
      {(groupEntries.length > 0 || soloEntries.length > 0) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-white rounded-xl shadow-soft p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
          <div className="text-xs text-slate-500 mb-2">Existing Trips</div>
          {/* Groups with per-user savings */}
          {groupEntries.slice(0, 2).map((g, i) => (
            <div key={`grp-${i}`} className="flex justify-between text-sm mb-1">
              <span className="text-slate-700 truncate mr-2">Group: {g.title}</span>
              <span className="text-slate-600">₹{(g.yourSaved || 0).toLocaleString('en-IN')} / ₹{(g.yourShare || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
          {/* Solo Trips */}
          {soloEntries.slice(0, 2).map((g, i) => (
            <div key={`solo-${i}`} className="flex justify-between text-sm mb-1 last:mb-0">
              <span className="text-slate-700 truncate mr-2">Solo: {g.title}</span>
              <span className="text-slate-600">₹{(g.current || 0).toLocaleString('en-IN')} / ₹{(g.total || 0).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <nav className="floating-nav">
      <Item to="/" icon="🏠" label="Dashboard" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
      <Item to="/groups" icon="👥" label="Groups" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
      <CenterItem to="/new-solo-trip" icon="➕" label="New Solo Trip" />
      <Item to="/earn" icon="💸" label="Earn" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
      <Item to="/profile" icon="👤" label="Profile" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
    </nav>
  )
}
