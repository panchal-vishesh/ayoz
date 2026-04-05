import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import SectionIntro from '../ui/SectionIntro'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'

const featureIcons = [
  RestaurantMenuRoundedIcon,
  NotificationsActiveRoundedIcon,
  AccountBalanceWalletRoundedIcon,
  InsightsRoundedIcon,
]

function FeatureCard({ feature, index, hoverable = false, animate = true }) {
  const Icon = featureIcons[index % featureIcons.length]
  const Tag = animate ? motion.article : 'article'
  const motionProps = animate
    ? { variants: fadeUp, initial: 'initial', whileInView: 'whileInView', viewport: { once: true, amount: 0.25 }, transition: { duration: 0.4, delay: index * 0.07 }, whileHover: hoverable ? { y: -5, scale: 1.01 } : undefined }
    : {}
  return (
    <Tag
      {...motionProps}
      className={`${softCard} ${hoverable ? cardHover : ''} relative h-full overflow-hidden p-5 sm:p-6`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,107,26,0.07),transparent)]" />
      <div className="relative">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1F2A3D] bg-[#111827] text-slate-400 sm:h-11 sm:w-11">
          <Icon fontSize="inherit" className="text-[1.2rem]" />
        </span>
        <h3 className="mt-3 font-display text-lg font-semibold tracking-[-0.03em] text-white sm:mt-4 sm:text-xl">{feature.title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">{feature.text}</p>
      </div>
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

export default function PlatformSection({ featureCards }) {
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
    <section id="platform" className={`${sectionShell} ${sectionGap} border-t border-[#1F2A3D]`}>
      <SectionIntro
        badge="What we do"
        title="The smarter way to run a restaurant."
        description="Guests pre-order from their phone. GPS triggers the kitchen at the right moment. Food is always hot, service is always fast."
      />

      {/* Mobile: horizontal scroll with peek */}
      <div className="mt-6 lg:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          role="region"
          aria-label="Platform features"
        >
          {featureCards.map((feature, index) => (
            <div key={feature.title} className="w-[75vw] min-w-[75vw] shrink-0 snap-start last:mr-4">
              <FeatureCard feature={feature} index={index} animate={false} />
            </div>
          ))}
        </div>
        <ScrollDots count={featureCards.length} active={activeIndex} />
      </div>

      {/* Desktop: grid */}
      <div className="mt-7 hidden gap-4 sm:mt-8 lg:grid lg:grid-cols-2">
        {featureCards.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} hoverable />
        ))}
      </div>
    </section>
  )
}
