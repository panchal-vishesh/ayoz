import { startTransition, useEffect, useRef, useState } from 'react'
import FloatingCart from './components/FloatingCart'
import Navbar from './components/Navbar'
import PageBackdrop from './components/PageBackdrop'
import StartupLoader from './components/StartupLoader'
import DashboardSection from './components/sections/DashboardSection'
import DeviceSection from './components/sections/DeviceSection'
import HeroSection from './components/sections/HeroSection'
import InsightsSection from './components/sections/InsightsSection'
import JourneySection from './components/sections/JourneySection'
import MenuSection from './components/sections/MenuSection'
import PlatformSection from './components/sections/PlatformSection'
import {
  analytics,
  deviceCards,
  featureCards,
  journey,
  menu,
  premiumSignals,
  statCards,
} from './data/siteContent'
import { beep } from './utils/audio'

export default function App() {
  const menuRef = useRef(null)
  const journeyRef = useRef(null)
  const arrivalTimerRef = useRef(null)
  const beepTimerRef = useRef(null)

  const [cart, setCart] = useState([])
  const [simulating, setSimulating] = useState(false)
  const [alert, setAlert] = useState(false)
  const [cartDismissed, setCartDismissed] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [bootProgress, setBootProgress] = useState(24)

  useEffect(() => {
    return () => {
      window.clearTimeout(arrivalTimerRef.current)
      window.clearTimeout(beepTimerRef.current)
    }
  }, [])

  useEffect(() => {
    let active = true
    let currentProgress = 24
    let minimumDelayId = null
    let revealDelayId = null
    let loadHandler = null

    const minimumDelay = new Promise((resolve) => {
      minimumDelayId = window.setTimeout(resolve, 720)
    })

    const pageReady = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
        return
      }

      loadHandler = () => {
        window.removeEventListener('load', loadHandler)
        resolve()
      }

      window.addEventListener('load', loadHandler)
    })

    const tickProgress = () => {
      currentProgress = Math.min(
        92,
        currentProgress + (currentProgress < 60 ? 14 : currentProgress < 84 ? 7 : 4),
      )
      setBootProgress(currentProgress)
    }

    const intervalId = window.setInterval(tickProgress, 85)
    tickProgress()

    Promise.allSettled([pageReady, minimumDelay]).then(() => {
      if (!active) {
        return
      }

      window.clearInterval(intervalId)
      setBootProgress(100)

      revealDelayId = window.setTimeout(() => {
        if (!active) {
          return
        }

        startTransition(() => {
          setIsBooting(false)
        })
      }, 150)
    })

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.clearTimeout(minimumDelayId)
      window.clearTimeout(revealDelayId)

      if (loadHandler) {
        window.removeEventListener('load', loadHandler)
      }
    }
  }, [])

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow

    if (isBooting) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [isBooting])

  const addToCart = (item) => {
    setCartDismissed(false)

    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id)

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
        )
      }

      return [...current, { ...item, qty: 1 }]
    })
  }

  const resetAlert = () => {
    window.clearTimeout(arrivalTimerRef.current)
    window.clearTimeout(beepTimerRef.current)
    setSimulating(false)
    setAlert(false)
  }

  const simulateArrival = () => {
    resetAlert()
    setSimulating(true)

    arrivalTimerRef.current = window.setTimeout(() => {
      setSimulating(false)
      setAlert(true)
      beep()

      beepTimerRef.current = window.setTimeout(() => {
        beep()
      }, 500)
    }, 3200)
  }

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const platformFee = subtotal ? 30 : 0
  const tax = subtotal ? Math.round(subtotal * 0.05) : 0
  const total = subtotal + platformFee + tax
  const hotelGets = Math.round(subtotal * 0.9)

  return (
    <>
      <StartupLoader isVisible={isBooting} progress={bootProgress} />

      <div
        aria-busy={isBooting}
        className={`relative isolate overflow-hidden transition-opacity duration-[350ms] ${
          isBooting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <PageBackdrop />
        <Navbar />
        <FloatingCart
          itemCount={itemCount}
          total={total}
          isVisible={!cartDismissed}
          onClose={() => setCartDismissed(true)}
        />

        <HeroSection
          menuRef={menuRef}
          journeyRef={journeyRef}
          premiumSignals={premiumSignals}
          statCards={statCards}
        />
        <PlatformSection featureCards={featureCards} />
        <MenuSection menuRef={menuRef} menu={menu} onAddToCart={addToCart} />
        <DashboardSection
          cart={cart}
          platformFee={platformFee}
          tax={tax}
          total={total}
          hotelGets={hotelGets}
          simulating={simulating}
          alert={alert}
          onSimulateArrival={simulateArrival}
          onResetAlert={resetAlert}
        />
        <JourneySection journeyRef={journeyRef} journey={journey} />
        <InsightsSection analytics={analytics} />
        <DeviceSection deviceCards={deviceCards} />

        <footer className="border-t border-white/[0.06] bg-[linear-gradient(180deg,transparent,rgba(6,8,22,0.8))]">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/dja9q2ii9/image/upload/e_bgremoval/v1774270172/ayoz_hqv2rf.png"
                alt="AyoZ"
                className="h-7 w-auto opacity-70"
              />
              <span className="font-display text-sm tracking-[-0.04em] text-slate-400">AyoZ</span>
            </div>
            <p className="text-center text-xs text-slate-500">
              (c) {new Date().getFullYear()} AyoZ - Premium dining flow platform
            </p>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }}
              />
              <span className="text-[0.65rem] font-medium text-emerald-300/70">Live platform</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
