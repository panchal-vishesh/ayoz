import { motion, AnimatePresence } from 'framer-motion'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { CONNECTION_STATE } from '../../hooks/useAuthSession'

export default function ConnectionBanner({ connectionState, retryCount, nextRetryIn, onRetry }) {
  const isDown      = connectionState === CONNECTION_STATE.DISCONNECTED
  const isRetrying  = connectionState === CONNECTION_STATE.RECONNECTING
  const isRestored  = connectionState === CONNECTION_STATE.RESTORED
  const isVisible   = isDown || isRetrying || isRestored

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed inset-x-0 top-0 z-[9999] flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold ${
            isRestored
              ? 'bg-emerald-600'
              : 'bg-[rgba(15,15,25,0.97)] border-b border-rose-500/30'
          }`}
        >
          {isRestored ? (
            <>
              <CheckCircleRoundedIcon className="text-[1rem] text-white" />
              <span className="text-white">Connection restored — you're back online!</span>
            </>
          ) : (
            <>
              {/* Animated pulse dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              </span>

              <WifiOffRoundedIcon className="text-[1rem] text-rose-400" />

              <span className="text-rose-200">
                {isRetrying ? 'Reconnecting to server…' : 'Server offline'}
              </span>

              {/* Retry info */}
              {isRetrying && nextRetryIn > 0 && (
                <span className="text-slate-500 text-xs">
                  Next retry in {nextRetryIn}s
                </span>
              )}

              {retryCount > 0 && (
                <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[0.65rem] text-rose-400">
                  Attempt {retryCount}
                </span>
              )}

              {/* Spinning indicator when reconnecting */}
              {isRetrying && (
                <RefreshRoundedIcon className="text-[0.9rem] text-slate-500 animate-spin" />
              )}

              {/* Manual retry button */}
              <button
                onClick={onRetry}
                className="ml-2 flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
              >
                <RefreshRoundedIcon className="text-[0.8rem]" />
                Retry now
              </button>

              {/* Session safe indicator */}
              <span className="ml-auto hidden items-center gap-1.5 text-[0.65rem] text-slate-600 sm:flex">
                <CheckCircleRoundedIcon className="text-[0.75rem] text-emerald-600" />
                Session saved
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
