import { motion } from 'framer-motion'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import SectionIntro from '../ui/SectionIntro'
import { sectionGap, sectionShell, softCard, surfaceCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

export default function PricingSection({ features, example, onSignup }) {
  return (
    <section id="pricing" className={`${sectionShell} ${sectionGap} border-t border-[#1F2A3D]`}>
      <SectionIntro
        badge="Pricing"
        badgeVariant="warm"
        title="No monthly fees. Ever."
        description="AyoZ takes a simple 10% on each order. You only pay when you earn. No subscriptions, no hidden charges, no surprises."
      />

      <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_0.9fr]">

        {/* Left — commission card — FOCUS POINT */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className={`${surfaceCard} relative overflow-hidden p-7 sm:p-9 border-[#FF6B1A]/30 shadow-[0_0_40px_rgba(255,107,26,0.12)] scale-[1.01]`}
        >
          {/* Focus label */}
          <div className="absolute -top-px left-6 rounded-b-xl bg-[#FF6B1A] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white">
            Most popular
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand/10 blur-[80px]" />

          {/* Big % display */}
          <div className="relative flex items-end gap-3">
            <span className="font-display text-[5rem] leading-none tracking-[-0.06em] text-slate-50 sm:text-[6.5rem]">
              10
            </span>
            <div className="mb-3 flex flex-col gap-1">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand/15 text-brand-soft ring-1 ring-brand/25">
                <PercentRoundedIcon fontSize="inherit" className="text-[1.1rem]" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                per order
              </span>
            </div>
          </div>

          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-300/70">
            That's all we charge. No setup fee, no monthly subscription, no lock-in.
            Join free, go live in 24 hours, and only pay when guests order.
          </p>

          {/* Live example breakdown */}
          <div className="mt-6 rounded-2xl border border-[#1F2A3D] bg-[#101726] p-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Example order breakdown
            </p>
            <div className="mt-4 space-y-3">
              {example.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between text-sm ${row.highlight ? 'rounded-xl border border-[#FF6B1A]/20 bg-[#FF6B1A]/[0.08] px-4 py-3' : 'px-1'}`}
                >
                  <span className={row.highlight ? 'font-semibold text-[#FFB347]' : 'text-[#64748B]'}>
                    {row.label}
                  </span>
                  <span className={`font-display text-lg tracking-[-0.04em] ${row.highlight ? 'text-[#FFB347]' : 'text-[#CBD5E1]'}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand/[0.06] px-4 py-2.5">
              <PaymentsRoundedIcon fontSize="inherit" className="text-brand-soft text-[1rem] shrink-0" />
              <p className="text-xs text-brand-soft/80">
                Payout settled directly to your account the next day.
              </p>
            </div>
          </div>

          <button
            onClick={onSignup}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6B1A] hover:bg-[#E55A12] py-3.5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(255,107,26,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,107,26,0.45)]"
          >
            Join free — no credit card needed
            <NorthEastRoundedIcon fontSize="inherit" className="text-[0.85rem]" />
          </button>
        </motion.div>

        {/* Right — what's included */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className={`${softCard} p-6 sm:p-7`}
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Everything included
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">Full platform.<br />Zero extra cost.</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Every restaurant gets access to the complete AyoZ platform from day one.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1F2A3D] bg-[#111827] text-[#FF6B1A]">
                  <CheckRoundedIcon className="text-[0.72rem]" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-2xl border border-[#1F2A3D] bg-[#101726] p-4">
            <p className="text-xs font-semibold text-slate-300">
              Why commission-only?
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-400/80">
              We grow when you grow. A fixed monthly fee hurts small restaurants — especially when they're just starting out. With AyoZ, your success is our success.
            </p>
          </div>
        </motion.div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Free to join · Go live in 24 hours · Cancel anytime
      </p>
    </section>
  )
}
