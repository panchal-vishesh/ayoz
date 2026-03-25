import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { cardHover, compactCard, sectionShell, softCard } from '../ui/styles'

const statIcons = [SpeedRoundedIcon, RestaurantRoundedIcon, ScheduleRoundedIcon]

const listItems = [
  { icon: ShoppingBagRoundedIcon, text: 'Guest orders food before leaving home' },
  { icon: LocationOnRoundedIcon, text: 'Kitchen starts when guest is nearby' },
  { icon: CheckCircleOutlineRoundedIcon, text: 'Food is ready when they sit down' },
]

export default function HeroSection({ menuRef, journeyRef, premiumSignals, statCards }) {
  return (
    <section
      id="hero"
      className={`${sectionShell} relative pt-[7rem] pb-10 sm:pt-[7.5rem] sm:pb-12 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-center lg:gap-12 lg:pt-[8rem]`}
    >
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="warm">
            <RestaurantRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
            Order food · We track you · Food ready when you arrive
          </Badge>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
            Live now
          </div>
        </div>

        <h1 className="mt-4 max-w-[13ch] font-display text-[2.6rem] leading-[0.92] tracking-[-0.06em] text-slate-50 sm:text-5xl sm:max-w-[11ch] lg:text-[4.8rem]">
          Your food hot
          <span className="block bg-[linear-gradient(90deg,#fff5ee_0%,#ffb347_40%,#ff6b1a_100%)] bg-clip-text text-transparent">
            when you sit down.
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300/75 sm:text-base">
          With AyoZ, guests order food and pay before they leave home. We track when they are
          close and tell the kitchen to start cooking. Food is ready the moment they sit down.
        </p>

        <div className="mt-6 flex flex-col gap-3 xs:flex-row">
          <Button
            className="w-full xs:w-auto"
            onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <RestaurantRoundedIcon fontSize="inherit" className="text-[1rem]" />
            See the menu
            <NorthEastRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
          </Button>
          <Button
            variant="secondary"
            className="w-full xs:w-auto"
            onClick={() => journeyRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it works
          </Button>
        </div>

        {/* Scrolling ticker */}
        <div className="relative mt-6 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-charcoal to-transparent sm:w-14" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-charcoal to-transparent sm:w-14" />
          <motion.div
            className="flex w-max gap-2 px-3 py-2 sm:gap-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
          >
            {[...premiumSignals, ...premiumSignals].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 sm:px-4 sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Stat cards */}
        <div className="mt-5 grid grid-cols-1 gap-3 xs:grid-cols-3">
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
                <div className="flex items-center gap-3 xs:block">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-soft">
                    <Icon fontSize="inherit" className="text-[1.1rem]" />
                  </span>
                  <div className="xs:mt-3">
                    <strong className="font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                      {card.value}
                    </strong>
                    <span className="mt-0.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-200/80">
                      {card.label}
                    </span>
                    <p className="mt-1 text-xs leading-5 text-slate-300/60">
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
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,30,0.96),rgba(20,20,22,0.9))] p-4 shadow-[0_24px_72px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] h-40 w-40 rounded-full bg-brand/10 blur-[80px]" />

          <div className="mb-3 flex items-center justify-between gap-3 text-sm text-slate-200/80">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              <span className="text-xs font-medium">Live kitchen board</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-slate-300">
              Active
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand-soft/80">
                Tonight's orders
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight tracking-[-0.04em] text-slate-50 sm:text-3xl">
                —
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-300/40">
                Live data shows here once connected.
              </p>
            </div>

            <div className={`${compactCard} relative overflow-hidden p-4`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
                Kitchen status
              </p>
              <h3 className="mt-2 font-display text-2xl leading-tight tracking-[-0.04em] text-slate-50 sm:text-3xl">
                —
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-300/40">
                Active orders appear when live.
              </p>
            </div>

            <div className={`${compactCard} col-span-2 p-4`}>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-brand-soft/80">
                Why guests love AyoZ
              </p>
              <ul className="mt-3 space-y-2.5">
                {listItems.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-xs text-slate-300/80 sm:text-sm">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-brand-soft">
                      <Icon fontSize="inherit" className="text-[0.9rem]" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
