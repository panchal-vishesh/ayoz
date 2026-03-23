import { motion } from 'framer-motion'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

export default function PlatformSection({ featureCards }) {
  return (
    <section id="platform" className={`${sectionShell} ${sectionGap}`}>
      <SectionIntro
        badge="Core platform"
        title="Built for restaurants that want speed, control, and better guest satisfaction."
        description="The platform helps teams reduce wait time while keeping revenue and kitchen timing under control."
      />

      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-2">
        {featureCards.map((feature, index) => (
          <motion.article
            key={feature.title}
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-7`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(138,164,255,0.07),transparent)]" />
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 font-display text-sm font-bold text-brand-soft ring-1 ring-brand/20 sm:h-11 sm:w-11 sm:text-base">
                0{index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-[-0.04em] text-slate-50 sm:mt-5 sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
                {feature.text}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
