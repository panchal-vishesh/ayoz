import { motion } from 'framer-motion'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard, surfaceCard } from '../ui/styles'

const analyticsIcons = [StarRoundedIcon, TimerRoundedIcon, TrendingUpRoundedIcon]

export default function InsightsSection({ analytics }) {
  return (
    <section id="insights" className={`${sectionShell} ${sectionGap} grid gap-4 sm:gap-5 xl:grid-cols-[0.95fr_1.05fr]`}>
      <div className={`${surfaceCard} p-5 sm:p-7`}>
        <SectionIntro
          badge="Your numbers"
          badgeVariant="warm"
          title="See what is selling and how your kitchen is doing."
          description="Simple numbers to help you run your restaurant better every day."
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
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-brand-soft ring-1 ring-brand/20">
                  <Icon fontSize="inherit" className="text-[1.15rem]" />
                </span>
                <div>
                  <strong className="block font-display text-lg tracking-[-0.03em] text-slate-50 sm:text-xl">
                    {title}
                  </strong>
                  <p className="mt-1.5 text-xs leading-6 text-slate-300/70 sm:text-sm sm:leading-7">
                    {text}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
