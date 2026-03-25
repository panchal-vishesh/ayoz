import { AnimatePresence, motion } from 'framer-motion'

function getStatus(progress) {
  if (progress >= 100) {
    return 'Ready'
  }

  if (progress >= 72) {
    return 'Final checks'
  }

  if (progress >= 42) {
    return 'Syncing service'
  }

  return 'Preparing launch'
}

export default function StartupLoader({ isVisible, progress }) {
  const roundedProgress = Math.max(0, Math.min(100, Math.round(progress)))
  const status = getStatus(roundedProgress)

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="startup-loader"
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,107,26,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,179,71,0.08),transparent_24%),linear-gradient(180deg,#1C1C1E_0%,#141416_100%)] px-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute -left-16 top-12 h-32 w-32 rounded-full bg-orange-400/10 blur-[80px]"
            animate={{ x: [0, 18, 0], y: [0, 14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative w-full max-w-[16.5rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(28,28,30,0.94),rgba(20,20,22,0.9))] p-4 text-center shadow-[0_18px_56px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:max-w-[17rem]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.2 } }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.26em] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
              AyoZ
            </div>

            <motion.div
              className="relative mx-auto mt-4 h-14 w-14"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-[-7px] rounded-full border border-orange-300/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-[-10px] rounded-full bg-orange-400/8 blur-md"
                animate={{ scale: [0.96, 1.06, 0.96], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/12 bg-white/[0.05] shadow-[0_14px_32px_rgba(0,0,0,0.24)]">
                <motion.img
                  src="/icon-192.png"
                  alt="AyoZ"
                  className="h-10 w-10 rounded-[0.8rem] object-cover"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            <h1 className="mt-4 font-display text-[1.1rem] tracking-[-0.05em] text-white">
              Launching AyoZ
            </h1>
            <p className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-orange-400/70">
              Stop the Queue Not the Taste
            </p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.24em] text-slate-400">
              {status}
            </p>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="relative h-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#FF6B1A_0%,#FFB347_100%)]"
                  animate={{ width: `${roundedProgress}%` }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 w-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
                  animate={{ x: ['-120%', '620%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[0.68rem] text-slate-400">
              <span>System readying</span>
              <span>{roundedProgress}%</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
