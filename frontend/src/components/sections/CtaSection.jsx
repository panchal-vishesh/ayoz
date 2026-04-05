import { motion } from 'framer-motion'
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { sectionShell } from '../ui/styles'

const perks = [
  'Free to join — no credit card needed',
  'Go live in under 24 hours',
  'Full dashboard & analytics included',
  'Only 10% per order — no monthly fees',
]

export default function CtaSection({ onSignup, liveStats }) {
  const badges = [
    { value: liveStats?.restaurants != null ? `${liveStats.restaurants}` : '—', label: 'Restaurants live' },
    { value: liveStats?.totalOrders != null ? `${liveStats.totalOrders}` : '—', label: 'Orders today' },
    { value: liveStats?.avgReadyRate != null ? `${liveStats.avgReadyRate}%` : '—', label: 'Hot-serve rate' },
    { value: liveStats?.cities != null ? `${liveStats.cities}` : '—', label: 'Cities covered' },
  ]

  return (
    <section className={`${sectionShell} py-16 sm:py-20 lg:py-24`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-[#1F2A3D] bg-[#151D2E] p-8 shadow-[0_32px_96px_rgba(11,15,26,0.7)] sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#0F2A44]/30 blur-[80px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            {/* Live stats badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {badges.map((b) => (
                <div key={b.label} className="rounded-full border border-[#1F2A3D] bg-[#101726] px-3 py-1.5 text-xs text-[#CBD5E1]">
                  <span className="font-bold text-white">{b.value}</span>
                  <span className="ml-1.5 text-slate-400">{b.label}</span>
                </div>
              ))}
            </div>

            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Ready to serve food
              <span className="block text-[#FF6B1A]">the right way?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Join restaurants already using AyoZ to eliminate cold food, reduce wait times,
              and delight every single guest. Setup takes less than a day.
            </p>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-slate-400">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1F2A3D] bg-[#111827] text-[#FF6B1A]">
                    <CheckRoundedIcon className="text-[0.75rem]" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[220px]">
            <motion.button
              onClick={onSignup}
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF6B1A] hover:bg-[#E55A12] px-8 py-4 text-base font-semibold text-white shadow-[0_8px_32px_rgba(255,107,26,0.3)]"
            >
              <PersonAddRoundedIcon className="text-[1.1rem]" />
              Get started free
              <NorthEastRoundedIcon className="text-[0.9rem]" />
            </motion.button>
            <p className="text-center text-xs text-slate-500">
              Free plan available · No credit card to start · Go live in 24 hours
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
