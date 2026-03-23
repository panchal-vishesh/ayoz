import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import RadarRoundedIcon from '@mui/icons-material/RadarRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { cardHover, compactCard, sectionShell, softCard } from '../ui/styles'

const statIcons = [TrackChangesRoundedIcon, RestaurantRoundedIcon, ScheduleRoundedIcon]

export default function HeroSection({ menuRef, journeyRef, premiumSignals, statCards }) {
  return (
    <section
      id="hero"
      className={`${sectionShell} relative pt-28 pb-12 sm:pt-36 sm:pb-14 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:items-center lg:gap-10 lg:pt-28`}
    >
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="warm">
            <RadarRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
            Restaurant tech for premium dining
          </Badge>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
            Future-ready operations
          </div>
        </div>

        <h1 className="mt-5 max-w-[13ch] font-display text-[2.8rem] leading-[0.9] tracking-[-0.06em] text-slate-50 sm:text-5xl sm:max-w-[11ch] lg:text-[5.25rem]">
          A cleaner way to launch
          <span className="block bg-[linear-gradient(90deg,#e8eeff_0%,#b8c8ff_40%,#8eb0ff_100%)] bg-clip-text text-transparent">
            zero-wait dining.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300/78 sm:text-base">
          AyoZ gives hotels and dining brands a more elegant service layer: bookings,
          pre-orders, prepayment, and kitchen timing aligned into one fast premium flow.
        </p>

        <div className="mt-7 flex flex-col gap-3 xs:flex-row sm:flex-wrap">
          <Button
            className="w-full xs:w-auto"
            onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore live demo
            <NorthEastRoundedIcon fontSize="inherit" className="text-[1rem]" />
          </Button>
          <Button
            variant="secondary"
            className="w-full xs:w-auto"
            onClick={() => journeyRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            View business flow
          </Button>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-midnight to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-midnight to-transparent sm:w-16" />
          <motion.div
            className="flex w-max gap-2.5 px-3 py-2.5 sm:gap-3 sm:py-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
          >
            {[...premiumSignals, ...premiumSignals].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex whitespace-nowrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 sm:px-4 sm:py-2 sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-soft" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 xs:grid-cols-3 sm:gap-4">
          {statCards.map((card, index) => {
            const Icon = statIcons[index % statIcons.length]

            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18 + index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`${softCard} ${cardHover} relative overflow-hidden p-4 sm:p-5`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
                <div className="flex items-center gap-3 xs:block">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-brand-soft">
                    <Icon fontSize="inherit" className="text-[1.2rem]" />
                  </span>
                  <div className="xs:mt-4">
                    <strong className="font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                      {card.value}
                    </strong>
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-200/85 sm:text-[0.72rem]">
                      {card.label}
                    </span>
                    <p className="mt-1.5 text-xs leading-5 text-slate-300/65 sm:text-sm sm:leading-6">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mt-10 lg:mt-0"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.15 }}
      >
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(11,17,33,0.96),rgba(8,12,24,0.9))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-5">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="pointer-events-none absolute right-[-4rem] top-[-3rem] h-44 w-44 rounded-full bg-brand/10 blur-[90px]" />
          <div className="pointer-events-none absolute left-[-3rem] bottom-[-4rem] h-40 w-40 rounded-full bg-sky-400/8 blur-[90px]" />

          <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-200/80">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
              <span>Operations board</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-slate-300">
              Predictive mode
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className={`${compactCard} relative overflow-hidden p-4 sm:p-5`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-brand-soft/80 sm:text-[0.68rem] sm:tracking-[0.28em]">
                Tonight&apos;s service
              </p>
              <h3 className="mt-3 font-display text-xl leading-tight tracking-[-0.04em] text-slate-50 sm:mt-4 sm:text-3xl">
                48 pre-booked covers
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-300/60 sm:text-sm sm:leading-6">
                18 guests selected dishes before arrival.
              </p>
            </div>

            <div className={`${compactCard} relative overflow-hidden p-4 sm:p-5`}>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-emerald-300/80 sm:text-[0.68rem] sm:tracking-[0.28em]">
                Kitchen readiness
              </p>
              <h3 className="mt-3 font-display text-xl leading-tight tracking-[-0.04em] text-slate-50 sm:mt-4 sm:text-3xl">
                7 alerts scheduled
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-300/60 sm:text-sm sm:leading-6">
                Wait time cut from 19 min to 6 min.
              </p>
            </div>

            <div className={`${compactCard} col-span-2 p-4 sm:p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-brand-soft/80 sm:text-[0.68rem] sm:tracking-[0.28em]">
                  Why hotels choose AyoZ
                </p>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-slate-300">
                  Minimal dashboard
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-slate-300/75 sm:text-sm sm:leading-6">
                {[
                  'Premium guest experience with less queue time',
                  'More predictable kitchen throughput during rush hours',
                  'Revenue visibility with clear settlement breakdowns',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-brand-soft">
                      <NorthEastRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
                    </span>
                    {point}
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
