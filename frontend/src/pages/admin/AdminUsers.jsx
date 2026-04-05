import { useEffect, useRef, useState } from 'react'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../../api/client'
import { formatDateLabel } from '../shared'

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const options = [
    { value: 'name', label: 'Name A–Z' },
    { value: 'date', label: 'Newest first' },
    { value: 'role', label: 'Role' },
  ]
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-xl border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09]">
        {selected?.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-white/10 bg-[rgba(12,16,32,0.98)] p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                  value === opt.value ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/[0.07] hover:text-white'
                }`}>
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Avatar({ name, role }) {
  const initials = String(name ?? '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
  const color = role === 'restaurant' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-blue-500/15 text-blue-300'
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${color}`}>
      {initials || '?'}
    </div>
  )
}

function RoleBadge({ role }) {
  return role === 'restaurant'
    ? <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-300">Restaurant</span>
    : <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-blue-300">Customer</span>
}

function StatusBadge({ suspended }) {
  return suspended
    ? <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-rose-300">Suspended</span>
    : <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-300">Active</span>
}

function UserCard({ user, onToggle, loading }) {
  const isSuspended = user.suspended === true
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.6)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={user.name} role={user.role} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <RoleBadge role={user.role} />
          <StatusBadge suspended={isSuspended} />
        </div>
      </div>

      {user.restaurantName && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <StorefrontRoundedIcon className="text-[0.8rem] text-slate-500" />
          <span className="truncate">{user.restaurantName}</span>
          {user.city && <span className="text-slate-600">· {user.city}</span>}
        </div>
      )}
      {user.phone && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <PhoneRoundedIcon className="text-[0.75rem] text-slate-600" />
          <span>{user.phone}</span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="text-[0.6rem] uppercase tracking-widest text-slate-500">Login ID</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">{user.loginId ?? user.login_id ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <p className="text-[0.6rem] uppercase tracking-widest text-slate-500">Joined</p>
          <p className="mt-0.5 text-sm font-bold text-slate-100">{formatDateLabel(user.createdAt ?? user.created_at)}</p>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={() => onToggle(user)}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition disabled:opacity-50 ${
          isSuspended
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
            : 'border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
        }`}
      >
        {isSuspended
          ? <><CheckCircleRoundedIcon className="text-[0.85rem]" /> Reactivate</>
          : <><BlockRoundedIcon className="text-[0.85rem]" /> Suspend</>}
      </button>
    </motion.div>
  )
}

const FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'customer',   label: 'Customers' },
  { key: 'restaurant', label: 'Managers' },
  { key: 'suspended',  label: 'Suspended' },
]

export default function AdminUsers({ onSectionChange, toast }) {
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')

  const load = async () => {
    setLoading(true)
    try { const data = await api.getAdminUsers(); setUsers(data.users) }
    catch (err) { toast?.(err.message, 'alert', 4000) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (user) => {
    setActionId(user.id)
    try {
      await api.setUserSuspended(user.id, !user.suspended)
      toast?.(`${user.name} ${user.suspended ? 'reactivated' : 'suspended'}.`, 'success')
      await load()
    } catch (err) { toast?.(err.message, 'alert', 4000) }
    finally { setActionId(null) }
  }

  const all = users ?? []
  const filtered = all
    .filter((u) => {
      if (filter === 'suspended') return u.suspended === true
      return filter === 'all' || u.role === filter
    })
    .filter((u) => !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'date') return new Date(b.createdAt ?? b.created_at ?? 0) - new Date(a.createdAt ?? a.created_at ?? 0)
      if (sort === 'role') return a.role.localeCompare(b.role)
      return 0
    })

  const counts = {
    all: all.length,
    customer: all.filter((u) => u.role === 'customer').length,
    restaurant: all.filter((u) => u.role === 'restaurant').length,
    suspended: all.filter((u) => u.suspended).length,
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(10,20,50,0.98),rgba(5,10,28,0.97))] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20">
                <PeopleRoundedIcon className="text-[0.8rem] text-blue-400" />
              </span>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">Admin · Users</p>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">User management</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Manage customers and restaurant managers across your food tech platform.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: `${counts.all} total users`, color: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
                { label: `${counts.customer} customers`, color: 'text-emerald-300', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
                { label: `${counts.restaurant} managers`, color: 'text-amber-300', border: 'border-amber-400/20', bg: 'bg-amber-400/10' },
                { label: `${counts.suspended} suspended`, color: 'text-rose-300', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
              ].map(({ label, color, border, bg }) => (
                <span key={label} className={`flex items-center gap-1.5 rounded-full border ${border} ${bg} px-3 py-1 text-xs font-semibold ${color}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09] disabled:opacity-50"
          >
            <RefreshRoundedIcon className={`text-[0.9rem] ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: 'Total users',  value: counts.all,        color: 'text-white',         bg: 'bg-white/[0.06]',   border: 'border-white/10',       icon: PeopleRoundedIcon },
          { label: 'Customers',    value: counts.customer,   color: 'text-blue-300',      bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: PersonRoundedIcon },
          { label: 'Managers',     value: counts.restaurant, color: 'text-emerald-300',   bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: StorefrontRoundedIcon },
          { label: 'Suspended',    value: counts.suspended,  color: 'text-rose-300',      bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: BlockRoundedIcon },
        ].map(({ label, value, color, bg, border, icon: Icon }) => (
          <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${border} ${bg}`}>
              <Icon className={`text-[0.9rem] ${color}`} />
            </div>
            <p className={`mt-3 text-2xl font-bold sm:text-3xl ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters + search + sort */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:px-4 ${
                filter === f.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {f.label}
              {f.key === 'suspended' && counts.suspended > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-rose-300">
                  {counts.suspended}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-[0.65rem] font-semibold text-slate-500">{filtered.length}</span>
              <button onClick={() => setSearch('')}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 transition">
                <span className="text-[0.6rem]">×</span>
              </button>
            </div>
          )}
        </div>
        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/[0.08]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
                  <div className="h-2.5 w-32 rounded-full bg-white/[0.06]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg bg-white/[0.06]" />
                <div className="h-10 rounded-lg bg-white/[0.06]" />
              </div>
              <div className="h-8 rounded-xl bg-white/[0.06]" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
            <PeopleRoundedIcon className="text-[1.4rem] text-slate-500" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {search ? `No users match "${search}"` : filter === 'suspended' ? 'No suspended users' : 'No users found'}
          </p>
          <p className="text-xs text-slate-500">
            {search ? 'Try a different name or email.' : filter === 'suspended' ? 'All users are currently active.' : 'Users will appear here once they sign up.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} onToggle={handleToggle} loading={actionId === user.id} />
          ))}
        </div>
      )}
    </div>
  )
}
