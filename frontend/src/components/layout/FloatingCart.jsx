import { AnimatePresence, motion } from 'framer-motion'
import { formatMoney } from '../../utils/formatting'

export default function FloatingCart({ itemCount, total, isVisible, onClose }) {
  return (
    <AnimatePresence>
      {itemCount > 0 && isVisible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed left-1/2 top-14 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-white/[0.09] bg-[linear-gradient(145deg,rgba(28,28,30,0.97),rgba(20,20,22,0.99))] px-4 py-3 shadow-[0_20px_56px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl sm:top-16 sm:max-w-md sm:rounded-[22px] sm:px-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 ring-1 ring-brand/25">
              <span className="font-display text-sm font-bold text-brand-soft">{itemCount}</span>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-soft/80">
                Live cart
              </p>
              <strong className="block text-sm font-semibold text-slate-50">
                {formatMoney(total)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close live cart"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-base text-slate-300 transition-all active:scale-95 hover:border-brand/30 hover:text-white"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
