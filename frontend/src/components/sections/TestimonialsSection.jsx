import { motion } from 'framer-motion'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { sectionGap, sectionShell, softCard } from '../ui/styles'
import SectionIntro from '../ui/SectionIntro'
import { fadeUp } from '../../utils/motion'

const toneMap = {
  emerald: {
    avatar: 'from-[#FF6B1A]/20 to-[#FF6B1A]/5 border-[#FF6B1A]/20 text-[#FFB347]',
    quote: 'text-[#FF6B1A]/40',
    glow: 'via-[#FF6B1A]/20',
  },
  blue: {
    avatar: 'from-[#0F2A44]/60 to-[#0F2A44]/20 border-[#1F2A3D] text-[#CBD5E1]',
    quote: 'text-[#CBD5E1]/30',
    glow: 'via-[#CBD5E1]/10',
  },
  orange: {
    avatar: 'from-[#FF6B1A]/20 to-[#FF6B1A]/5 border-[#FF6B1A]/20 text-[#FFB347]',
    quote: 'text-[#FF6B1A]/40',
    glow: 'via-[#FF6B1A]/20',
  },
}

export default function TestimonialsSection({ testimonials }) {
  return (
    <section id="testimonials" className={`${sectionShell} ${sectionGap} border-t border-[#1F2A3D]`}>
      <SectionIntro
        badge="Real restaurants. Real results."
        badgeVariant="warm"
        title="Restaurants love what AyoZ does for them."
        description="Hear from the chefs, managers, and owners who've transformed their dining experience."
      />

      <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-3">
        {testimonials.map((t, index) => {
          const tone = toneMap[t.tone] ?? toneMap.blue
          const isFeatured = index === 1
          return (
            <motion.div
              key={t.name}
              variants={fadeUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className={`relative overflow-hidden p-5 sm:p-6 rounded-2xl border transition-all duration-250 ${
                isFeatured
                  ? 'border-[#FF6B1A]/40 bg-[#151D2E] shadow-[0_0_40px_rgba(255,107,26,0.12)] scale-[1.02]'
                  : 'border-[#1F2A3D] bg-[#151D2E] hover:border-[#FF6B1A]/20 hover:shadow-[0_0_30px_rgba(255,107,26,0.08)]'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-px left-6 rounded-b-xl bg-[#FF6B1A] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white">
                  Featured
                </div>
              )}
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${tone.glow} to-transparent`} />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarRoundedIcon key={i} className="text-amber-400 text-[0.9rem]" />
                ))}
              </div>
              <FormatQuoteRoundedIcon className={`mt-3 text-[2rem] ${tone.quote}`} />
              <p className="mt-1 text-sm leading-7 text-slate-400">{t.text}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-[#1F2A3D] pt-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br text-xs font-bold ${tone.avatar}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-[0.65rem] text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
