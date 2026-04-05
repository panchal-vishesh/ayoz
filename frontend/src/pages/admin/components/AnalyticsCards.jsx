import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import { motion } from 'framer-motion'
import { clampFill } from '../../shared'

export const CARD = 'rounded-2xl border border-white/[0.08] bg-[rgba(15,20,40,0.65)] backdrop-blur-sm'
export const INNER = 'rounded-xl border border-white/[0.06] bg-white/[0.03]'

const TONE = {
  blue:    { bar: 'bg-blue-500',    text: 'text-blue-300',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    glow: 'bg-blue-500/20' },
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'bg-emerald-500/20' },
  amber:   { bar: 'bg-amber-400',   text: 'text-amber-300',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   glow: 'bg-amber-400/20' },
  slate:   { bar: 'bg-slate-400',   text: 'text-slate-300',   bg: 'bg-white/[0.06]',   border: 'border-white/10',       glow: 'bg-white/10' },
  brand:   { bar: 'bg-orange-500',  text: 'text-orange-300',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  glow: 'bg-orange-500/20' },
}
export const t = (k) => TONE[k] ?? TONE.slate

export function parseNum(v) {
  const n = Number(String(v ?? '0').replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function TrendArrow({ value }) {
  const n = parseNum(value)
  if (n === 0) return null
  if (n >= 90) return <TrendingUpRoundedIcon className="text-[0.85rem] text-emerald-400" />
  if (n >= 50) return null
  return <TrendingDownRoundedIcon className="text-[0.85rem] text-rose-400" />
}

export function EmptyState({ icon: Icon = BoltRoundedIcon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-10">
      <Icon className="text-[1.5rem] text-slate-600" />
      <p className="text-sm font-semibold text-slate-400">{title}</p>
      {description && <p className="text-xs text-slate-600">{description}</p>}
    </div>
  )
}

export function MetricTile({ item, index }) {
  const c = t(item.tone)
  const LABELS = { blue: 'Growth', emerald: 'Strong', amber: 'Watch', brand: 'Hot', slate: 'Stable' }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className={`${CARD} relative overflow-hidden p-4 sm:p-5`}>
      <div className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl ${c.glow} opacity-50`} />
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 truncate">{item.label}</p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.58rem] font-bold ${c.border} ${c.bg} ${c.text}`}>{LABELS[item.tone] ?? 'Live'}</span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{item.value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <TrendArrow value={item.value} />
        <p className="text-xs text-slate-500 line-clamp-1">{item.detail}</p>
      </div>
    </motion.div>
  )
}

export function AnalyticsPulseBar({ item }) {
  const c = t(item.tone)
  const fill = clampFill(item.fill)
  return (
    <div className={`${INNER} px-4 py-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.label}</p>
          <p className="text-xs text-slate-500 truncate">{item.detail}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <TrendArrow value={fill} />
          <p className={`text-sm font-bold ${c.text}`}>{item.value}</p>
        </div>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-white/[0.06]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} className={`h-full rounded-full ${c.bar}`} />
      </div>
    </div>
  )
}

export function AnalyticsCityCard({ item, rank }) {
  const fill = clampFill(item.fill)
  const r = 16, cx = 20, circ = 2 * Math.PI * r
  const dash = (fill / 100) * circ
  const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-orange-400']
  return (
    <div className={`${INNER} flex items-center gap-3 px-4 py-3`}>
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <svg width={40} height={40} className="-rotate-90 absolute inset-0">
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#3b82f6" strokeWidth={3} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className={`text-xs font-bold ${RANK_COLORS[rank - 1] ?? 'text-slate-500'}`}>#{rank}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate">{item.city}</p>
          <p className="shrink-0 text-sm font-bold text-emerald-300">{parseNum(item.revenue?.replace?.(/[^0-9.]/g, '') ?? item.revenue) > 0 ? item.revenue : '—'}</p>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-slate-500 truncate">{item.restaurants} venues · {item.orders} orders</p>
          <p className="shrink-0 text-xs font-semibold text-blue-400">{item.readiness}</p>
        </div>
      </div>
    </div>
  )
}

export function StarPerformer({ restaurants }) {
  if (!restaurants.length) return null
  const star = [...restaurants].sort((a, b) => parseNum(b.stats?.readyRate) - parseNum(a.stats?.readyRate))[0]
  if (!star) return null
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <EmojiEventsRoundedIcon className="text-[1.1rem] text-amber-400" />
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Star performer</p>
          <h2 className="text-base font-bold text-white">Top venue this session</h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
          <StorefrontRoundedIcon className="text-[1.4rem] text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-white truncate">{star.name}</p>
          <p className="text-xs text-slate-500">{star.city} · {star.cuisine}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Ready rate', value: star.stats?.readyRate,    color: 'text-emerald-300' },
            { label: 'Orders',     value: star.stats?.todayOrders,  color: 'text-blue-300' },
            { label: 'Revenue',    value: star.stats?.todayRevenue, color: 'text-amber-300' },
            { label: 'Avg prep',   value: star.stats?.avgPrepMins,  color: 'text-slate-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`${INNER} px-3 py-2 text-center min-w-[72px]`}>
              <p className="text-[0.6rem] uppercase tracking-widest text-slate-500">{label}</p>
              <p className={`mt-0.5 text-sm font-bold ${color}`}>{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FoodTechMetrics({ restaurants }) {
  const totalAlerts = restaurants.reduce((s, r) => s + parseNum(r.stats?.arrivalAlerts), 0)
  const avgPrep = restaurants.length ? Math.round(restaurants.reduce((s, r) => s + parseNum(r.stats?.avgPrepMins), 0) / restaurants.length) : 0
  const avgReady = restaurants.length ? Math.round(restaurants.reduce((s, r) => s + parseNum(r.stats?.readyRate), 0) / restaurants.length) : 0
  const avgTurn = restaurants.length ? Math.round(restaurants.reduce((s, r) => s + parseNum(r.stats?.tableTurnMins), 0) / restaurants.length) : 0

  const metrics = [
    { label: 'Arrival alerts fired', value: totalAlerts > 0 ? String(totalAlerts) : '—', icon: NotificationsActiveRoundedIcon, color: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/20', detail: 'Geo-triggered kitchen starts today' },
    { label: 'Avg prep time',        value: avgPrep > 0 ? `${avgPrep} mins` : '—',       icon: TimerRoundedIcon,                color: 'text-blue-300',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   detail: 'From trigger to hot pass' },
    { label: 'Hot-serve rate',       value: avgReady > 0 ? `${avgReady}%` : '—',         icon: WhatshotRoundedIcon,             color: 'text-emerald-300',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',detail: 'Meals ready when guests sit' },
    { label: 'Table turn time',      value: avgTurn > 0 ? `${avgTurn} mins` : '—',       icon: TrendingUpRoundedIcon,           color: 'text-amber-300',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  detail: 'Avg reset between covers' },
  ]

  return (
    <div className={`${CARD} p-5`}>
      <div className="mb-4">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Food tech signals</p>
        <h2 className="mt-1 text-base font-bold text-white">Arrival-based kitchen metrics</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color, bg, border, detail }) => (
          <div key={label} className={`${INNER} p-4`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${border} ${bg}`}>
              <Icon className={`text-[1rem] ${color}`} />
            </div>
            <p className={`mt-3 text-2xl font-bold ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-300">{label}</p>
            <p className="mt-0.5 text-[0.65rem] text-slate-600 line-clamp-1">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalyticsHeader({ dashboard, onSectionChange }) {
  const restaurants = dashboard.restaurants ?? []
  const cities = dashboard.cityPerformance ?? []
  const totalRevenue = restaurants.reduce((s, r) => s + parseNum(r.stats?.todayRevenue), 0)
  const totalOrders = restaurants.reduce((s, r) => s + parseNum(r.stats?.todayOrders), 0)
  const totalAlerts = restaurants.reduce((s, r) => s + parseNum(r.stats?.arrivalAlerts), 0)
  const avgPrep = restaurants.length ? Math.round(restaurants.reduce((s, r) => s + parseNum(r.stats?.avgPrepMins), 0) / restaurants.length) : 0

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(10,20,50,0.98),rgba(5,10,28,0.97))] p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20"><AutoGraphRoundedIcon className="text-[0.8rem] text-blue-400" /></span>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">Admin · Analytics</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Rollout analytics</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Real-time performance across all venues — revenue, kitchen speed, arrival alerts and city coverage.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: `${restaurants.length} venues`, icon: StorefrontRoundedIcon },
              { label: `${cities.length} cities`, icon: LocationOnRoundedIcon },
              { label: totalOrders > 0 ? `${totalOrders} orders today` : '— orders', icon: WhatshotRoundedIcon },
              { label: totalAlerts > 0 ? `${totalAlerts} arrival alerts` : '— alerts', icon: NotificationsActiveRoundedIcon },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Icon className="text-[0.75rem]" /> {label}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => onSectionChange('overview')} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">Overview</button>
            <button onClick={() => onSectionChange('restaurants')} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]">
              <StorefrontRoundedIcon className="text-[1rem]" /> Venues
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className={`${INNER} px-4 py-3 min-w-[160px]`}>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">GMV today</p>
            <p className="mt-1 text-2xl font-bold text-white">{totalRevenue > 0 ? `INR ${totalRevenue.toLocaleString('en-IN')}` : '—'}</p>
            <p className="text-xs text-slate-500">Across all venues</p>
          </div>
          <div className={`${INNER} px-4 py-3`}>
            <p className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">Avg prep time</p>
            <p className="mt-1 text-2xl font-bold text-white">{avgPrep > 0 ? `${avgPrep} mins` : '—'}</p>
            <p className="text-xs text-slate-500">Kitchen speed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
