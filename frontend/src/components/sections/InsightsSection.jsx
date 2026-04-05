import { motion } from 'framer-motion'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard, surfaceCard } from '../ui/styles'

const analyticsIcons = [StarRoundedIcon, TimerRoundedIcon, TrendingUpRoundedIcon]

export default function InsightsSection({ analytics }) {
  return (
    <section id="insights" className={`${sectionShell} ${sectionGap} border-t border-[#1F2A3D] grid gap-4 sm:gap-5 xl:grid-cols-[0.95fr_1.05fr]`}>
      <div className={`${surfaceCard} p-5 sm:p-7`}>
        <SectionIntro
          badge="Your numbers"
          badgeVariant="warm"
          title="Data that helps you earn more every day."
          description="Real-time insights on your best dishes, kitchen speed, and peak hours — so you always know what to improve."
        />
      </div>

      <div className="grid gap-3 sm:gap-4">
        {analytics.map(([title, text], index) => {
          const Icon = analyticsIcons[index % analyticsIcons.length]
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-6`}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
              <div className="flex items-start gap-4 pl-4 sm:pl-5">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1F2A3D] bg-[#111827] text-slate-400">
                  <Icon fontSize="inherit" className="text-[1.15rem]" />
                </span>
                <div>
                  <strong className="block font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">{title}</strong>
                  <p className="mt-1.5 text-sm leading-7 text-slate-400">{text}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
