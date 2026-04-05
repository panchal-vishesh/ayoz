import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import { motion } from 'framer-motion'
import {
  clampFill, DashboardPanel, EmptyState, getFirstName, MetricsGrid,
  MiniMetric, TonePill, WorkspaceHero,
} from '../shared'
import { RewardTierChart, SpendingChart } from '../shared/charts'

function DiningPlanCard({ plan, onClick }) {
  if (!plan) return <EmptyState title="No dining plan yet" description="Pick a restaurant to start planning your next visit." />
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-orange-400/25 hover:bg-white/[0.07] active:scale-[0.98]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-50">{plan.restaurantName}</p>
          <p className="mt-1 text-sm text-slate-400">{plan.time}</p>
        </div>
        <TonePill tone="brand">{plan.confidence}</TonePill>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniMetric label="ETA" value={plan.eta} />
        <MiniMetric label="Party size" value={`${plan.partySize} guests`} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300/75">{plan.tableNote}</p>
    </button>
  )
}

function RewardVaultList({ items = [], onSelect }) {
  if (!items.length) return <EmptyState title="No rewards available" description="Your next offers will appear here." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-orange-400/25 hover:bg-white/[0.07] active:scale-[0.98]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300/75">{item.detail}</p>
            </div>
            <TonePill tone={item.tone}>{item.value}</TonePill>
          </div>
        </button>
      ))}
    </div>
  )
}

function FeaturedRestaurants({ items = [], onSelect }) {
  if (!items.length) return <EmptyState title="No featured restaurants" description="New places will appear once they are added to AyoZ." />
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-orange-400/25 hover:bg-white/[0.07] active:scale-[0.98]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-slate-50">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.city} / {item.cuisine}</p>
            </div>
            <TonePill tone={item.tone}>{item.match}</TonePill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300/75">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <TonePill tone="blue">{item.averagePrep}</TonePill>
            <TonePill tone="emerald">{item.topDish}</TonePill>
            <TonePill tone="slate">{item.serviceModel}</TonePill>
          </div>
          <p className="mt-4 text-sm text-slate-300/75">Seating capacity: <span className="font-semibold text-slate-100">{item.seatingCapacity}</span></p>
        </button>
      ))}
    </div>
  )
}

function SavedRestaurantsList({ items = [], onSelect }) {
  if (!items.length) return <EmptyState title="No saved restaurants yet" description="Start exploring and save places you want to revisit." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-orange-400/25 hover:bg-white/[0.07] active:scale-[0.98]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.name}</p>
              <p className="mt-1 text-sm text-slate-400">{item.city} / {item.cuisine}</p>
            </div>
            <TonePill tone="blue">{item.averagePrep}</TonePill>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <TonePill tone="emerald">{item.topDish}</TonePill>
            <TonePill tone="slate">{item.serviceModel}</TonePill>
          </div>
        </button>
      ))}
    </div>
  )
}

function OrderHistoryList({ items = [], onSelect }) {
  if (!items.length) return <EmptyState title="No order history yet" description="Your recent activity will appear here once you place an order." />
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item)}
          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-orange-400/25 hover:bg-white/[0.07] active:scale-[0.98]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-50">{item.restaurantName}</p>
              <p className="mt-1 text-sm text-slate-400">{item.visitTime}</p>
            </div>
            <p className="text-base font-semibold text-slate-50">{item.amount}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <TonePill tone="emerald">{item.status}</TonePill>
          </div>
        </button>
      ))}
    </div>
  )
}

function RewardProgressCard({ profile }) {
  const progress = clampFill(profile?.rewardProgress?.percent)
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Rewards progress</p>
          <p className="mt-2 font-display text-3xl tracking-[-0.05em] text-slate-50">{profile?.rewardProgress?.current ?? 0}</p>
        </div>
        <TonePill tone="brand">{profile?.membershipTier ?? 'Starter'}</TonePill>
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MiniMetric label="Next tier at" value={String(profile?.rewardProgress?.nextTier ?? 0)} />
        <MiniMetric label="Wallet" value={profile?.walletBalance ?? 'INR 0'} />
      </div>
    </div>
  )
}

function ProfileHighlights({ profile }) {
  const cards = [
    { label: 'Preferred city', value: profile?.preferredCity ?? 'Not set' },
    { label: 'Favorite cuisine', value: profile?.favoriteCuisine ?? 'Not set' },
    { label: 'Preferred mood', value: profile?.preferredMood ?? 'Not set' },
    { label: 'Celebration date', value: profile?.celebrationDate ?? 'Not planned' },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => <MiniMetric key={card.label} label={card.label} value={card.value} />)}
    </div>
  )
}

export default function CustomerDashboard({ user, dashboard, activeSection, onSectionChange, theme }) {
  const firstName = getFirstName(user.name)
  const profile = dashboard.profile
  const metricSectionMap = { 'Loyalty points': 'rewards', 'Wallet balance': 'rewards', 'Saved restaurants': 'explore', 'Visits completed': 'orders' }

  if (activeSection === 'explore') {
    return (
      <div className="space-y-6">
        <WorkspaceHero
          theme={theme}
          icon={TravelExploreRoundedIcon}
          eyebrow="Customer workspace"
          title="Explore your next table"
          description="Find places that match your timing, your taste, and the kind of dining experience you want tonight."
          badges={[`${dashboard.featuredRestaurants?.length ?? 0} featured venues`, `${dashboard.savedRestaurants?.length ?? 0} saved restaurants`, profile?.preferredCity ?? 'Preferred city']}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'rewards', label: 'Rewards', onClick: () => onSectionChange('rewards'), variant: theme.ghost, icon: LocalOfferRoundedIcon },
          ]}
        />
        <DashboardPanel theme={theme} eyebrow="Featured" title="Featured restaurants">
          <FeaturedRestaurants items={dashboard.featuredRestaurants} onSelect={() => onSectionChange('orders')} />
        </DashboardPanel>
        <div className="grid gap-6 xl:grid-cols-[1.02fr_.98fr]">
          <DashboardPanel theme={theme} eyebrow="Saved" title="Saved restaurants">
            <SavedRestaurantsList items={dashboard.savedRestaurants} onSelect={() => onSectionChange('orders')} />
          </DashboardPanel>
          <DashboardPanel theme={theme} eyebrow="Profile" title="Taste profile">
            <ProfileHighlights profile={profile} />
          </DashboardPanel>
        </div>
      </div>
    )
  }

  if (activeSection === 'orders') {
    return (
      <div className="space-y-6">
        <WorkspaceHero
          theme={theme}
          icon={RestaurantMenuRoundedIcon}
          eyebrow="Customer workspace"
          title="Recent orders and visits"
          description="Keep track of what you ordered, when you visited, and how quickly each dining session landed."
          badges={[`${dashboard.recentOrders?.length ?? 0} recent visits`, profile?.membershipTier ?? 'Starter tier', profile?.upcomingVisit ?? 'No upcoming visit']}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'explore', label: 'Explore restaurants', onClick: () => onSectionChange('explore'), variant: theme.ghost, icon: TravelExploreRoundedIcon },
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <DashboardPanel theme={theme} eyebrow="History" title="Order history">
            <SpendingChart items={dashboard.recentOrders} />
            <div className="mt-4">
              <OrderHistoryList items={dashboard.recentOrders} onSelect={() => onSectionChange('explore')} />
            </div>
          </DashboardPanel>
          <DashboardPanel theme={theme} eyebrow="Next visit" title="Dining plan">
            <DiningPlanCard plan={dashboard.diningPlan} onClick={() => onSectionChange('explore')} />
          </DashboardPanel>
        </div>
      </div>
    )
  }

  if (activeSection === 'rewards') {
    return (
      <div className="space-y-6">
        <WorkspaceHero
          theme={theme}
          icon={LocalOfferRoundedIcon}
          eyebrow="Customer workspace"
          title="Rewards and perks"
          description="See how close you are to the next tier, what offers are ready now, and which benefits fit your next visit."
          badges={[`${profile?.rewardProgress?.current ?? 0} points`, profile?.membershipTier ?? 'Starter tier', `${dashboard.rewardVault?.length ?? 0} active perks`]}
          actions={[
            { key: 'overview', label: 'Overview', onClick: () => onSectionChange('overview'), variant: theme.button, icon: DashboardRoundedIcon },
            { key: 'explore', label: 'Find a place', onClick: () => onSectionChange('explore'), variant: theme.ghost, icon: TravelExploreRoundedIcon },
          ]}
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <DashboardPanel theme={theme} eyebrow="Perks" title="Reward vault">
            <RewardVaultList items={dashboard.rewardVault} onSelect={() => onSectionChange('explore')} />
          </DashboardPanel>
          <DashboardPanel theme={theme} eyebrow="Profile" title="Membership profile">
            <ProfileHighlights profile={profile} />
          </DashboardPanel>
        </div>
        <RewardProgressCard profile={profile} />
        <DashboardPanel theme={theme} eyebrow="Tier progress" title="Points vs tiers">
          <RewardTierChart profile={profile} />
        </DashboardPanel>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <WorkspaceHero
        theme={theme}
        icon={TravelExploreRoundedIcon}
        eyebrow="Customer workspace"
        title={dashboard.heading ?? `${firstName}, your next table is getting ready`}
        description={dashboard.subheading}
        badges={[profile?.preferredCity ?? 'Preferred city not set', profile?.membershipTier ?? 'Starter tier', user.loginId ?? '']}
        actions={[
          { key: 'explore', label: 'Explore restaurants', onClick: () => onSectionChange('explore'), variant: theme.button, icon: TravelExploreRoundedIcon },
          { key: 'rewards', label: 'Open rewards', onClick: () => onSectionChange('rewards'), variant: theme.ghost, icon: WorkspacePremiumRoundedIcon },
        ]}
      />
      <MetricsGrid items={dashboard.overview} theme={theme} onCardClick={(item) => { const s = metricSectionMap[item.label]; if (s) onSectionChange(s) }} />
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardPanel theme={theme} eyebrow="Plan" title="Dining plan">
          <DiningPlanCard plan={dashboard.diningPlan} onClick={() => onSectionChange('orders')} />
        </DashboardPanel>
        <DashboardPanel theme={theme} eyebrow="Saved" title="Saved restaurants">
          <SavedRestaurantsList items={dashboard.savedRestaurants?.slice(0, 3)} onSelect={() => onSectionChange('explore')} />
        </DashboardPanel>
      </div>
    </div>
  )
}
