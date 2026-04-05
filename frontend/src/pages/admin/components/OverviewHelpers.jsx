import { useState } from 'react'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { CARD, INNER } from './OverviewCards'

export function GuidanceSection({ items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${CARD} overflow-hidden`}>
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 p-5 text-left">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Admin guidance</p>
          <h2 className="mt-1 text-base font-bold text-white">Platform notes</h2>
        </div>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="space-y-2 px-5 pb-5">
              {items.map((note, i) => (
                <div key={i} className={`${INNER} flex gap-3 p-3`}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[0.65rem] font-bold text-blue-400">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-6 text-slate-400">{note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-pulse">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7">
        <div className="h-3 w-40 rounded-full bg-white/[0.08]" />
        <div className="mt-4 h-9 w-64 rounded-xl bg-white/[0.08]" />
        <div className="mt-3 h-4 w-96 rounded-full bg-white/[0.06]" />
        <div className="mt-4 flex gap-2">{[1,2,3,4].map((i) => <div key={i} className="h-6 w-24 rounded-full bg-white/[0.06]" />)}</div>
        <div className="mt-4 flex gap-2">{[1,2,3,4].map((i) => <div key={i} className="h-9 w-28 rounded-xl bg-white/[0.06]" />)}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="h-10 w-10 rounded-xl bg-white/[0.08]" />
            <div className="mt-4 h-8 w-16 rounded-lg bg-white/[0.08]" />
            <div className="mt-2 h-3 w-24 rounded-full bg-white/[0.06]" />
            <div className="mt-3 h-1 rounded-full bg-white/[0.06]" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
        <div className="h-4 w-32 rounded-full bg-white/[0.08]" />
        <div className="mt-2 h-5 w-48 rounded-lg bg-white/[0.08]" />
        <div className="mt-4 h-52 rounded-xl bg-white/[0.04]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1,2].map((i) => (
          <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <div className="h-4 w-24 rounded-full bg-white/[0.08]" />
            <div className="mt-2 h-5 w-36 rounded-lg bg-white/[0.08]" />
            <div className="mt-4 space-y-2">{[1,2,3].map((j) => <div key={j} className="h-12 rounded-xl bg-white/[0.04]" />)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
