import { useState } from 'react'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { CARD, INNER, FeedItem, SupportCard, SupportHeader } from './components/SupportCards'

const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low']

export default function AdminSupport({ dashboard, onSectionChange }) {
  const [resolvedIds, setResolvedIds] = useState(new Set())
  const [priorityFilter, setPriorityFilter] = useState('All')

  const allQueue = dashboard.supportQueue ?? []
  const activityFeed = dashboard.activityFeed ?? []
  const activeQueue = allQueue
    .filter((i) => !resolvedIds.has(i.id))
    .filter((i) => priorityFilter === 'All' || i.priority === priorityFilter)

  const handleResolve = (id) => setResolvedIds((prev) => new Set([...prev, id]))

  return (
    <div className="space-y-5 sm:space-y-6">

      <SupportHeader dashboard={dashboard} onSectionChange={onSectionChange} resolvedCount={resolvedIds.size} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total tasks', value: allQueue.length,                                         color: 'text-white',       bg: 'bg-white/[0.06]',   border: 'border-white/10' },
          { label: 'High',        value: allQueue.filter((i) => i.priority === 'High').length,   color: 'text-rose-300',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
          { label: 'Medium',      value: allQueue.filter((i) => i.priority === 'Medium').length, color: 'text-amber-300',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
          { label: 'Resolved',    value: resolvedIds.size,                                        color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
            <p className={`text-2xl font-bold sm:text-3xl ${color}`}>{value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">

        <div className={`${CARD} p-5`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Active queue</p>
              <h2 className="mt-1 text-base font-bold text-white">{activeQueue.length} open {priorityFilter !== 'All' ? `· ${priorityFilter}` : ''}</h2>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
              <FilterListRoundedIcon className="ml-1 text-[0.85rem] text-slate-500" />
              {PRIORITY_FILTERS.map((f) => (
                <button key={f} onClick={() => setPriorityFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-[0.65rem] font-semibold transition ${priorityFilter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="popLayout">
            {activeQueue.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-10">
                <CheckCircleRoundedIcon className="text-[1.8rem] text-emerald-500/40" />
                <p className="text-sm font-semibold text-slate-300">
                  {resolvedIds.size > 0 ? 'All tasks resolved!' : priorityFilter !== 'All' ? `No ${priorityFilter} priority tasks` : 'Queue is clear'}
                </p>
                <p className="text-xs text-slate-500">
                  {resolvedIds.size > 0 ? `You resolved ${resolvedIds.size} task${resolvedIds.size > 1 ? 's' : ''} this session.` : 'Great work keeping the platform healthy.'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {activeQueue.map((item, i) => <SupportCard key={item.id} item={item} index={i} onResolve={handleResolve} />)}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className={`${CARD} p-5`}>
          <div className="mb-4">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Activity feed</p>
            <h2 className="mt-1 text-base font-bold text-white">{activityFeed.length} recent events</h2>
          </div>
          {activityFeed.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-10">
              <BoltRoundedIcon className="text-[1.5rem] text-slate-600" />
              <p className="text-sm text-slate-500">No recent activity.</p>
            </div>
          ) : (
            <div>{activityFeed.map((item, i) => <FeedItem key={item.id} item={item} isLast={i === activityFeed.length - 1} />)}</div>
          )}
        </div>
      </div>

      {(dashboard.guidance ?? []).length > 0 && (
        <div className={`${CARD} p-5`}>
          <p className="mb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Admin guidance</p>
          <div className="space-y-2">
            {dashboard.guidance.map((note, i) => (
              <div key={i} className={`${INNER} flex gap-3 p-3`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-[0.65rem] font-bold text-blue-400">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-6 text-slate-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
