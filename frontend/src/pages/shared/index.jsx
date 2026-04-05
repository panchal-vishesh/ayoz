import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'

export const ROLE_THEMES = {
  admin: {
    surface: 'rounded-[30px] border border-blue-500/[0.2] bg-[linear-gradient(145deg,rgba(12,24,52,0.98),rgba(5,11,28,0.96))] shadow-[0_24px_80px_rgba(59,130,246,0.14),inset_0_1px_0_rgba(96,165,250,0.14)] backdrop-blur-2xl',
    card: 'rounded-[20px] border border-blue-400/[0.18] bg-[linear-gradient(145deg,rgba(13,22,46,0.98),rgba(7,12,28,0.98))] shadow-[0_14px_36px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(96,165,250,0.08)]',
    badge: 'border-blue-400/20 bg-blue-500/[0.10] text-blue-100',
    border: 'border-blue-400/20',
    accent: 'text-blue-100',
    button: 'blue',
    ghost: 'blue-ghost',
    glow: 'bg-blue-500/[0.18]',
  },
  restaurant: {
    surface: 'rounded-[30px] border border-emerald-400/[0.2] bg-[linear-gradient(145deg,rgba(8,24,26,0.98),rgba(4,14,14,0.96))] shadow-[0_24px_80px_rgba(16,185,129,0.14),inset_0_1px_0_rgba(110,231,183,0.12)] backdrop-blur-2xl',
    card: 'rounded-[20px] border border-emerald-400/[0.18] bg-[linear-gradient(145deg,rgba(8,22,24,0.98),rgba(4,12,14,0.98))] shadow-[0_14px_36px_rgba(16,185,129,0.11),inset_0_1px_0_rgba(110,231,183,0.07)]',
    badge: 'border-emerald-400/20 bg-emerald-500/[0.10] text-emerald-100',
    border: 'border-emerald-400/20',
    accent: 'text-emerald-100',
    button: 'emerald',
    ghost: 'emerald-ghost',
    glow: 'bg-emerald-500/[0.18]',
  },
  customer: {
    surface: 'rounded-[30px] border border-orange-400/[0.2] bg-[linear-gradient(145deg,rgba(26,17,12,0.97),rgba(8,12,22,0.97))] shadow-[0_24px_80px_rgba(249,115,22,0.15),inset_0_1px_0_rgba(253,186,116,0.12)] backdrop-blur-2xl',
    card: 'rounded-[20px] border border-orange-400/[0.18] bg-[linear-gradient(145deg,rgba(24,16,12,0.98),rgba(8,10,18,0.98))] shadow-[0_14px_36px_rgba(249,115,22,0.12),inset_0_1px_0_rgba(253,186,116,0.07)]',
    badge: 'border-orange-400/20 bg-orange-500/[0.10] text-orange-100',
    border: 'border-orange-400/20',
    accent: 'text-orange-100',
    button: 'primary',
    ghost: 'orange-ghost',
    glow: 'bg-orange-500/[0.18]',
  },
}

export const TONE_STYLES = {
  brand:   { badge: 'border-orange-400/20 bg-orange-500/[0.10] text-orange-100',   dot: 'bg-orange-400',  glow: 'bg-orange-500/[0.14]',  bar: 'from-orange-300 via-orange-400 to-orange-500' },
  amber:   { badge: 'border-amber-300/20 bg-amber-300/[0.10] text-amber-100',      dot: 'bg-amber-300',   glow: 'bg-amber-300/[0.14]',   bar: 'from-amber-200 via-amber-300 to-amber-400' },
  blue:    { badge: 'border-blue-400/20 bg-blue-500/[0.10] text-blue-100',         dot: 'bg-blue-400',    glow: 'bg-blue-500/[0.14]',    bar: 'from-blue-300 via-blue-400 to-blue-500' },
  emerald: { badge: 'border-emerald-400/20 bg-emerald-500/[0.10] text-emerald-100',dot: 'bg-emerald-400', glow: 'bg-emerald-500/[0.14]', bar: 'from-emerald-300 via-emerald-400 to-emerald-500' },
  rose:    { badge: 'border-rose-300/20 bg-rose-400/[0.10] text-rose-100',         dot: 'bg-rose-400',    glow: 'bg-rose-500/[0.14]',    bar: 'from-rose-300 via-rose-400 to-rose-500' },
  slate:   { badge: 'border-white/10 bg-white/[0.05] text-slate-200',              dot: 'bg-slate-300',   glow: 'bg-white/[0.10]',       bar: 'from-slate-300 via-slate-400 to-slate-500' },
}

export function clampFill(value) {
  const n = Number(value ?? 0)
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0
}

export function getToneStyle(tone) {
  return TONE_STYLES[tone] ?? TONE_STYLES.slate
}

export function formatDateLabel(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export function getFirstName(value) {
  return String(value ?? '').trim().split(/\s+/).filter(Boolean)[0] || 'Guest'
}

export function RoleBadge({ theme, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.2em] ${theme.badge} ${className}`}>
      {children}
    </span>
  )
}

export function TonePill({ tone = 'slate', children, className = '' }) {
  const style = getToneStyle(tone)
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${style.badge} ${className}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {children}
    </span>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/12 bg-white/[0.03] p-6 text-center">
      <p className="text-sm font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  )
}

export function MiniMetric({ label, value }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 font-display text-2xl tracking-[-0.05em] text-slate-50">{value}</p>
    </div>
  )
}

export function WorkspaceHero({ theme, icon: Icon, eyebrow, title, description, badges = [], actions = [] }) {
  return (
    <section className={`${theme.surface} relative overflow-hidden p-5 sm:p-6`}>
      <div className={`pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full blur-3xl ${theme.glow}`} />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <RoleBadge theme={theme}>
        <BoltRoundedIcon fontSize="inherit" className="text-[0.85rem]" />
        {eyebrow}
      </RoleBadge>

      <div className="mt-4 flex items-start gap-3">
        <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] border bg-white/[0.06] ${theme.border}`}>
          <Icon fontSize="inherit" className={`text-[1.4rem] ${theme.accent}`} />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-[-0.06em] text-slate-50 sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300/80">{description}</p>
        </div>
      </div>

      {badges.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.slice(0, 3).map((badge) => (
            <RoleBadge key={badge} theme={theme} className="bg-white/[0.04] text-slate-200">{badge}</RoleBadge>
          ))}
        </div>
      ) : null}

      {actions.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map(({ key, label, onClick, variant, icon: ActionIcon = ArrowOutwardRoundedIcon }) => (
            <Button key={key} variant={variant} onClick={onClick}>
              {label}
              <ActionIcon fontSize="inherit" className="text-[0.92rem]" />
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function DashboardPanel({ theme, eyebrow, title, action, className = '', children }) {
  return (
    <section className={`${theme.card} relative overflow-hidden p-4 sm:p-5 ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {eyebrow || title ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {eyebrow ? <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p> : null}
            {title ? <h2 className="mt-1 font-display text-xl tracking-[-0.05em] text-slate-50">{title}</h2> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function MetricCard({ item, index, theme, onClick }) {
  const tone = getToneStyle(item.tone)
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={onClick}
      className={`${theme.card} relative overflow-hidden p-5 ${onClick ? 'cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-150' : ''}`}
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${tone.glow}`} />
      <TonePill tone={item.tone}>{item.label}</TonePill>
      <p className="mt-4 font-display text-4xl tracking-[-0.06em] text-slate-50">{item.value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300/75">{item.detail}</p>
    </motion.div>
  )
}

export function MetricsGrid({ items = [], theme, onCardClick }) {
  if (!items.length) return null
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <MetricCard key={`${item.label}-${index}`} item={item} index={index} theme={theme} onClick={onCardClick ? () => onCardClick(item) : undefined} />
      ))}
    </div>
  )
}

export function ProgressRows({ items = [] }) {
  if (!items.length) return <EmptyState title="Nothing to show yet" description="Metrics will appear here as activity comes in." />
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const tone = getToneStyle(item.tone)
        const fill = clampFill(item.fill)
        return (
          <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-50">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
              </div>
              <TonePill tone={item.tone}>{item.value}</TonePill>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function GuidanceItems({ items = [] }) {
  if (!items.length) return <EmptyState title="No guidance right now" description="This workspace is ready for the next update." />
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-slate-200">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="text-sm leading-6 text-slate-300/80">{item}</p>
        </div>
      ))}
    </div>
  )
}

export function ActivityFeed({ items = [] }) {
  if (!items.length) return <EmptyState title="No activity yet" description="New workspace events will show up here." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <TonePill tone={item.tone}>{item.time}</TonePill>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.restaurantName}</p>
          </div>
          <p className="mt-4 text-base font-semibold text-slate-50">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300/75">{item.detail}</p>
        </div>
      ))}
    </div>
  )
}
