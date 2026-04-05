import { useState } from 'react'
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import HeadsetMicRoundedIcon from '@mui/icons-material/HeadsetMicRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import { AnimatePresence, motion } from 'framer-motion'
import { clampFill } from '../../shared'
import { INNER, HealthRing } from './OverviewCards'

export default function HeroBanner({ dashboard, onSectionChange, activeSection }) {
  const pulse = dashboard.platformPulse ?? []
  const score = pulse.length ? Math.round(pulse.reduce((s, p) => s + clampFill(p.fill), 0) / pulse.length) : 0
  const restaurants = dashboard.restaurants ?? []
  const cities = new Set(restaurants.map((r) => r.city)).size
  const totalOrders = restaurants.reduce((s, r) => s + Number(String(r.stats?.todayOrders ?? '0').replace(/[^0-9]/g, '')), 0)
  const avgReady = restaurants.length
    ? Math.round(restaurants.reduce((s, r) => s + Number(String(r.stats?.readyRate ?? '0').replace(/[^0-9]/g, '')), 0) / restaurants.length)
    : 0

  const ordersLabel = totalOrders === 0 ? '— orders today' : `${totalOrders} orders today`
  const readyLabel = avgReady === 0 ? '— ready rate' : `${avgReady}% ready rate`

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(10,20,50,0.98),rgba(5,10,28,0.97))] p-5 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/[0.10] blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-indigo-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20">
              <BoltRoundedIcon className="text-[0.8rem] text-blue-400" />
            </span>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">Admin · Command Centre</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Platform overview</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Live health, city rollout, and real-time metrics across all active venues.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: `${restaurants.length} venues`, icon: StorefrontRoundedIcon },
              { label: `${cities} cities`, icon: LocationOnRoundedIcon },
              { label: ordersLabel, icon: WhatshotRoundedIcon },
              { label: readyLabel, icon: TrendingUpRoundedIcon },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Icon className="text-[0.75rem]" /> {label}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: 'Analytics',   section: 'analytics',   Icon: AutoGraphRoundedIcon,   primary: true },
              { label: 'Restaurants', section: 'restaurants', Icon: StorefrontRoundedIcon },
              { label: 'Users',       section: 'users',       Icon: PeopleRoundedIcon },
              { label: 'Support',     section: 'support',     Icon: HeadsetMicRoundedIcon },
            ].map(({ label, section, Icon, primary }) => {
              const isActive = activeSection === section
              return (
                <button key={section} onClick={() => onSectionChange(section)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                    isActive ? 'bg-blue-500 text-white ring-2 ring-blue-400/40'
                    : primary ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]'
                  }`}>
                  <Icon className="text-[1rem]" /> {label}
                  {isActive && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
              )
            })}
          </div>
        </div>
        <HealthRing score={score} />
      </div>
    </div>
  )
}
