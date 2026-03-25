import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import TabletMacRoundedIcon from '@mui/icons-material/TabletMacRounded'
import { motion } from 'framer-motion'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

const deviceIcons = [
  PhoneIphoneRoundedIcon,
  TabletMacRoundedIcon,
  DesktopWindowsRoundedIcon,
]

const deviceTones = [
  'from-brand/18 to-orange-700/6',
  'from-brand/16 to-white/5',
  'from-emerald-300/12 to-brand/6',
]

export default function DeviceSection({ deviceCards }) {
  return (
    <section id="devices" className={`${sectionShell} ${sectionGap} pb-20 sm:pb-28`}>
      <SectionIntro
        badge="Works on all devices"
        title="Works on phone, tablet, and big screen."
        description="Guests order on their phone. Staff use a tablet. Chefs see alerts on a big screen. Simple."
      />

      <div className="mt-7 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
        {deviceCards.map(([title, text], index) => {
          const Icon = deviceIcons[index % deviceIcons.length]
          const tone = deviceTones[index % deviceTones.length]

          return (
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
              <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,107,26,0.06),transparent)]`} />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${tone} text-brand-soft ring-1 ring-white/8`}>
                    <Icon fontSize="inherit" className="text-[1.25rem]" />
                  </span>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-slate-300">
                    Optimized
                  </div>
                </div>

                <h3 className="mt-5 font-display text-xl tracking-[-0.04em] text-slate-50 sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-3 text-xs leading-6 text-slate-300/70 sm:text-sm sm:leading-7">
                  {text}
                </p>

                <div className="mt-5 overflow-hidden rounded-[20px] border border-white/8 bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3">
                  <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.24em] text-slate-400">
                    <span>Viewport state</span>
                    <span>Stable</span>
                  </div>
                  <div className="mt-3 h-24 rounded-[16px] border border-white/8 bg-[linear-gradient(145deg,rgba(8,13,26,0.95),rgba(12,18,34,0.8))] p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <span className="h-9 rounded-xl bg-white/[0.05]" />
                      <span className="h-9 rounded-xl bg-white/[0.05]" />
                      <span className="h-9 rounded-xl bg-white/[0.05]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
