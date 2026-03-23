import { motion } from 'framer-motion'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

export default function JourneySection({ journeyRef, journey }) {
  return (
    <section id="journey" ref={journeyRef} className={`${sectionShell} ${sectionGap}`}>
      <SectionIntro
        badge="Service journey"
        title="A clearer end-to-end product story for your website visitors."
        description="This section explains the full booking-to-service journey so the product reads like a real operating system for premium dining."
      />

      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {journey.map((item, index) => (
          <motion.article
            key={item.step}
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-7`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-brand/5 font-display text-sm font-bold text-brand-soft ring-1 ring-brand/20 sm:h-11 sm:w-11">
              {item.step}
            </span>
            <h3 className="mt-4 font-display text-xl tracking-[-0.04em] text-slate-50 sm:mt-5 sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
              {item.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
