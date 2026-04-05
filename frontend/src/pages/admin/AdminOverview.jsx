import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { RevenueTrendChart } from '../shared/charts'
import HeroBanner from './components/HeroBanner'
import { GuidanceSection, OverviewSkeleton } from './components/OverviewHelpers'
import {
  ActivityItem, CARD, CityCard, CredChip, INNER,
  KpiCard, LeaderGrid, LeaderRow, PulseBar,
  SectionHeader, SupportItem, ViewToggle,
} from './components/OverviewCards'

export default function AdminOverview({ dashboard, onSectionChange, activeSection, onRefresh, loading }) {
  const [leaderView, setLeaderView] = useState('list')
  const [activeTab, setActiveTab] = useState('activity')
  const [resolvedIds, setResolvedIds] = useState(new Set())
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh?.()
    setTimeout(() => setRefreshing(false), 800)
  }

  if (loading) return <OverviewSkeleton />

  const supportQueue = (dashboard.supportQueue ?? []).filter((i) => !resolvedIds.has(i.id))
  const activityFeed = dashboard.activityFeed ?? []
  const restaurants = dashboard.restaurants ?? []
  const topRestaurants = [...restaurants]
    .sort((a, b) => {
      const parse = (v) => { const n = Number(String(v ?? '0').replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0 }
      return parse(b.stats?.todayRevenue) - parse(a.stats?.todayRevenue)
    })
    .slice(0, 5)

  return (
    <div className="space-y-5 sm:space-y-6">

      <HeroBanner dashboard={dashboard} onSectionChange={onSectionChange} activeSection={activeSection} />

      {/* KPI strip */}
      <div className={`${CARD} p-5`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Key metrics</p>
            <h2 className="mt-1 text-base font-bold text-white">Platform at a glance</h2>
          </div>
          <button onClick={handleRefresh} disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.09] disabled:opacity-50">
            <RefreshRoundedIcon className={`text-[0.9rem] ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {(dashboard.overview ?? []).map((item, i) => <KpiCard key={item.label} item={item} index={i} />)}
        </div>
      </div>

      {/* Revenue chart */}
      <div className={`${CARD} p-5`}>
        <SectionHeader eyebrow="Revenue trend" title="Restaurant revenue · today"
          action={restaurants.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /><span className="text-[0.65rem] text-slate-500">Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /><span className="text-[0.65rem] text-slate-500">Orders</span></div>
            </div>
          )}
        />
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <TrendingUpRoundedIcon className="text-[1.3rem] text-slate-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300">No revenue data yet</p>
              <p className="mt-1 text-xs text-slate-500">Add restaurants to start tracking revenue trends</p>
            </div>
            <button onClick={() => onSectionChange('restaurants')}
              className="mt-1 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500">
              <StorefrontRoundedIcon className="text-[0.9rem]" /> Add restaurant
            </button>
          </div>
        ) : (
          <>
            <RevenueTrendChart items={restaurants} />
            <p className="mt-2 text-[0.65rem] text-slate-600 text-center">Showing top 8 restaurants by name · Revenue in INR</p>
          </>
        )}
      </div>

      {/* Leaderboard + City performance */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-5`}>
          <SectionHeader eyebrow="Leaderboard" title="Top restaurants"
            action={topRestaurants.length > 1 ? <ViewToggle value={leaderView} onChange={setLeaderView} /> : null}
          />
          <AnimatePresence mode="wait">
            <motion.div key={leaderView} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={leaderView === 'grid' && topRestaurants.length > 1 ? 'grid grid-cols-1 gap-2 sm:grid-cols-2' : 'space-y-2'}>
              {topRestaurants.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-8">
                  <StorefrontRoundedIcon className="text-[1.5rem] text-slate-600" />
                  <p className="text-sm text-slate-500">No restaurants to rank yet.</p>
                </div>
              ) : topRestaurants.length === 1 ? (
                <div className="space-y-2">
                  <LeaderRow item={topRestaurants[0]} rank={1} />
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-4">
                    <p className="text-xs text-slate-500">Add more restaurants to see the full leaderboard.</p>
                  </div>
                </div>
              ) : topRestaurants.map((r, i) =>
                leaderView === 'list'
                  ? <LeaderRow key={r.id} item={r} rank={i + 1} />
                  : <LeaderGrid key={r.id} item={r} rank={i + 1} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`${CARD} p-5`}>
          <SectionHeader eyebrow="City performance" title="Revenue & readiness" />
          <div className="space-y-2">
            {(dashboard.cityPerformance ?? []).length === 0
              ? <p className="text-sm text-slate-500 py-4 text-center">No city data yet.</p>
              : (dashboard.cityPerformance ?? []).map((item) => <CityCard key={item.city} item={item} />)
            }
          </div>
        </div>
      </div>

      {/* Platform pulse */}
      <div className={`${CARD} p-5`}>
        <SectionHeader eyebrow="Platform pulse" title="Live readiness metrics" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {(dashboard.platformPulse ?? []).length === 0
            ? <div className="col-span-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-8"><p className="text-sm text-slate-500">No pulse data yet.</p></div>
            : (dashboard.platformPulse ?? []).map((item) => <PulseBar key={item.label} item={item} />)
          }
        </div>
      </div>

      {/* Activity + Support tabbed */}
      <div className={`${CARD} p-5`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
            {[
              { key: 'activity', label: 'Activity feed', count: activityFeed.length },
              { key: 'support',  label: 'Support queue', count: supportQueue.length },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${activeTab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                {label}
                <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold ${
                  activeTab === key ? 'bg-white/25 text-white'
                  : key === 'support' && count > 0 ? 'bg-rose-500/20 text-rose-300'
                  : count > 0 ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-white/[0.06] text-slate-500'
                }`}>{count}</span>
              </button>
            ))}
          </div>
          {resolvedIds.size > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-400">
              ✓ {resolvedIds.size} resolved
            </span>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            {activeTab === 'activity'
              ? activityFeed.length === 0
                ? <p className="text-sm text-slate-500 py-4 text-center">No recent activity.</p>
                : activityFeed.map((item) => <ActivityItem key={item.id} item={item} />)
              : supportQueue.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-8">
                    <span className="text-2xl">✅</span>
                    <p className="text-sm font-semibold text-slate-300">All clear!</p>
                    <p className="text-xs text-slate-500">No open support items.</p>
                  </div>
                )
                : supportQueue.map((item) => (
                  <SupportItem key={item.id} item={item} onResolve={(id) => setResolvedIds((prev) => new Set([...prev, id]))} />
                ))
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {(dashboard.recentCredentials ?? []).length > 0 && (
        <div className={`${CARD} p-5`}>
          <SectionHeader eyebrow="Credentials" title="Recently issued logins" />
          <div className="grid gap-2 sm:grid-cols-2">
            {dashboard.recentCredentials.map((item) => <CredChip key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {(dashboard.guidance ?? []).length > 0 && <GuidanceSection items={dashboard.guidance} />}

    </div>
  )
}
