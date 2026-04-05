import { useEffect, useRef, useState } from 'react'
import Footer from '../components/layout/Footer'
import FloatingCart from '../components/layout/FloatingCart'
import CtaSection from '../components/sections/CtaSection'
import DashboardSection from '../components/sections/DashboardSection'
import DeviceSection from '../components/sections/DeviceSection'
import HeroSection from '../components/sections/HeroSection'
import InsightsSection from '../components/sections/InsightsSection'
import JourneySection from '../components/sections/JourneySection'
import MenuSection from '../components/sections/MenuSection'
import PlatformSection from '../components/sections/PlatformSection'
import PricingSection from '../components/sections/PricingSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import {
  analytics,
  deviceCards,
  featureCards,
  journey,
  menu,
  premiumSignals,
  pricingFeatures,
  pricingExample,
  statCards,
  testimonials,
  trustBadges,
} from '../data/siteContent'
import { api } from '../api/client'

export default function LandingPage({ toast, onNavigate }) {
  const menuRef = useRef(null)
  const journeyRef = useRef(null)
  const arrivalTimerRef = useRef(null)

  const [cart, setCart] = useState([])
  const [simulating, setSimulating] = useState(false)
  const [alert, setAlert] = useState(false)
  const [cartDismissed, setCartDismissed] = useState(false)
  const [liveStats, setLiveStats] = useState(null)

  // Fetch real platform stats
  useEffect(() => {
    api.getStats()
      .then((data) => setLiveStats(data.stats))
      .catch(() => setLiveStats(null))
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(arrivalTimerRef.current)
    }
  }, [])

  const addToCart = (item) => {
    setCartDismissed(false)
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (existing) {
        toast?.(`${item.name} qty updated`, 'success')
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
        )
      }
      toast?.(`${item.name} added to cart`, 'success')
      return [...current, { ...item, qty: 1 }]
    })
  }

  const resetAlert = () => {
    window.clearTimeout(arrivalTimerRef.current)
    setSimulating(false)
    setAlert(false)
  }

  const simulateArrival = () => {
    resetAlert()
    setSimulating(true)
    toast?.('Tracking guest location...', 'info')
    arrivalTimerRef.current = window.setTimeout(() => {
      setSimulating(false)
      setAlert(true)
      toast?.('Guest is nearby — start cooking now!', 'alert', 4000)
    }, 3200)
  }

  const handleSignup = () => onNavigate?.('/signup')

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const convenienceFee = subtotal ? 50 : 0
  const tax = subtotal ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + convenienceFee + tax
  const hotelGets = Math.round(subtotal * 0.9)

  return (
    <>
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
        trustBadges={trustBadges}
        onSignup={handleSignup}
        liveStats={liveStats}
      />
      <PlatformSection featureCards={featureCards} />
      <MenuSection menuRef={menuRef} menu={menu} onAddToCart={addToCart} />
      <JourneySection journeyRef={journeyRef} journey={journey} />
      <DashboardSection
        cart={cart}
        convenienceFee={convenienceFee}
        tax={tax}
        total={total}
        hotelGets={hotelGets}
        simulating={simulating}
        alert={alert}
        onSimulateArrival={simulateArrival}
        onResetAlert={resetAlert}
      />
      <TestimonialsSection testimonials={testimonials} />
      <PricingSection features={pricingFeatures} example={pricingExample} onSignup={handleSignup} />
      <InsightsSection analytics={analytics} />
      <DeviceSection deviceCards={deviceCards} />
      <CtaSection onSignup={handleSignup} liveStats={liveStats} />
      <Footer onNavigate={onNavigate} />
    </>
  )
}
