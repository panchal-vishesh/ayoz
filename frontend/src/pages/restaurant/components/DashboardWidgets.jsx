import { useState } from 'react'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { motion } from 'framer-motion'
import { clampFill, EmptyState, getToneStyle, TonePill } from '../../shared'

export function RefreshBar({ onRefresh, lastRefreshed }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
      <p className="text-xs text-slate-500">Last refreshed: <span className="text-slate-400">{lastRefreshed}</span></p>
      <button onClick={onRefresh} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white">
        <RefreshRoundedIcon fontSize="inherit" className="text-[0.95rem]" /> Refresh
      </button>
    </div>
  )
}

export function GuestSignalsList({ items = [] }) {
  if (!items.length) return <EmptyState title="No live guests" description="Arrival signals and active tables will show here." />
  const etaPercents = { 'Immediate': 95, 'At table': 100, 'Queued': 45 }
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const etaFill = etaPercents[item.priority] ?? 60
        return (
          <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-50">{item.guestName}</p>
                <p className="mt-1 text-sm text-slate-400">{item.items} items · {item.eta}</p>
              </div>
              <div className="text-right">
                <TonePill tone={item.tone}>{item.status}</TonePill>
                <p className="mt-2 text-sm font-semibold text-slate-100">{item.amount}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><LocationOnRoundedIcon fontSize="inherit" className="text-[0.85rem] text-emerald-400" />GPS approach</span>
                <span>{etaFill}% to arrival</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${etaFill}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.table ? <TonePill tone="slate">{item.table}</TonePill> : null}
              {item.channel ? <TonePill tone="blue">{item.channel}</TonePill> : null}
              {item.priority ? <TonePill tone={item.tone}>{item.priority}</TonePill> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ServiceBoardGrid({ items = [] }) {
  if (!items.length) return <EmptyState title="Service board is empty" description="Live service metrics will appear here." />
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const tone = getToneStyle(item.tone)
        return (
          <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <TonePill tone={item.tone}>{item.label}</TonePill>
            <p className="mt-4 font-display text-3xl tracking-[-0.05em] text-slate-50">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
            <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${clampFill(item.fill)}%` }} transition={{ duration: 0.55, ease: 'easeOut' }} className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FloorZonesList({ items = [] }) {
  if (!items.length) return <EmptyState title="No floor zones" description="Zone coverage will show once tables are configured." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.note}</p>
            </div>
            <TonePill tone={item.status === 'Ready' ? 'emerald' : item.status === 'Watch' ? 'amber' : 'blue'}>{item.status}</TonePill>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>{item.occupancy}</span><span>{item.fill}% occupied</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/[0.06]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${clampFill(item.fill)}%` }} transition={{ duration: 0.55, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChecklistList({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems)
  if (!items.length) return <EmptyState title="No checklist items" description="Shift tasks will appear here." />
  const toggle = (id) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !i.done } : i))
  const doneCount = items.filter((i) => i.done).length
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-400">{doneCount}/{items.length} tasks complete</p>
        <div className="h-1.5 w-32 rounded-full bg-white/[0.06]">
          <motion.div animate={{ width: `${Math.round((doneCount / Math.max(1, items.length)) * 100)}%` }} transition={{ duration: 0.4 }} className="h-full rounded-full bg-emerald-400" />
        </div>
      </div>
      {items.map((item) => (
        <button key={item.id} onClick={() => toggle(item.id)}
          className={`flex w-full gap-3 rounded-[22px] border p-4 text-left transition hover:brightness-110 active:scale-[0.99] ${item.done ? 'border-emerald-400/20 bg-emerald-500/[0.06]' : 'border-white/10 bg-white/[0.04]'}`}>
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${item.done ? 'border-emerald-400/20 bg-emerald-500/[0.10] text-emerald-300' : 'border-amber-300/20 bg-amber-300/[0.10] text-amber-200'}`}>
            <CheckCircleRoundedIcon fontSize="inherit" className="text-[1rem]" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-50">{item.label}</p>
              <TonePill tone={item.done ? 'emerald' : 'amber'}>{item.done ? 'Done' : 'Pending'}</TonePill>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300/75">{item.note}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

export function StaffRosterGrid({ items = [] }) {
  if (!items.length) return <EmptyState title="No staff roster" description="Team coverage will show here once staff are assigned." />
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.role} / {item.shift}</p>
            </div>
            <TonePill tone={item.score >= 94 ? 'emerald' : item.score >= 90 ? 'blue' : 'amber'}>{item.score}%</TonePill>
          </div>
          <p className="mt-4 text-sm text-slate-300/75">{item.status}</p>
        </div>
      ))}
    </div>
  )
}

export function MenuPerformanceList({ items = [] }) {
  if (!items.length) return <EmptyState title="No menu performance data" description="Menu insights will show up here." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.category} / {item.prepMinutes} mins</p>
            </div>
            <p className="text-base font-semibold text-slate-50">{item.price}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <TonePill tone={item.tone}>{item.share}</TonePill>
            <TonePill tone="slate">{item.margin}</TonePill>
            <TonePill tone={item.demand === 'High' ? 'emerald' : 'amber'}>{item.demand}</TonePill>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${clampFill(item.fill)}%` }} transition={{ duration: 0.55, ease: 'easeOut' }} className={`h-full rounded-full bg-gradient-to-r ${getToneStyle(item.tone).bar}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function InventoryAlertsList({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems)
  const dismiss = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  if (!items.length) return <EmptyState title="No inventory alerts" description="All stock levels are healthy." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-50">{item.item}</p>
            <div className="flex items-center gap-2">
              <TonePill tone={item.tone}>{item.level}</TonePill>
              <button onClick={() => dismiss(item.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300" title="Dismiss alert">
                <CloseRoundedIcon fontSize="inherit" className="text-[0.85rem]" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300/75">{item.action}</p>
        </div>
      ))}
    </div>
  )
}

export function EarningsPanel({ overview }) {
  const revenueItem = overview?.find((o) => o.label === 'Revenue today')
  const numericRevenue = Number((revenueItem?.value ?? '₹0').replace(/[^0-9.]/g, '')) || 0
  const ayozFee = Math.round(numericRevenue * 0.1)
  const restaurantEarns = numericRevenue - ayozFee
  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`
  return (
    <div className="rounded-[22px] border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(16,185,129,0.07),rgba(52,211,153,0.03))] p-5">
      <div className="pointer-events-none mb-4 flex items-center gap-2">
        <PaymentsRoundedIcon fontSize="inherit" className="text-emerald-400 text-[1rem]" />
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">Today's earnings breakdown</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm"><span className="text-slate-400">Total order value</span><span className="font-semibold text-slate-100">{fmt(numericRevenue)}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-slate-400">AyoZ platform fee (10%)</span><span className="font-semibold text-rose-300">− {fmt(ayozFee)}</span></div>
        <div className="h-px bg-white/[0.07]" />
        <div className="flex items-center justify-between"><span className="text-sm font-semibold text-emerald-200">You receive</span><span className="font-display text-2xl tracking-[-0.05em] text-emerald-300">{fmt(restaurantEarns)}</span></div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Payout settled to your account by next business day.</p>
    </div>
  )
}

export function SettingsInfoRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/[0.07] bg-white/[0.03] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-300' : 'text-slate-100'}`}>{value}</p>
    </div>
  )
}
