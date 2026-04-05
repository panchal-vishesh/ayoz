import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { cardHover, compactCard, sectionShell, softCard } from '../ui/styles'

const statIcons = [SpeedRoundedIcon, RestaurantRoundedIcon, ScheduleRoundedIcon]

const listItems = [
  { icon: ShoppingBagRoundedIcon, text: 'Guest orders & pays before leaving home' },
  { icon: LocationOnRoundedIcon, text: 'GPS triggers kitchen at the perfect moment' },
  { icon: CheckCircleOutlineRoundedIcon, text: 'Hot food lands on the table as they sit' },
]

export default function HeroSection({ menuRef, journeyRef, premiumSignals, statCards, trustBadges, onSignup, liveStats }) {
  const restaurantsLive = liveStats?.restaurants ?? null
  const ordersToday = liveStats?.totalOrders ?? null
  const avgReadyRate = liveStats?.avgReadyRate ?? null
  const cities = liveStats?.cities ?? null

  return (
    <section
      id="hero"
      className={`${sectionShell} relative pt-[6rem] pb-10 sm:pt-[7.5rem] sm:pb-12 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-center lg:gap-12 lg:pt-[8rem]`}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#FF6B1A]/[0.06] blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#0F2A44]/[0.4] blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="warm">
            <RestaurantRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
            India's smartest dining platform
          </Badge>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2A3D] bg-[#101726] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-[#FFB347]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-soft shadow-[0_0_10px_rgba(255,179,71,0.8)]" />
            {restaurantsLive !== null ? `${restaurantsLive} restaurants live` : 'Restaurants live'}
          </div>
        </div>

        {/* Headline */}
        <h1 className="mt-4 max-w-[14ch] font-display text-[2.2rem] font-semibold leading-[1.0] tracking-[-0.04em] text-white xs:text-[2.8rem] sm:text-5xl sm:max-w-[12ch] lg:text-[5rem]">
          Order Before You Arrive.
          <span className="block text-[#FF6B1A]">Skip the Waiting.</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          AyoZ lets guests order and pay before they leave home. We track their GPS and alert
          the kitchen at the perfect moment — so food is always hot, fresh, and waiting.
          <span className="ml-1 font-semibold text-slate-300">No queues. No cold plates. Ever.</span>
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 xs:flex-row sm:mt-8">
          <motion.button
            onClick={onSignup}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(255,107,26,0.35)' }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: ['0 0 0px rgba(255,107,26,0)', '0 0 18px rgba(255,107,26,0.18)', '0 0 0px rgba(255,107,26,0)'] }}
            transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B1A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,26,0.3)] transition-all duration-250 w-full xs:w-auto"
          >
            <PersonAddRoundedIcon fontSize="inherit" className="text-[1rem]" />
            Get started free
            <NorthEastRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
          </motion.button>
          <Button
            variant="secondary"
            className="w-full xs:w-auto"
            onClick={() => journeyRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            See how it works
          </Button>
        </div>

        {/* Arriving badge — brand personality */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#FF6B1A]/25 bg-[#FF6B1A]/[0.07] px-4 py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-[#FF6B1A]"
            style={{ boxShadow: '0 0 8px rgba(255,107,26,0.8)' }}
          />
          <span className="text-[0.7rem] font-medium text-[#FFB347]">📍 Arriving in ~12 mins — kitchen alert sent</span>
        </motion.div>

        {/* Scrolling ticker */}
        <div className="relative mt-6 overflow-hidden rounded-full border border-[#1F2A3D] bg-[#111827]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0B0F1A] to-transparent sm:w-14" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0B0F1A] to-transparent sm:w-14" />
          <motion.div
            className="flex w-max gap-2 px-3 py-2 sm:gap-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          >
            {[...premiumSignals, ...premiumSignals].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-[#1F2A3D] bg-[#151D2E] px-3 py-1.5 text-[0.7rem] font-medium text-slate-400 sm:px-4 sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Trust badges */}
        {trustBadges?.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="inline-flex items-center gap-1.5 rounded-full border border-[#1F2A3D] bg-[#111827] px-3 py-1.5 text-xs">
                <span className="font-semibold text-white">{badge.value}</span>
                <span className="text-slate-500">{badge.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-3 gap-2 xs:gap-3">
          {statCards.map((card, index) => {
            const Icon = statIcons[index % statIcons.length]
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                whileHover={{ y: -3 }}
                className={`${softCard} ${cardHover} relative overflow-hidden p-4`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
                <div className="flex flex-col">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#1F2A3D] bg-[#111827] text-slate-400 xs:h-10 xs:w-10">
                    <Icon fontSize="inherit" className="text-[0.95rem] xs:text-[1.1rem]" />
                  </span>
                  <div className="mt-2 xs:mt-3">
                    <strong className="font-display text-xl font-semibold tracking-[-0.04em] text-white xs:text-2xl sm:text-3xl">
                      {card.value}
                    </strong>
                    <span className="mt-0.5 block text-[0.6rem] font-medium uppercase tracking-[0.12em] text-slate-400 xs:text-xs">{card.label}</span>
                    <p className="mt-1 hidden text-xs leading-5 text-slate-500 xs:block">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        className="relative z-10 mt-8 lg:mt-0"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#1F2A3D] bg-[#151D2E] p-4 shadow-[0_24px_72px_rgba(11,15,26,0.6)] sm:p-5">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] h-40 w-40 rounded-full bg-brand/10 blur-[80px]" />

          <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[#CBD5E1]/80">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FFB347] shadow-[0_0_12px_rgba(255,179,71,0.8)]" />
              <span className="text-xs font-medium text-slate-300">Live platform stats</span>
            </div>
            <div className="rounded-full border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.07] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-[#FFB347]">
              Real data
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Orders today */}
            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-400">Orders today</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">{ordersToday !== null ? ordersToday : '—'}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">Across all restaurants</p>
            </div>

            {/* Hot-serve rate */}
            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-400">Hot-serve rate</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">{avgReadyRate !== null ? `${avgReadyRate}%` : '—'}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">Meals ready on arrival</p>
            </div>

            {/* Restaurants live */}
            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-400">Restaurants live</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">{restaurantsLive !== null ? restaurantsLive : '—'}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">Active on the platform</p>
            </div>

            {/* Cities */}
            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-400">Cities covered</p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">{cities !== null ? cities : '—'}</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">Across India</p>
            </div>

            {/* Why guests love */}
            <div className={`${compactCard} col-span-2 p-4`}>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-400">Why guests love AyoZ</p>
              <ul className="mt-3 space-y-2.5">
                {listItems.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-xs text-slate-400 sm:text-sm">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-[#1F2A3D] bg-[#1A2438] text-slate-400">
                      <Icon fontSize="inherit" className="text-[0.9rem]" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA inside panel */}
            <div className="col-span-2">
              <button
                onClick={onSignup}
                className="w-full rounded-2xl bg-[#FF6B1A] hover:bg-[#E55A12] py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,107,26,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,107,26,0.45)]"
              >
                {restaurantsLive !== null
                  ? `Join ${restaurantsLive} restaurants — it's free →`
                  : "Get started free →"}
              </button>
            </div>
          </div>
        </div>

        {/* Floating social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-3 flex items-center justify-center gap-3 rounded-2xl border border-[#1F2A3D] bg-[#101726] px-4 py-3"
        >
          <div className="flex -space-x-2">
            {['RS', 'PN', 'AM', 'SK'].map((init, i) => (
              <div key={i} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#151D2E] bg-[#FF6B1A]/20 text-[0.55rem] font-bold text-white">
                {init}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200">
              {restaurantsLive !== null ? `${restaurantsLive} restaurants` : 'Restaurants'}
            </span> already serving hot food
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
