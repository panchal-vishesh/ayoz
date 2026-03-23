import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import RadarRoundedIcon from '@mui/icons-material/RadarRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded'
import Button from './ui/Button'

const FOOTER_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Menu', id: 'menu' },
  { label: 'Journey', id: 'journey' },
  { label: 'Insights', id: 'insights' },
  { label: 'Devices', id: 'devices' },
]

const FOOTER_PANELS = [
  {
    title: 'Arrival sync',
    detail: 'GPS-based prep timing keeps service sharp.',
    icon: RouteRoundedIcon,
  },
  {
    title: 'Revenue clarity',
    detail: 'Hotels see payout logic instantly and cleanly.',
    icon: InsightsRoundedIcon,
  },
  {
    title: 'Device polish',
    detail: 'Phone, tablet, and kiosk layouts stay premium.',
    icon: DevicesRoundedIcon,
  },
]

const FOOTER_TAGS = [
  'Pre-order ready',
  'Live kitchen timing',
  'Minimal premium UI',
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function FooterPanel({ title, detail, icon: Icon }) {
  return (
    <div className="rounded-[22px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-4">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-brand-soft">
        <Icon fontSize="inherit" className="text-[1.1rem]" />
      </div>
      <h3 className="mt-4 font-display text-lg tracking-[-0.04em] text-slate-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-300/68">
        {detail}
      </p>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[linear-gradient(180deg,transparent,rgba(6,8,22,0.86))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(138,164,255,0.08),transparent_58%)]" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(11,17,33,0.96),rgba(7,11,24,0.92))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <div className="pointer-events-none absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-brand/10 blur-[100px]" />
          <div className="pointer-events-none absolute left-[-4rem] bottom-[-5rem] h-44 w-44 rounded-full bg-sky-400/8 blur-[100px]" />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.64rem] uppercase tracking-[0.3em] text-slate-300">
                <RadarRoundedIcon fontSize="inherit" className="text-[0.95rem] text-brand-soft" />
                Future dining layer
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-2.5">
                  <img
                    src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
                    alt="AyoZ"
                    className="h-10 w-auto"
                  />
                </div>
                <div>
                  <p className="font-display text-xl tracking-[-0.05em] text-slate-50">AyoZ</p>
                  <p className="text-[0.64rem] uppercase tracking-[0.28em] text-slate-400">
                    Premium dining operations
                  </p>
                </div>
              </div>

              <h2 className="mt-6 max-w-[14ch] font-display text-3xl leading-[0.95] tracking-[-0.055em] text-slate-50 sm:text-4xl lg:text-[3.15rem]">
                Built to make guest arrival feel instant.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300/75 sm:text-base">
                A cleaner hospitality interface for brands that want faster service, sharper
                operations, and a more elevated digital experience from reservation to table.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {FOOTER_TAGS.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection('menu')}
                >
                  Open live menu
                  <ArrowOutwardRoundedIcon fontSize="inherit" className="text-[1rem]" />
                </Button>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Back to top
                  <KeyboardArrowUpRoundedIcon fontSize="inherit" className="text-[1rem]" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.24em] text-slate-400">
                      System state
                    </p>
                    <h3 className="mt-2 font-display text-2xl tracking-[-0.05em] text-slate-50">
                      Live and guest-ready
                    </h3>
                  </div>
                  <div className="rounded-full border border-emerald-400/18 bg-emerald-400/[0.08] px-3 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-emerald-200">
                    Online
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-3.5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-brand-soft">
                      <TableRestaurantRoundedIcon fontSize="inherit" className="text-[1.15rem]" />
                    </div>
                    <p className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
                      Table flow
                    </p>
                    <strong className="mt-1 block font-display text-xl tracking-[-0.04em] text-slate-50">
                      Zero-wait
                    </strong>
                  </div>
                  <div className="rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-3.5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-sky-200">
                      <InsightsRoundedIcon fontSize="inherit" className="text-[1.15rem]" />
                    </div>
                    <p className="mt-3 text-[0.62rem] uppercase tracking-[0.22em] text-slate-400">
                      Ops clarity
                    </p>
                    <strong className="mt-1 block font-display text-xl tracking-[-0.04em] text-slate-50">
                      Fully visible
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-slate-400">
                    Quick access
                  </p>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-slate-300">
                    Smooth scroll
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {FOOTER_LINKS.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-slate-200 transition-all duration-200 hover:border-brand/25 hover:bg-white/[0.06] hover:text-white"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {FOOTER_PANELS.map((panel) => (
              <FooterPanel
                key={panel.title}
                title={panel.title}
                detail={panel.detail}
                icon={panel.icon}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              (c) {new Date().getFullYear()} AyoZ - Premium dining flow platform
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 8px rgba(74,222,128,0.85)' }}
                />
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-200/80">
                  Live platform
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-slate-300">
                Built for modern hospitality
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
