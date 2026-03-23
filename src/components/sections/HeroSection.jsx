import { motion } from 'framer-motion'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { cardHover, compactCard, sectionShell, softCard } from '../ui/styles'

export default function HeroSection({ menuRef, journeyRef, premiumSignals, statCards }) {
  return (
    <section
      id="hero"
      className={`${sectionShell} relative pt-28 pb-12 sm:pt-36 sm:pb-14 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:items-center lg:gap-10 lg:pt-28`}
    >
      {/* Left column */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <Badge variant="warm">Restaurant tech for premium dining</Badge>

        <h1 className="mt-4 max-w-[14ch] font-display text-[2.6rem] leading-[0.93] tracking-[-0.055em] text-slate-50 sm:text-5xl sm:max-w-[11ch] lg:text-7xl">
          AyoZ helps hotels serve guests
          <span className="block text-brand-soft">before they even sit down.</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300/75 sm:text-base">
          A modern zero-wait dining platform for hotels, cafes, and fine-dining brands.
          Guests reserve, pre-order, and prepay. The kitchen starts at the perfect time
          using live arrival signals.
        </p>

        <div className="mt-6 flex flex-col gap-3 xs:flex-row sm:flex-wrap">
          <Button
            className="w-full xs:w-auto"
            onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore live demo
          </Button>
          <Button
            variant="secondary"
            className="w-full xs:w-auto"
            onClick={() => journeyRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            View business flow
          </Button>
        </div>

        {/* Scrolling ticker */}
        <div className="relative mt-7 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl">
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
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 sm:px-4 sm:py-2 sm:text-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Stat cards — 1 col on xs, 3 col on sm+ */}
        <div className="mt-6 grid grid-cols-1 gap-3 xs:grid-cols-3 sm:gap-4">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 + index * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${softCard} ${cardHover} relative overflow-hidden p-4 sm:p-5`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
              {/* Mobile: horizontal layout */}
              <div className="flex items-center gap-3 xs:block">
                <strong className="font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                  {card.value}
                </strong>
                <div className="xs:mt-2">
                  <span className="block text-xs font-semibold text-slate-100 sm:text-sm">
                    {card.label}
                  </span>
                  <p className="mt-1 text-xs leading-5 text-slate-300/65 sm:text-sm sm:leading-6">
                    {card.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right column — operations board */}
      <motion.div
        className="relative z-10 mt-10 lg:mt-0"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.15 }}
      >
        <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-5">
          <div className="mb-4 flex items-center gap-2.5 text-sm text-slate-200/80">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
            <span>Operations board</span>
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
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-brand-soft/80 sm:text-[0.68rem] sm:tracking-[0.28em]">
                Why hotels choose AyoZ
              </p>
              <ul className="mt-3 space-y-2.5 text-xs leading-5 text-slate-300/75 sm:mt-4 sm:space-y-3 sm:text-sm sm:leading-6">
                {[
                  'Premium guest experience with less queue time',
                  'More predictable kitchen throughput during rush hours',
                  'Revenue visibility with clear settlement breakdowns',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft" />
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
