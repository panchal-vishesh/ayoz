import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import { RevenueTrendChart } from '../shared/charts'
import {
  AnalyticsCityCard, AnalyticsHeader, AnalyticsPulseBar,
  CARD, EmptyState, FoodTechMetrics, MetricTile, StarPerformer,
} from './components/AnalyticsCards'

export default function AdminAnalytics({ dashboard, onSectionChange }) {
  const restaurants = dashboard.restaurants ?? []
  const cityPerformance = dashboard.cityPerformance ?? []
  const platformPulse = dashboard.platformPulse ?? []
  const overview = dashboard.overview ?? []

  return (
    <div className="space-y-5 sm:space-y-6">

      <AnalyticsHeader dashboard={dashboard} onSectionChange={onSectionChange} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {overview.length === 0
          ? <div className="col-span-4"><EmptyState icon={AutoGraphRoundedIcon} title="No KPI data yet" description="Add restaurants to see platform metrics" /></div>
          : overview.map((item, i) => <MetricTile key={item.label} item={item} index={i} />)
        }
      </div>

      <FoodTechMetrics restaurants={restaurants} />
      <StarPerformer restaurants={restaurants} />

      <div className={`${CARD} p-5`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Revenue trend</p>
            <h2 className="mt-1 text-base font-bold text-white">Restaurant revenue · today</h2>
          </div>
          {restaurants.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /><span className="text-[0.65rem] text-slate-500">Revenue</span></div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /><span className="text-[0.65rem] text-slate-500">Orders</span></div>
            </div>
          )}
        </div>
        {restaurants.length === 0
          ? <EmptyState icon={TrendingUpRoundedIcon} title="No revenue data yet" description="Add restaurants to track revenue trends" />
          : <RevenueTrendChart items={restaurants} />
        }
      </div>

      <div className={`${CARD} p-5`}>
        <div className="mb-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">Platform pulse</p>
          <h2 className="mt-1 text-base font-bold text-white">Live readiness metrics</h2>
        </div>
        {platformPulse.length === 0
          ? <EmptyState icon={BoltRoundedIcon} title="No pulse data yet" />
          : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{platformPulse.map((item) => <AnalyticsPulseBar key={item.label} item={item} />)}</div>
        }
      </div>

      <div className={`${CARD} p-5`}>
        <div className="mb-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-slate-500">City performance</p>
          <h2 className="mt-1 text-base font-bold text-white">Revenue & readiness by city</h2>
        </div>
        {cityPerformance.length === 0
          ? <EmptyState icon={LocationOnRoundedIcon} title="No city data yet" description="Cities appear once restaurants are added" />
          : <div className="space-y-2">{cityPerformance.map((item, i) => <AnalyticsCityCard key={item.city} item={item} rank={i + 1} />)}</div>
        }
      </div>

    </div>
  )
}
