import { motion } from 'framer-motion'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import Button from './ui/Button'

const NAV_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Menu', id: 'menu' },
  { label: 'How it works', id: 'journey' },
  { label: 'Insights', id: 'insights' },
  { label: 'Devices', id: 'devices' },
]

const FEATURES = [
  { icon: RestaurantRoundedIcon, title: 'Pre-order food', text: 'Guests pick and pay before they leave home.' },
  { icon: LocationOnRoundedIcon, title: 'GPS kitchen alert', text: 'Kitchen starts cooking when guest is close.' },
  { icon: PaymentsRoundedIcon, title: 'Clear payouts', text: 'See exactly what you earn from every order.' },
  { icon: InsightsRoundedIcon, title: 'Live insights', text: 'Track your best dishes and busy hours.' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/ayoz',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/ayoz',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/ayoz',
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className="relative mt-4 border-t border-white/[0.06]">
      {/* top orange glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,rgba(255,107,26,0.07),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        {/* ── Top row ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          {/* Brand block */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.04] p-2">
                <img
                  src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
                  alt="AyoZ"
                  className="h-9 w-auto"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,26,0.5)) brightness(1.2)' }}
                />
              </div>
              <div>
                <p className="font-display text-lg tracking-[-0.05em] text-slate-50">AyoZ</p>
                <p className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-slate-400/60">
                  Stop the Queue Not the Taste
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300/65">
              Guests order food before they arrive. We track them and tell the kitchen when to cook.
              Food is hot and ready the moment they sit down.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => scrollTo('menu')}>
                See the menu
                <ArrowOutwardRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
              </Button>
              <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
                <KeyboardArrowUpRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
              </Button>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-500 mb-1">
              Navigate
            </p>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm text-slate-400 transition-colors hover:text-brand-soft"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Status card */}
          <div className="rounded-[20px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(28,28,30,0.9),rgba(20,20,22,0.85))] p-4 sm:p-5 lg:w-64">
            <div className="flex items-center justify-between">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Platform status
              </p>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 8px rgba(74,222,128,0.9)' }}
                />
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                  Live
                </span>
              </div>
            </div>
            <p className="mt-3 font-display text-xl tracking-[-0.04em] text-slate-50">
              Ready to serve
            </p>
            <p className="mt-1 text-xs text-slate-400/60">
              All systems running fine.
            </p>
            <div className="mt-4 h-px bg-white/[0.06]" />
            <p className="mt-3 text-[0.65rem] text-slate-500">
              Connect your restaurant to go live.
            </p>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,rgba(28,28,30,0.7),rgba(20,20,22,0.6))] p-4"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand-soft ring-1 ring-brand/20">
                <Icon fontSize="inherit" className="text-[1rem]" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-100">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400/70">{text}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AyoZ. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 transition-all duration-200 hover:border-brand/30 hover:bg-brand/[0.08] hover:text-brand-soft"
              >
                <Icon />
              </a>
            ))}
          </div>

          <p className="text-xs text-slate-600">
            Stop the Queue Not the Taste
          </p>
        </div>

      </div>
    </footer>
  )
}
