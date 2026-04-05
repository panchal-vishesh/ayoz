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
      <div className="absolute inset-0 bg-[#0B0F1A]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_22%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.12),transparent_24%),linear-gradient(180deg,#09101d_0%,#050912_48%,#03050a_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(180deg,black,transparent_85%)]" />

      <motion.div
        className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/18 blur-[90px]"
        animate={{ x: [0, 22, 0], y: [0, 34, 0] }}
        transition={orbTransition}
      />
      <motion.div
        className="absolute -right-20 top-24 h-80 w-80 rounded-full bg-orange-500/14 blur-[110px]"
        animate={{ x: [0, -26, 0], y: [0, 28, 0] }}
        transition={{ ...orbTransition, duration: 16 }}
      />
      <motion.div
        className="absolute bottom-10 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-12 h-56 w-56 rounded-full bg-orange-400/8 blur-[100px]"
        animate={{ x: [0, 18, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
