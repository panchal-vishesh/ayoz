import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Menu', id: 'menu' },
  { label: 'Journey', id: 'journey' },
  { label: 'Insights', id: 'insights' },
  { label: 'Devices', id: 'devices' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ── Animated hamburger bars → X ── */
function MenuIcon({ open }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
      {/* top bar */}
      <motion.rect
        x="0" y="0" width="18" height="2" rx="1" fill="currentColor"
        animate={open ? { rotate: 45, y: 6, width: 18 } : { rotate: 0, y: 0, width: 18 }}
        style={{ originX: '50%', originY: '50%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      {/* middle bar */}
      <motion.rect
        x="0" y="6" width="12" height="2" rx="1" fill="currentColor"
        animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
      />
      {/* bottom bar */}
      <motion.rect
        x="0" y="12" width="18" height="2" rx="1" fill="currentColor"
        animate={open ? { rotate: -45, y: -6, width: 18 } : { rotate: 0, y: 0, width: 18 }}
        style={{ originX: '50%', originY: '50%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </svg>
  )
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const raw = useMotionValue(0)
  const progress = useSpring(raw, { stiffness: 200, damping: 30 })

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      raw.set(el.scrollTop / (el.scrollHeight - el.clientHeight))
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [raw])

  return (
    <motion.div
      className="absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-brand via-brand-soft to-brand"
      style={{ scaleX: progress, transformOrigin: '0%' }}
    />
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Header bar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-3.5 lg:px-8 lg:pt-5"
      >
        <nav
          className={`relative mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-2xl border px-3 py-2.5 backdrop-blur-2xl transition-all duration-500 sm:rounded-[26px] sm:px-4 sm:py-3 lg:px-6 lg:py-3.5 ${
            scrolled
              ? 'border-white/[0.12] bg-[linear-gradient(145deg,rgba(5,8,20,0.96),rgba(6,8,22,0.94))] shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'border-white/[0.07] bg-[linear-gradient(145deg,rgba(5,8,20,0.6),rgba(6,8,22,0.5))] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]'
          }`}
        >
          <ScrollProgress />

          {/* ── Logo ── */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 sm:gap-2.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <motion.div
              className="relative rounded-xl border border-white/[0.08] p-1.5 sm:rounded-[14px] sm:p-2"
              whileHover={{ borderColor: 'rgba(138,164,255,0.3)', boxShadow: '0 0 20px rgba(138,164,255,0.15)' }}
              transition={{ duration: 0.25 }}
            >
              <img
                src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
                alt="AyoZ"
                className="h-8 w-auto drop-shadow-[0_4px_12px_rgba(138,164,255,0.3)] sm:h-9 lg:h-10"
                style={{ mixBlendMode: 'normal' }}
              />
            </motion.div>
            <div className="text-left">
              <p className="font-display text-sm tracking-[-0.05em] text-slate-50 sm:text-base lg:text-[1.05rem]">
                AyoZ
              </p>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.25em] text-slate-400/55 sm:text-[0.55rem]">
                Premium Dining
              </p>
            </div>
          </motion.button>

          {/* ── Desktop links (lg+) ── */}
          <div
            className="hidden items-center gap-0.5 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                onMouseEnter={() => setHovered(id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active === id ? 'text-slate-50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* hover bg */}
                {hovered === id && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {/* active pill with glow */}
                {active === id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-brand/[0.12] shadow-[0_0_16px_rgba(138,164,255,0.18)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
                {/* active dot */}
                {active === id && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-soft"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Tablet links (md–lg): icon-only pills ── */}
          <div className="hidden items-center gap-1 md:flex lg:hidden">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  active === id
                    ? 'bg-brand/10 text-brand-soft ring-1 ring-brand/25'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {/* Live badge */}
            <motion.div
              className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1.5 sm:px-3 lg:px-3.5"
              whileHover={{ borderColor: 'rgba(74,222,128,0.35)', backgroundColor: 'rgba(74,222,128,0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 sm:h-2 sm:w-2"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ boxShadow: '0 0 8px rgba(74,222,128,0.9)' }}
              />
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-emerald-200/85 sm:text-[0.62rem] lg:text-[0.65rem]">
                Live
              </span>
            </motion.div>

            {/* Hamburger — hidden on lg+ */}
            <motion.button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-slate-300 transition-colors hover:border-brand/25 hover:bg-brand/[0.07] hover:text-white lg:hidden"
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <MenuIcon open={open} />
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile / Tablet drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-[#060816]/75 backdrop-blur-md"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(300px,85vw)] flex-col border-l border-white/[0.08] bg-[linear-gradient(160deg,rgba(9,13,30,0.99),rgba(6,8,22,1))] shadow-[-32px_0_80px_rgba(0,0,0,0.7)]"
            >
              {/* Top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-brand/[0.06] blur-[60px]" />

              {/* Drawer header */}
              <div className="relative flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="rounded-xl border border-white/[0.08] p-1.5">
                    <img
                      src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
                      alt="AyoZ"
                      className="h-8 w-auto drop-shadow-[0_4px_12px_rgba(138,164,255,0.25)]"
                    />
                  </div>
                  <div>
                    <p className="font-display text-sm tracking-[-0.04em] text-slate-50">AyoZ</p>
                    <p className="text-[0.5rem] font-semibold uppercase tracking-[0.24em] text-slate-400/55">
                      Premium Dining
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-all hover:border-brand/25 hover:text-white active:scale-95"
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>

              {/* Nav links */}
              <nav className="relative flex flex-col gap-1.5 p-4">
                {NAV_LINKS.map(({ label, id }, i) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26, delay: i * 0.055 + 0.12 }}
                    onClick={() => { scrollTo(id); setOpen(false) }}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${
                      active === id
                        ? 'bg-brand/[0.12] text-brand-soft ring-1 ring-brand/25'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-slate-50'
                    }`}
                  >
                    {/* shimmer on hover */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-500 group-hover:translate-x-full" />

                    {/* number badge */}
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-xs transition-all duration-200 ${
                      active === id
                        ? 'bg-brand/20 text-brand-soft ring-1 ring-brand/30'
                        : 'bg-white/[0.05] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-300'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span className="flex-1">{label}</span>

                    {/* active arrow */}
                    {active === id && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-brand-soft/60"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Drawer footer */}
              <motion.div
                className="mt-auto p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                {/* Live status card */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(52,211,153,0.07),rgba(16,185,129,0.03))] p-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                  <div className="flex items-center gap-2.5">
                    <motion.span
                      className="h-2.5 w-2.5 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ boxShadow: '0 0 10px rgba(74,222,128,0.8)' }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-emerald-200/90">Live guest-ready platform</p>
                      <p className="mt-0.5 text-[0.62rem] text-emerald-300/50">All systems operational</p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[0.6rem] text-slate-600">
                  © {new Date().getFullYear()} AyoZ · Premium Dining Flow
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
