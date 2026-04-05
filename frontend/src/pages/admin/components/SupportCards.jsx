import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { motion } from 'framer-motion'

export const CARD = 'rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.65)] backdrop-blur-sm'
export const INNER = 'rounded-xl border border-white/[0.06] bg-white/[0.03]'

export const PRIORITY_STYLE = {
  High:   { badge: 'border-rose-500/20 bg-rose-500/10 text-rose-300',   dot: 'bg-rose-400',   glow: 'bg-rose-500/10' },
  Medium: { badge: 'border-amber-400/20 bg-amber-400/10 text-amber-300', dot: 'bg-amber-400',  glow: 'bg-amber-400/10' },
  Low:    { badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',    dot: 'bg-blue-400',   glow: 'bg-blue-500/10' },
}

export const TONE_DOT = {
  brand: 'bg-orange-400', amber: 'bg-amber-400', blue: 'bg-blue-400',
  emerald: 'bg-emerald-400', slate: 'bg-slate-400', rose: 'bg-rose-400',
}

export function SupportHeader({ dashboard, onSectionChange, resolvedCount }) {
  const queue = dashboard.supportQueue ?? []
  const highCount = queue.filter((i) => i.priority === 'High').length
  const medCount = queue.filter((i) => i.priority === 'Medium').length

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(10,20,50,0.98),rgba(5,10,28,0.97))] p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20"><HeadsetMicRoundedIcon className="text-[0.8rem] text-blue-400" /></span>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">Admin · Support</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Support desk</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track open tasks, monitor activity, and keep your food tech platform running smoothly.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: `${queue.length} active tasks`, color: 'text-blue-300',    border: 'border-blue-500/20',    bg: 'bg-blue-500/10' },
              { label: `${highCount} high priority`,   color: 'text-rose-300',    border: 'border-rose-500/20',    bg: 'bg-rose-500/10' },
              { label: `${medCount} medium`,           color: 'text-amber-300',   border: 'border-amber-400/20',   bg: 'bg-amber-400/10' },
              { label: `${resolvedCount} resolved`,    color: 'text-emerald-300', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
            ].map(({ label, color, border, bg }) => (
              <span key={label} className={`flex items-center gap-1.5 rounded-full border ${border} ${bg} px-3 py-1 text-xs font-semibold ${color}`}>{label}</span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => onSectionChange('overview')} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              <DashboardRoundedIcon className="text-[1rem]" /> Overview
            </button>
            <button onClick={() => onSectionChange('restaurants')} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]">
              <StorefrontRoundedIcon className="text-[1rem]" /> Restaurants
            </button>
          </div>
        </div>
        <div className={`${INNER} p-4 min-w-[160px]`}>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500 mb-3">Priority breakdown</p>
          {[
            { label: 'High',   count: highCount,                                         color: 'bg-rose-500',  text: 'text-rose-300' },
            { label: 'Medium', count: medCount,                                           color: 'bg-amber-400', text: 'text-amber-300' },
            { label: 'Low',    count: queue.filter((i) => i.priority === 'Low').length,  color: 'bg-blue-500',  text: 'text-blue-300' },
          ].map(({ label, count, color, text }) => (
            <div key={label} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${text}`}>{label}</span>
                <span className={`text-xs font-bold ${text}`}>{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <motion.div initial={{ width: 0 }} animate={{ width: queue.length > 0 ? `${(count / queue.length) * 100}%` : '0%' }} transition={{ duration: 0.7, ease: 'easeOut' }} className={`h-full rounded-full ${color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SupportCard({ item, index, onResolve }) {
  const p = PRIORITY_STYLE[item.priority] ?? PRIORITY_STYLE.Low
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: index * 0.05 }}
      className={`${CARD} relative overflow-hidden p-4 sm:p-5`}>
      <div className={`pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-bl-3xl blur-2xl ${p.glow}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <StorefrontRoundedIcon className="text-[0.9rem] text-slate-400" />
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">{item.restaurantName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${p.badge}`}>{item.priority}</span>
          <button onClick={() => onResolve(item.id)} title="Mark as resolved"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20">
            <CheckCircleRoundedIcon className="text-[0.9rem]" />
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{item.issue}</p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><FlagRoundedIcon className="text-[0.8rem]" /> {item.owner}</span>
        <span className="flex items-center gap-1"><AccessTimeRoundedIcon className="text-[0.8rem]" /> {item.eta}</span>
        <span className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold ${p.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />{item.tone ?? 'pending'}
        </span>
      </div>
    </motion.div>
  )
}

export function FeedItem({ item, isLast }) {
  const dot = TONE_DOT[item.tone] ?? TONE_DOT.slate
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 flex flex-col items-center gap-1">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot} ring-2 ring-[rgba(15,20,40,1)]`} />
        {!isLast && <span className="w-px flex-1 bg-white/[0.06]" />}
      </div>
      <div className={`${INNER} min-w-0 flex-1 mb-2 p-3 sm:p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100">{item.title}</p>
          <p className="text-xs text-slate-500">{item.time}</p>
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-400">{item.restaurantName}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
      </div>
    </div>
  )
}
