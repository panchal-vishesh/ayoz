import { AnimatePresence, motion } from 'framer-motion'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'

const icons = {
  success: CheckCircleRoundedIcon,
  alert: NotificationsActiveRoundedIcon,
  info: InfoRoundedIcon,
}

const styles = {
  success: 'border-emerald-400/25 bg-[linear-gradient(135deg,rgba(28,28,30,0.97),rgba(20,20,22,0.99))] text-emerald-300',
  alert: 'border-brand/30 bg-[linear-gradient(135deg,rgba(28,28,30,0.97),rgba(20,20,22,0.99))] text-brand-soft',
  info: 'border-white/15 bg-[linear-gradient(135deg,rgba(28,28,30,0.97),rgba(20,20,22,0.99))] text-slate-300',
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] ?? icons.info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${styles[t.type]}`}
            >
              <Icon fontSize="inherit" className="shrink-0 text-[1.1rem]" />
              <span className="text-sm font-medium text-slate-100">{t.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
