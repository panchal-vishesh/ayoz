import { motion } from 'framer-motion'
import { clampFill } from '../../shared'

const T = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-300',    bar: 'bg-blue-500',    glow: 'bg-blue-500/20' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-300', bar: 'bg-emerald-500', glow: 'bg-emerald-500/20' },
  amber:   { bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   text: 'text-amber-300',   bar: 'bg-amber-400',   glow: 'bg-amber-400/20' },
  brand:   { bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  text: 'text-orange-300',  bar: 'bg-orange-500',  glow: 'bg-orange-500/20' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-300',    bar: 'bg-rose-500',    glow: 'bg-rose-500/20' },
  slate:   { bg: 'bg-white/[0.06]',   border: 'border-white/10',       text: 'text-slate-300',   bar: 'bg-slate-400',   glow: 'bg-white/10' },
}
export const tone = (k) => T[k] ?? T.slate

export const CARD = 'rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.65)] backdrop-blur-sm'
export const INNER = 'rounded-xl border border-white/[0.06] bg-white/[0.03]'

import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'

const KPI_ICONS = {
  'Restaurants live':  StorefrontRoundedIcon,
  'Customer accounts': PeopleRoundedIcon,
  'Restaurant logins': KeyRoundedIcon,
  'GMV today':         TrendingUpRoundedIcon,
}

export function KpiCard({ item, index }) {
  const c = tone(item.tone)
  const Icon = KPI_ICONS[item.label] ?? BoltRoundedIcon
  const rawValue = Number(String(item.value ?? '0').replace(/[^0-9.]/g, '')) || 0
  const targets = { 'Restaurants live': 10, 'Customer accounts': 50, 'Restaurant logins': 10, 'GMV today': 100000 }
  const target = targets[item.label] ?? 100
  const fill = Math.min(100, Math.round((rawValue / target) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`${CARD} relative overflow-hidden p-5`}
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl ${c.glow} opacity-60`} />
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}>
          <Icon className={`text-[1.1rem] ${c.text}`} />
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest ${c.border} ${c.bg} ${c.text}`}>
          {fill}%
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{item.value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-300">{item.label}</p>
      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{item.detail}</p>
      <div className="mt-3 h-1 rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${fill}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          className={`h-full rounded-full ${c.bar}`}
        />
      </div>
      <p className="mt-1.5 text-[0.6rem] text-slate-600">Target: {targets[item.label]?.toLocaleString('en-IN') ?? '100'}</p>
    </motion.div>
  )
}

export function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-start justify-between gap-2 mb-4">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
        <h2 className="mt-1 text-base font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function PulseBar({ item }) {
  const c = tone(item.tone)
  const fill = clampFill(item.fill)
  return (
    <div className={`${INNER} px-4 py-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.label}</p>
          <p className="text-xs text-slate-500 truncate">{item.detail}</p>
        </div>
        <p className={`shrink-0 text-sm font-bold ${c.text}`}>{item.value}</p>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-white/[0.06]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${fill}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`h-full rounded-full ${c.bar}`} />
      </div>
    </div>
  )
}

export function CityCard({ item }) {
  const fill = clampFill(item.fill)
  const r = 18, cx = 22, circ = 2 * Math.PI * r
  const dash = (fill / 100) * circ
  return (
    <div className={`${INNER} flex items-center gap-3 px-4 py-3`}>
      <svg width={44} height={44} className="-rotate-90 shrink-0">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <circle cx={cx} cy={cx} r={r} fill="none" className="stroke-blue-400" strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.city}</p>
          <p className="shrink-0 text-sm font-bold text-slate-100">{item.revenue}</p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-slate-500 truncate">{item.restaurants} venues · {item.orders} orders</p>
          <p className="shrink-0 text-xs font-semibold text-emerald-400">{item.readiness}</p>
        </div>
      </div>
    </div>
  )
}

const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-orange-400', 'text-slate-500', 'text-slate-500']

export function LeaderRow({ item, rank }) {
  const revenue = item.stats?.todayRevenue
  const hasRevenue = revenue && Number(String(revenue).replace(/[^0-9.]/g, '')) > 0
  return (
    <div className={`${INNER} flex items-center gap-3 px-4 py-3`}>
      <span className={`w-5 shrink-0 text-center text-sm font-bold ${RANK_COLORS[rank - 1] ?? 'text-slate-500'}`}>{rank}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.name}</p>
          <p className={`shrink-0 text-sm font-bold ${hasRevenue ? 'text-emerald-300' : 'text-slate-600'}`}>
            {hasRevenue ? revenue : '—'}
          </p>
        </div>
        <p className="text-xs text-slate-500 truncate">{item.city} · {item.stats?.todayOrders ?? '—'} orders · {item.stats?.readyRate ?? '—'} ready</p>
      </div>
    </div>
  )
}

export function LeaderGrid({ item, rank }) {
  const c = tone(rank === 1 ? 'amber' : rank === 2 ? 'slate' : 'brand')
  return (
    <div className={`relative overflow-hidden rounded-xl border ${c.border} ${c.bg} p-3 sm:p-4`}>
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className={`text-sm font-bold ${RANK_COLORS[rank - 1] ?? 'text-slate-500'}`}>#{rank}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-widest ${c.border} ${c.bg} ${c.text}`}>{item.city}</span>
      </div>
      <p className="text-sm font-bold text-slate-100 truncate leading-snug">{item.name}</p>
      <p className="mt-0.5 text-[0.65rem] text-slate-500 truncate">{item.cuisine}</p>
      <div className="mt-3 space-y-1.5">
        {[
          { label: 'Revenue', value: item.stats?.todayRevenue, color: 'text-emerald-300' },
          { label: 'Orders',  value: item.stats?.todayOrders,  color: 'text-slate-200' },
          { label: 'Ready',   value: item.stats?.readyRate,    color: 'text-blue-300' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <p className="text-[0.6rem] text-slate-500 uppercase tracking-widest">{label}</p>
            <p className={`text-xs font-bold ${color} truncate`}>{value ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActivityItem({ item }) {
  const c = tone(item.tone)
  return (
    <div className={`${INNER} flex gap-3 px-4 py-3`}>
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${c.bar}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.title}</p>
          <p className="shrink-0 text-xs text-slate-500">{item.time}</p>
        </div>
        <p className="text-xs text-slate-500 truncate">{item.restaurantName} · {item.detail}</p>
      </div>
    </div>
  )
}

const PRIORITY_BADGE = {
  High:   'border-rose-500/20 bg-rose-500/10 text-rose-300',
  Medium: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  Low:    'border-blue-500/20 bg-blue-500/10 text-blue-300',
}

export function SupportItem({ item, onResolve }) {
  const badge = PRIORITY_BADGE[item.priority] ?? PRIORITY_BADGE.Low
  return (
    <div className={`${INNER} flex items-start gap-3 px-4 py-3`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.issue}</p>
          <div className="flex items-center gap-1.5">
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest ${badge}`}>{item.priority}</span>
            <button onClick={() => onResolve(item.id)} title="Mark as resolved"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20">
              <span className="text-[0.65rem] font-bold">✓</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 truncate">{item.restaurantName} · {item.owner} · {item.eta}</p>
      </div>
    </div>
  )
}

import { formatDateLabel } from '../../shared'

export function CredChip({ item }) {
  return (
    <div className={`${INNER} flex items-start gap-3 p-3 sm:p-4`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
        <KeyRoundedIcon className="text-[0.9rem] text-amber-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.restaurantName}</p>
          <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] font-bold text-amber-300">{item.loginId}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500 truncate">{item.contactEmail}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.serviceModel && <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[0.6rem] text-slate-400">{item.serviceModel}</span>}
          {item.seatingCapacity && <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[0.6rem] text-slate-400">{item.seatingCapacity} seats</span>}
          <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[0.6rem] text-slate-400">{item.issuedAt ? formatDateLabel(item.issuedAt) : 'Date unknown'}</span>
        </div>
      </div>
    </div>
  )
}

export function HealthRing({ score }) {
  const r = 36, cx = 44, circ = 2 * Math.PI * r
  const dash = (clampFill(score) / 100) * circ
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'
  const label = score >= 75 ? 'Healthy' : score >= 50 ? 'Moderate' : 'Critical'
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-[88px] w-[88px] items-center justify-center">
        <svg width={88} height={88} className="-rotate-90 absolute inset-0">
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className="text-xl font-bold text-white">{score}</span>
      </div>
      <div>
        <p className="text-lg font-bold" style={{ color }}>{label}</p>
        <p className="text-xs text-slate-500">Platform health</p>
        <p className="mt-1 text-[0.65rem] text-slate-600">Updated just now</p>
      </div>
    </div>
  )
}

export function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/[0.10] bg-white/[0.04] p-1">
      {['list', 'grid'].map((key) => (
        <button key={key} onClick={() => onChange(key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${value === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  )
}
