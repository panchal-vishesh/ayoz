import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import SectionIntro from '../ui/SectionIntro'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { cardHover, sectionGap, sectionShell, softCard } from '../ui/styles'
import { fadeUp } from '../../utils/motion'
import { formatMoney } from '../../utils/formatting'

function MenuCard({ item, index, compact = false, hoverable = false, onAddToCart, animate = true, featured = false }) {
  const Tag = animate ? motion.article : 'article'
  const motionProps = animate
    ? { variants: fadeUp, initial: 'initial', whileInView: 'whileInView', viewport: { once: true, amount: 0.2 }, transition: { duration: 0.45, delay: index * 0.08 }, whileHover: hoverable ? { y: -4, transition: { duration: 0.25 } } : undefined }
    : {}
  return (
    <Tag
      {...motionProps}
      className={`relative h-full overflow-hidden transition-all duration-250 ${
        compact ? 'p-4' : 'p-6'
      } rounded-2xl border ${
        featured
          ? 'border-[#FF6B1A]/40 bg-[#151D2E] shadow-[0_0_40px_rgba(255,107,26,0.12)] scale-[1.02]'
          : 'border-[#1F2A3D] bg-[#151D2E] hover:border-[#FF6B1A]/20 hover:shadow-[0_0_30px_rgba(255,107,26,0.08)]'
      }`}
    >
      {featured && (
        <div className="absolute -top-px left-5 rounded-b-xl bg-[#FF6B1A] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white">Chef's pick</div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,107,26,0.06),transparent)]" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="neutral">
            <LocalDiningRoundedIcon fontSize="inherit" className="text-[0.92rem]" />
            {item.category}
          </Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1F2A3D] bg-[#101726] px-2.5 py-1 text-[0.65rem] font-medium text-[#CBD5E1]/70 sm:px-3 sm:py-1.5 sm:text-xs">
            <ScheduleRoundedIcon fontSize="inherit" className="text-[0.9rem] text-[#FFB347]/80" />
            {item.prep} min
          </span>
        </div>
        <h3 className={`mt-3 font-display font-semibold tracking-[-0.04em] text-white ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
          {item.name}
        </h3>
        <p className={`mt-2 text-sm leading-6 text-slate-400 ${compact ? '' : 'sm:mt-3 sm:leading-7'}`}>
          {item.note}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#1F2A3D] pt-4">
          <strong className={`font-display font-semibold tracking-[-0.04em] text-white ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
            {formatMoney(item.price)}
          </strong>
          <Button variant="secondary" compact className="gap-2" onClick={() => onAddToCart?.(item)}>
            <AddShoppingCartRoundedIcon fontSize="inherit" className="text-base" />
            Add
          </Button>
        </div>
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

export default function MenuSection({ menuRef, menu, onAddToCart }) {
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
    <section id="menu" ref={menuRef} className={`${sectionShell} ${sectionGap}`}>
      <SectionIntro
        badge="Our menu"
        badgeVariant="warm"
        title="Pick your food before you arrive."
        description="Choose what you want, pay online, and your food will be ready when you get here."
      />

      {/* Mobile: horizontal scroll with peek */}
      <div className="mt-6 md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          role="region"
          aria-label="Menu items"
        >
          {menu.map((item, index) => (
            <div key={item.id} className="w-[75vw] min-w-[75vw] shrink-0 snap-start first:ml-0 last:mr-4">
              <MenuCard item={item} index={index} compact onAddToCart={onAddToCart} animate={false} />
            </div>
          ))}
        </div>
        <ScrollDots count={menu.length} active={activeIndex} />
      </div>

      {/* Desktop: grid */}
      <div className="mt-7 hidden gap-4 sm:mt-8 md:grid md:grid-cols-2 xl:grid-cols-3">
        {menu.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} hoverable featured={index === 0} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  )
}
