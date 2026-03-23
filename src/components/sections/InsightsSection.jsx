import { motion } from 'framer-motion'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard, surfaceCard } from '../ui/styles'

export default function InsightsSection({ analytics }) {
  return (
    <section id="insights" className={`${sectionShell} ${sectionGap} grid gap-4 sm:gap-5 xl:grid-cols-[0.95fr_1.05fr]`}>
      <div className={`${surfaceCard} p-5 sm:p-7`}>
        <SectionIntro
          badge="Analytics and insights"
          badgeVariant="warm"
          title="More detail for restaurant operators, finance teams, and managers."
          description="Cleaner visibility around timing, kitchen performance, and revenue — built for decision makers."
        />
      </div>

      <div className="grid gap-3 sm:gap-4">
        {analytics.map(([title, text], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-6`}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
            <div className="pl-4 sm:pl-5">
              <strong className="block font-display text-xl tracking-[-0.04em] text-slate-50 sm:text-2xl">
                {title}
              </strong>
              <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
                {text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
