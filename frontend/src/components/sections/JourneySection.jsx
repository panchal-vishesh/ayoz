import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import DiningRoundedIcon from '@mui/icons-material/DiningRounded'
import SectionIntro from '../ui/SectionIntro'
import { sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

const stepIcons = [
  ShoppingBagRoundedIcon,
  LocationOnRoundedIcon,
  NotificationsActiveRoundedIcon,
  DiningRoundedIcon,
]

const stepColors = [
  { icon: 'from-[#FF6B1A]/20 to-[#FF6B1A]/5 text-[#FFB347] ring-[#FF6B1A]/20', num: 'text-[#FF6B1A]/30', glow: 'via-[#FF6B1A]/20' },
  { icon: 'from-[#0F2A44]/60 to-[#0F2A44]/20 text-[#CBD5E1] ring-[#1F2A3D]', num: 'text-[#CBD5E1]/20', glow: 'via-[#CBD5E1]/10' },
  { icon: 'from-[#FF6B1A]/20 to-[#FF6B1A]/5 text-[#FFB347] ring-[#FF6B1A]/20', num: 'text-[#FF6B1A]/30', glow: 'via-[#FF6B1A]/20' },
  { icon: 'from-[#0F2A44]/60 to-[#0F2A44]/20 text-[#CBD5E1] ring-[#1F2A3D]', num: 'text-[#CBD5E1]/20', glow: 'via-[#CBD5E1]/10' },
]

function StepCard({ item, index, hoverable = false, animate = true }) {
  const Icon = stepIcons[index % stepIcons.length]
  const color = stepColors[index % stepColors.length]
  const Tag = animate ? motion.article : 'article'
  const motionProps = animate
    ? { variants: fadeUp, initial: 'initial', whileInView: 'whileInView', viewport: { once: true, amount: 0.2 }, transition: { duration: 0.4, delay: index * 0.1 }, whileHover: hoverable ? { y: -5 } : undefined }
    : {}
  return (
    <Tag
      {...motionProps}
      className={`${softCard} relative h-full overflow-hidden p-5 sm:p-6`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${color.glow} to-transparent`} />
      <span className={`pointer-events-none absolute right-4 top-3 font-display text-6xl font-bold tracking-[-0.06em] ${color.num} select-none`}>
        {item.step}
      </span>
      <div className="relative flex items-center gap-3">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br ring-1 ${color.icon}`}>
          <Icon fontSize="inherit" className="text-[1.2rem]" />
        </span>
      </div>
      <h3 className="relative mt-4 font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">{item.title}</h3>
      <p className="relative mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
    </Tag>
  )
}

function ScrollDots({ count, active }) {
  return (
    <div className="mt-4 flex justify-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active ? 'w-5 bg-brand' : 'w-1.5 bg-white/15'
          }`}
        />
      ))}
    </div>
  )
}

export default function JourneySection({ journeyRef, journey }) {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const scrollLeft = el.scrollLeft
      const cardWidth = el.firstElementChild?.offsetWidth || 1
      setActiveIndex(Math.round(scrollLeft / (cardWidth + 12)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="journey" ref={journeyRef} className={`${sectionShell} ${sectionGap} border-t border-[#1F2A3D]`}>
      <SectionIntro
        badge="How it works"
        title="From order to table in 4 steps."
        description="A seamless experience for guests and a smarter workflow for your kitchen — powered by real-time GPS."
      />

      {/* Mobile: horizontal scroll with peek */}
      <div className="mt-6 lg:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          role="region"
          aria-label="How it works steps"
        >
          {journey.map((item, index) => (
            <div key={item.step} className="w-[75vw] min-w-[75vw] shrink-0 snap-start last:mr-4">
              <StepCard item={item} index={index} animate={false} />
            </div>
          ))}
        </div>
        <ScrollDots count={journey.length} active={activeIndex} />
      </div>

      {/* Desktop: grid */}
      <div className="mt-7 hidden gap-4 sm:mt-8 lg:grid lg:grid-cols-2 2xl:grid-cols-4">
        {journey.map((item, index) => (
          <StepCard key={item.step} item={item} index={index} hoverable />
        ))}
      </div>
    </section>
  )
}
