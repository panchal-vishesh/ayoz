import { useEffect, useRef, useState } from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

const MARKETING_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Menu', id: 'menu' },
  { label: 'Journey', id: 'journey' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Insights', id: 'insights' },
]

const NAV_CONFIG = {
  admin: {
    nav: [
      { key: 'overview', label: 'Overview', icon: DashboardRoundedIcon },
      { key: 'restaurants', label: 'Restaurants', icon: StorefrontRoundedIcon },
      { key: 'analytics', label: 'Analytics', icon: AutoGraphRoundedIcon },
      { key: 'users', label: 'Users', icon: ManageAccountsRoundedIcon },
      { key: 'support', label: 'Support', icon: GroupsRoundedIcon },
    ],
    icon: ShieldRoundedIcon,
    label: 'Admin',
    bg: 'bg-gradient-to-b from-slate-950 to-slate-900',
    active: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    hover: 'hover:bg-blue-500/5 hover:border-blue-500/20',
  },
  restaurant: {
    nav: [
      { key: 'overview', label: 'Overview', icon: DashboardRoundedIcon },
      { key: 'orders', label: 'Orders', icon: RestaurantMenuRoundedIcon },
      { key: 'staff', label: 'Staff', icon: GroupsRoundedIcon },
      { key: 'menu', label: 'Menu', icon: StorefrontRoundedIcon },
    ],
    icon: StorefrontRoundedIcon,
    label: 'Restaurant',
    bg: 'bg-gradient-to-b from-slate-950 to-slate-900',
    active: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    hover: 'hover:bg-emerald-500/5 hover:border-emerald-500/20',
  },
  customer: {
    nav: [
      { key: 'overview', label: 'Overview', icon: DashboardRoundedIcon },
      { key: 'explore', label: 'Explore', icon: TravelExploreRoundedIcon },
      { key: 'orders', label: 'Orders', icon: RestaurantMenuRoundedIcon },
      { key: 'rewards', label: 'Rewards', icon: LocalOfferRoundedIcon },
    ],
    icon: PersonRoundedIcon,
    label: 'Customer',
    bg: 'bg-gradient-to-b from-slate-950 to-slate-900',
    active: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    hover: 'hover:bg-orange-500/5 hover:border-orange-500/20',
  },
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function HamburgerButton({ open, onClick, animateIn = false }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      initial={animateIn ? { x: 24, opacity: 0 } : false}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32, delay: 0.1 }}
      className="relative flex h-8 w-6 items-center justify-center"
    >
      <div className="flex flex-col justify-center items-end gap-[5px]">
        <motion.span
          animate={open
            ? { rotate: 45, y: 7, width: 22, backgroundColor: '#e2e8f0' }
            : { rotate: 0, y: 0, width: 22, backgroundColor: '#94a3b8' }}
          transition={{ type: 'spring', stiffness: 600, damping: 32 }}
          className="block h-px rounded-none"
          style={{ width: 22 }}
        />
        <motion.span
          animate={open
            ? { opacity: 0, x: 10 }
            : { opacity: 1, x: 0, backgroundColor: '#94a3b8' }}
          transition={{ type: 'spring', stiffness: 600, damping: 32, delay: open ? 0 : 0.04 }}
          className="block h-px rounded-none"
          style={{ width: 14 }}
        />
        <motion.span
          animate={open
            ? { rotate: -45, y: -7, width: 22, backgroundColor: '#e2e8f0' }
            : { rotate: 0, y: 0, width: 8, backgroundColor: '#94a3b8' }}
          transition={{ type: 'spring', stiffness: 600, damping: 32, delay: open ? 0 : 0.08 }}
          className="block h-px rounded-none"
          style={{ width: 8 }}
        />
      </div>
    </motion.button>
  )
}

function ScrollProgress({ enabled }) {
  const raw = useMotionValue(0)
  const progress = useSpring(raw, { stiffness: 200, damping: 30 })

  useEffect(() => {
    if (!enabled) {
      raw.set(0)
      return undefined
    }

    const update = () => {
      const element = document.documentElement
      raw.set(element.scrollTop / Math.max(1, element.scrollHeight - element.clientHeight))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [enabled, raw])

  if (!enabled) return null

  return (
    <motion.div
      style={{ scaleX: progress, transformOrigin: '0%' }}
      className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-orange-500"
    />
  )
}

// Workspace Sidebar
function WorkspaceSidebar({ user, onNavigate, onLogout, activeSection, onSectionChange, expanded, mobile, onClose }) {
  const config = NAV_CONFIG[user.role] ?? NAV_CONFIG.customer
  const initials = String(user.name ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'U'

  return (
    <div className={`flex h-full flex-col ${config.bg} border-l border-white/5`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <button onClick={() => { onNavigate('/'); onClose?.(); }} className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
            alt="AyoZ"
            className="h-7 w-auto"
            style={{ filter: 'brightness(1.1)' }}
          />
          {(expanded || mobile) && <span className="font-display text-sm text-white select-none">AyoZ</span>}
        </button>
        {mobile && <HamburgerButton open onClick={onClose} animateIn />}
      </div>

      {/* User Info */}
      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
            {initials}
          </div>
          {(expanded || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[0.65rem] text-slate-400">{config.label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5">
        {config.nav.map(({ key, label, icon: Icon }) => {
          const isActive = activeSection === key
          return (
            <div key={key} className="group relative">
              <motion.button
                onClick={() => { onSectionChange(key); onClose?.(); }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'tween', duration: 0.08 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? config.active : 'text-slate-400'
                }`}
              >
                <Icon className="text-[1.15rem] shrink-0" />
                <AnimatePresence>
                  {(expanded || mobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.08 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              {!mobile && !expanded && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-sm border border-white/10 text-xs font-medium text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  {label}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-2 space-y-0.5 border-t border-white/5 pt-2">
        {/* Settings — first */}
        <div className="group relative">
          <motion.button
            onClick={() => { onSectionChange('settings'); onClose?.(); }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'tween', duration: 0.08 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
              activeSection === 'settings' ? config.active : 'text-slate-400'
            }`}
          >
            <SettingsRoundedIcon className="text-[1.15rem] shrink-0" />
            <AnimatePresence>
              {(expanded || mobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.08 }}
                  className="whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {!mobile && !expanded && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-sm border border-white/10 text-xs font-medium text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150"
            >
              Settings
            </motion.div>
          )}
        </div>
        {/* Sign out — below settings */}
        <div className="group relative">
          <motion.button
            onClick={() => { onLogout(); onClose?.(); }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'tween', duration: 0.08 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400"
          >
            <LogoutRoundedIcon className="text-[1.15rem] shrink-0" />
            <AnimatePresence>
              {(expanded || mobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.08 }}
                  className="whitespace-nowrap"
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          {!mobile && !expanded && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-sm border border-white/10 text-xs font-medium text-white whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-150"
            >
              Sign out
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sidebar Component
function Sidebar({ user, onNavigate, onLogout, activeSection, onSectionChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const config = NAV_CONFIG[user.role] ?? NAV_CONFIG.customer
  const activeLabel = config.nav.find(item => item.key === activeSection)?.label ?? 'Overview'

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: expanded ? 200 : 56 }}
        transition={{ type: 'tween', duration: 0.12 }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="fixed inset-y-0 left-0 z-50 hidden lg:block"
      >
        <WorkspaceSidebar
          user={user}
          onNavigate={onNavigate}
          onLogout={onLogout}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          expanded={expanded}
        />
      </motion.aside>

      {/* Mobile Header */}
      <div className={`fixed inset-x-0 top-0 z-50 lg:hidden ${config.bg} border-b border-white/5`}>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
              alt="AyoZ"
              className="h-6 w-auto"
              style={{ filter: 'brightness(1.1)' }}
            />
            <div>
              <span className="font-display text-sm text-white select-none">AyoZ</span>
              <p className="text-[0.6rem] text-slate-400">{activeLabel}</p>
            </div>
          </div>
          <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen(v => !v)} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/75 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
              className="fixed inset-y-0 right-0 z-[70] w-64 lg:hidden"
            >
              <WorkspaceSidebar
                user={user}
                onNavigate={onNavigate}
                onLogout={onLogout}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                expanded
                mobile
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Top Navigation (Marketing)
function TopNav({ currentPath, onNavigate }) {
  const isLanding = currentPath === '/'
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    observerRef.current?.disconnect()
    if (!isLanding) { setActive(''); return undefined }
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    MARKETING_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [isLanding])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => { setOpen(false) }, [currentPath])

  const links = MARKETING_LINKS.map(link => ({
    key: link.id,
    label: link.label,
    active: isLanding && active === link.id,
    onClick: isLanding
      ? () => scrollToSection(link.id)
      : () => { onNavigate('/'); setTimeout(() => scrollToSection(link.id), 120) },
  }))

  const solid = isLanding ? scrolled : true

  return (
    <>
      <header
        style={{
          background: 'linear-gradient(180deg, rgba(11,15,26,0.95) 0%, rgba(9,16,29,0.90) 100%)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          borderBottom: '1px solid rgba(31,42,61,0.8)',
          boxShadow: '0 1px 0 rgba(255,107,26,0.08), 0 8px 32px rgba(0,0,0,0.5)',
        }}
        className="fixed inset-x-0 top-0 z-[60]"
      >
        <ScrollProgress enabled={isLanding} />

        {/* thin animated bottom border */}
        <motion.div
          animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Main bar */}
        <div className="grid grid-cols-3 items-center h-16 px-5 sm:px-10 select-none">

          {/* Left — hamburger + menu label */}
          <div onClick={() => setOpen(v => !v)} className="flex items-center gap-3 group select-none justify-self-start cursor-pointer">
            <HamburgerButton open={open} onClick={null} />
            <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.25em] font-medium text-slate-400 group-hover:text-white transition-colors duration-200 select-none">
              {open ? 'Close' : 'Menu'}
            </span>
          </div>
          <button onClick={() => onNavigate('/')} className="flex items-center gap-2.5 group justify-self-center">
            <motion.img
              src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
              alt="AyoZ"
              className="h-8 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{ filter: 'brightness(1.15)' }}
            />
            <span className="font-display text-[1.05rem] tracking-[0.18em] uppercase text-white select-none">AyoZ</span>
          </button>

          {/* Right — actions */}
          <div className="flex items-center gap-5 justify-self-end">
            {currentPath === '/login' && (
              <button
                onClick={() => onNavigate('/signup')}
                className="hidden sm:block relative group text-[0.7rem] uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors duration-200"
              >
                Sign up
                <span className="absolute -bottom-px left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
              </button>
            )}
            {currentPath === '/signup' && (
              <button
                onClick={() => onNavigate('/login')}
                className="hidden sm:block relative group text-[0.7rem] uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors duration-200"
              >
                Sign in
                <span className="absolute -bottom-px left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
              </button>
            )}
            {currentPath !== '/login' && currentPath !== '/signup' && (
              <button
                onClick={() => onNavigate('/login')}
                className="hidden sm:block relative group text-[0.7rem] uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors duration-200"
              >
                Sign in
                <span className="absolute -bottom-px left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
              </button>
            )}
            <button
              onClick={() => onNavigate(currentPath === '/login' ? '/signup' : currentPath === '/signup' ? '/login' : '/signup')}
              className="relative group flex items-center justify-center"
            >
              {/* mobile: icon only */}
              <span className="sm:hidden flex h-8 w-8 items-center justify-center text-slate-400 hover:text-white transition-colors duration-200">
                <PersonRoundedIcon style={{ fontSize: '1.1rem' }} />
              </span>
              {/* desktop: text with wipe */}
              <span className="hidden sm:block relative overflow-hidden">
                <span className="relative z-10 px-4 py-1.5 block border border-white/20 group-hover:border-white/60 text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors duration-300">
                  {currentPath === '/login' ? 'Get started' : currentPath === '/signup' ? 'Log in' : 'Get started'}
                </span>
                <motion.span
                  className="absolute inset-0 bg-white"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ transformOrigin: 'left', mixBlendMode: 'difference' }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* Menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 z-50 h-screen w-72 bg-[rgba(4,7,15,0.99)] border-r border-white/[0.06] flex flex-col pt-16">

            {/* Nav links */}
            <nav className="flex flex-col px-6 mt-4 flex-1">
              {links.map((link, i) => (
                <motion.button
                  key={link.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'tween', duration: 0.18, delay: 0.08 + i * 0.05, ease: 'easeOut' }}
                  onClick={() => { link.onClick(); setOpen(false) }}
                  onMouseEnter={() => setHoveredLink(link.key)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group flex items-center gap-4 py-3.5 border-b border-white/[0.05] text-left"
                >
                  <span className="text-[0.5rem] text-slate-700 w-4 shrink-0 font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`relative text-sm font-light tracking-[0.12em] uppercase transition-colors duration-150 ${
                    link.active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    {link.label}
                    <span className={`absolute -bottom-px left-0 h-px bg-white transition-all duration-300 ${
                      link.active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </span>
                  <motion.span
                    animate={{ x: hoveredLink === link.key ? 0 : -6, opacity: hoveredLink === link.key ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="ml-auto text-slate-400 text-sm shrink-0"
                  >↗</motion.span>
                </motion.button>
              ))}
            </nav>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.15 }}
              className="flex flex-col gap-3 px-6 py-6 border-t border-white/[0.05]"
            >
              {currentPath !== '/signup' && (
                <button
                  onClick={() => { onNavigate('/login'); setOpen(false) }}
                  className="relative group text-[0.65rem] uppercase tracking-[0.18em] text-slate-400 hover:text-white transition-colors duration-150 text-left w-fit"
                >
                  Sign in
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
                </button>
              )}
              <button
                onClick={() => { onNavigate(currentPath === '/login' ? '/signup' : '/login'); setOpen(false) }}
                className="text-[0.65rem] uppercase tracking-[0.18em] text-white border border-white/20 hover:border-white/60 px-4 py-2 transition-colors duration-150 w-fit"
              >
                {currentPath === '/login' ? 'Get started' : currentPath === '/signup' ? 'Log in' : 'Get started'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Navbar({ currentPath = '/', user, onNavigate, onLogout, activeSection, onSectionChange }) {
  if (user) {
    return (
      <Sidebar
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
    )
  }
  return <TopNav currentPath={currentPath} onNavigate={onNavigate} />
}
