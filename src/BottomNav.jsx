import React from 'react'
import { NavLink } from 'react-router-dom'

export default function BottomNav({ goals }) {
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
      {Array.isArray(goals) && goals.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-xl shadow-soft p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
          <div className="text-xs text-slate-500 mb-2">Existing Goals</div>
          {goals.slice(0,3).map((g, i) => (
            <div key={i} className="flex justify-between text-sm mb-1 last:mb-0">
              <span className="text-slate-700 truncate mr-2">{g.title}</span>
              <span className="text-slate-600">₹{g.current.toLocaleString('en-IN')} / ₹{g.total.toLocaleString('en-IN')}</span>
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
      <CenterItem to="/create-goal" icon="➕" label="Create Goal" />
      <Item to="/earn" icon="💸" label="Earn" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
      <Item to="/profile" icon="👤" label="Profile" baseClass="px-2 py-1" activeClass="bg-gradient-to-r from-teal to-sky text-white shadow-soft" />
    </nav>
  )
}