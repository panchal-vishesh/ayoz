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

export default function MenuSection({ menuRef, menu, onAddToCart }) {
  return (
    <section id="menu" ref={menuRef} className={`${sectionShell} ${sectionGap}`}>
      <SectionIntro
        badge="Our menu"
        badgeVariant="warm"
        title="Pick your food before you arrive."
        description="Choose what you want, pay online, and your food will be ready when you get here."
      />

      <div className="mt-7 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menu.map((item, index) => (
          <motion.article
            key={item.id}
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.012 }}
            className={`${softCard} ${cardHover} relative overflow-hidden p-5 sm:p-6`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(255,107,26,0.06),transparent)]" />
            <div className="relative">
              {/* Category + prep — always one row */}
              <div className="flex items-center justify-between gap-2">
                <Badge variant="neutral">
                  <LocalDiningRoundedIcon fontSize="inherit" className="text-[0.92rem]" />
                  {item.category}
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[0.65rem] font-medium text-slate-300/70 sm:px-3 sm:py-1.5 sm:text-xs">
                  <ScheduleRoundedIcon fontSize="inherit" className="text-[0.9rem] text-emerald-300/80" />
                  {item.prep} min
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                {item.name}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-300/65 sm:mt-3 sm:text-sm sm:leading-7">
                {item.note}
              </p>

              {/* Price + button — always one row */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                <strong className="font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                  {formatMoney(item.price)}
                </strong>
                <Button
                  variant="secondary"
                  compact
                  className="gap-2"
                  onClick={() => onAddToCart(item)}
                >
                  <AddShoppingCartRoundedIcon fontSize="inherit" className="text-base" />
                  Add item
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
