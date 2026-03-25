import { motion } from 'framer-motion'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import DiningRoundedIcon from '@mui/icons-material/DiningRounded'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

const stepIcons = [
  ShoppingBagRoundedIcon,
  LocationOnRoundedIcon,
  NotificationsActiveRoundedIcon,
  DiningRoundedIcon,
]

export default function JourneySection({ journeyRef, journey }) {
  return (
    <section id="journey" ref={journeyRef} className={`${sectionShell} ${sectionGap}`}>
      <SectionIntro
        badge="How it works"
        title="4 simple steps from order to table."
        description="Order on your phone. We track you. Kitchen cooks. Food is hot when you sit."
      />

      <div className="mt-7 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {journey.map((item, index) => {
          const Icon = stepIcons[index % stepIcons.length]
          return (
            <motion.article
              key={item.step}
              variants={fadeUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ y: -5 }}
              className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-6`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-brand/5 text-brand-soft ring-1 ring-brand/20 sm:h-11 sm:w-11">
                  <Icon fontSize="inherit" className="text-[1.15rem]" />
                </span>
                <span className="font-display text-xs font-bold tracking-[0.18em] text-brand-soft/60 uppercase">
                  Step {item.step}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg tracking-[-0.03em] text-slate-50 sm:mt-4 sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:text-sm sm:leading-7">
                {item.text}
              </p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
