import { motion } from 'framer-motion'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

export default function DeviceSection({ deviceCards }) {
  return (
    <section id="devices" className={`${sectionShell} ${sectionGap} pb-20 sm:pb-28`}>
      <SectionIntro
        badge="Device compatibility"
        title="Designed to feel premium on every device, not only on desktop."
        description="The layout is structured for phones, tablets, desktops, and kiosk-style restaurant displays so the experience stays polished across real-world use cases."
      />

      <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
        {deviceCards.map(([title, text], index) => (
          <motion.article
            key={title}
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-7`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(138,164,255,0.06),transparent)]" />
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 font-display text-sm font-bold text-brand-soft ring-1 ring-brand/20 sm:h-11 sm:w-11 sm:text-base">
                0{index + 1}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-[-0.04em] text-slate-50 sm:mt-5 sm:text-2xl">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
                {text}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
