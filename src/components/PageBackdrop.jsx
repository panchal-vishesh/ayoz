import { motion } from 'framer-motion'

const orbTransition = {
  duration: 14,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
}

export default function PageBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-midnight" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,164,255,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(76,101,213,0.12),transparent_20%),linear-gradient(180deg,#060816_0%,#090d1b_48%,#060816_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(180deg,black,transparent_85%)]" />

      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/20 blur-[90px]"
        animate={{ x: [0, 22, 0], y: [0, 34, 0] }}
        transition={orbTransition}
      />
      <motion.div
        className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-[#4660df]/20 blur-[110px]"
        animate={{ x: [0, -26, 0], y: [0, 28, 0] }}
        transition={{ ...orbTransition, duration: 16 }}
      />
      <motion.div
        className="absolute bottom-12 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
