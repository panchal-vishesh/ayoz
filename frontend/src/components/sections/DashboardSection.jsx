import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LocationSearchingRoundedIcon from '@mui/icons-material/LocationSearchingRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { compactCard, sectionGap, sectionShell, softCard, surfaceCard } from '../ui/styles'
import { formatMoney } from '../../utils/formatting'
import { bellAlert, popAlert, warningBeep } from '../../utils/audio'

function ConsoleIdle({ onSimulateArrival, disabled }) {
  const ringSizes = [56, 80, 104]
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <div className="relative mb-4 flex h-[100px] items-center justify-center sm:h-[120px]">
        {ringSizes.map((size, index) => (
          <motion.span
            key={size}
            className="absolute rounded-full border border-brand/20"
            style={{ width: size, height: size }}
            animate={disabled ? {} : { scale: [0.82, 1.08, 0.82], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.35, ease: 'easeInOut' }}
          />
        ))}
        <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border sm:h-[68px] sm:w-[68px] ${disabled ? 'border-white/10 bg-white/[0.04] text-slate-600' : 'border-brand/25 bg-brand/10 text-brand-soft'}`}>
          <LocationSearchingRoundedIcon fontSize="inherit" className="text-[1.25rem] sm:text-[1.5rem]" />
        </div>
      </div>

      <strong className="mt-4 block font-display text-2xl tracking-[-0.05em] text-slate-50 sm:mt-6 sm:text-3xl">
        Kitchen standby
      </strong>
      <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
        {disabled
          ? 'Add a menu item above first, then simulate a guest arrival to trigger the kitchen alert.'
          : 'The system is waiting for the customer to enter the preparation radius.'}
      </p>
      <Button
        className="mt-5 w-full gap-2 sm:mt-6 sm:w-auto"
        onClick={onSimulateArrival}
        disabled={disabled}
      >
        <LocationSearchingRoundedIcon fontSize="inherit" className="text-base" />
        {disabled ? 'Add an item to enable' : 'Simulate 2 km arrival'}
      </Button>
    </motion.div>
  )
}

function ConsoleTracking() {
  return (
    <motion.div
      key="tracking"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <motion.div
        className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-soft sm:px-4 sm:py-2 sm:text-[0.72rem]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <RouteRoundedIcon fontSize="inherit" className="mr-1.5 text-[0.95rem]" />
        Live ETA syncing
      </motion.div>
      <strong className="mt-4 block font-display text-2xl tracking-[-0.05em] text-slate-50 sm:mt-5 sm:text-3xl">
        Tracking live approach
      </strong>
      <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
        Customer ETA is updating in real time based on current location.
      </p>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/8 sm:mt-6 sm:h-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.2, ease: 'linear' }}
        />
      </div>
      <span className="mt-2.5 inline-block text-xs text-slate-300/65 sm:mt-3 sm:text-sm">
        Distance threshold: 2 km to 0.4 km
      </span>
    </motion.div>
  )
}

function ConsoleAlert({ onStop, onAcknowledge }) {
  return (
    <motion.div
      key="alert"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="w-full"
    >
      {/* Pulsing urgent badge — like Zepto/Blinkit */}
      <motion.div
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-soft to-brand px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#050712] sm:px-4 sm:py-2 sm:text-[0.72rem]"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <NotificationsActiveRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
        Priority alert · Kitchen action required
      </motion.div>

      <strong className="mt-4 block font-display text-2xl tracking-[-0.05em] text-slate-50 sm:mt-5 sm:text-3xl">
        Start cooking now
      </strong>
      <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
        Table 5 guest is <span className="font-semibold text-brand-soft">4 minutes away</span>. Fire the order immediately for perfect hot timing.
      </p>

      {/* ETA countdown bar */}
      <div className="mt-4 overflow-hidden rounded-full bg-white/[0.06] h-2">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand to-amber-400"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 30, ease: 'linear' }}
        />
      </div>
      <span className="mt-1.5 block text-[0.65rem] text-slate-400">Guest arrival countdown</span>

      {/* Action buttons */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:mt-6">
        {/* Acknowledge — marks as cooking started */}
        <button
          onClick={onAcknowledge}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,185,129,0.45)]"
        >
          <WhatshotRoundedIcon className="text-[1rem]" />
          Cooking started
          <CheckRoundedIcon className="text-[0.9rem]" />
        </button>

        {/* Stop sound */}
        <button
          onClick={onStop}
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20"
        >
          <StopRoundedIcon className="text-[1rem]" />
          Stop alert
        </button>
      </div>
    </motion.div>
  )
}

function CookingConfirmed({ onReset }) {
  return (
    <motion.div
      key="confirmed"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/20">
        <WhatshotRoundedIcon className="text-emerald-400 text-[1.6rem]" />
      </div>
      <strong className="mt-4 block font-display text-2xl tracking-[-0.05em] text-slate-50 sm:mt-5 sm:text-3xl">
        Kitchen is cooking!
      </strong>
      <p className="mt-2 text-xs leading-6 text-slate-300/70 sm:mt-3 sm:text-sm sm:leading-7">
        Order confirmed. Food will be hot and ready when the guest sits down.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
        <CheckRoundedIcon className="text-emerald-400 text-[1rem] shrink-0" />
        <span className="text-xs text-emerald-300">Alert acknowledged · Sound stopped</span>
      </div>
      <Button variant="secondary" className="mt-5 w-full gap-2 sm:mt-6 sm:w-auto" onClick={onReset}>
        <RouteRoundedIcon fontSize="inherit" className="text-base" />
        Reset demo
      </Button>
    </motion.div>
  )
}

export default function DashboardSection({
  cart,
  convenienceFee,
  tax,
  total,
  hotelGets,
  simulating,
  alert,
  onSimulateArrival,
  onResetAlert,
}) {
  const stopSoundRef = useRef(null)
  const stopWarningRef = useRef(null)
  const warningTimerRef = useRef(null)
  const [acknowledged, setAcknowledged] = useState(false)

  // (1) 2km — metallic bell fires when alert triggers
  useEffect(() => {
    if (alert && !acknowledged) {
      stopSoundRef.current = bellAlert()
      // (3) 6-min warning — fires if not acknowledged in 6 mins
      warningTimerRef.current = setTimeout(() => {
        if (!acknowledged) {
          stopSoundRef.current?.()
          stopSoundRef.current = null
          stopWarningRef.current = warningBeep()
        }
      }, 6 * 60 * 1000)
    }
    return () => {
      stopSoundRef.current?.()
      stopSoundRef.current = null
      stopWarningRef.current?.()
      stopWarningRef.current = null
      clearTimeout(warningTimerRef.current)
    }
  }, [alert, acknowledged])

  // (2) 500m — soft digital pop fires when tracking starts
  useEffect(() => {
    if (simulating) popAlert()
  }, [simulating])

  const handleStop = () => {
    stopSoundRef.current?.()
    stopSoundRef.current = null
    stopWarningRef.current?.()
    stopWarningRef.current = null
    clearTimeout(warningTimerRef.current)
  }

  const handleAcknowledge = () => {
    stopSoundRef.current?.()
    stopSoundRef.current = null
    stopWarningRef.current?.()
    stopWarningRef.current = null
    clearTimeout(warningTimerRef.current)
    setAcknowledged(true)
  }

  const handleReset = () => {
    stopSoundRef.current?.()
    stopSoundRef.current = null
    stopWarningRef.current?.()
    stopWarningRef.current = null
    clearTimeout(warningTimerRef.current)
    setAcknowledged(false)
    onResetAlert()
  }

  const cartEmpty = cart.length === 0

  return (
    <section id="dashboard" className={`${sectionShell} ${sectionGap} grid gap-4 sm:gap-5 xl:grid-cols-2 xl:items-start`}>
      {/* Settlement card */}
      <div className={`${surfaceCard} p-4 sm:p-5`}>
        <Badge>
          <ReceiptLongRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
          Settlement view
        </Badge>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-slate-50 sm:mt-4 sm:text-4xl lg:text-5xl">
          Transparent payment split for hotel teams
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-300/70 sm:text-sm sm:leading-7">
          Managers can see exactly what the customer paid, what the platform charged, and
          what amount is transferred to the hotel.
        </p>

        {cartEmpty ? (
          <div className={`${compactCard} mt-4 p-4`}>
            <strong className="block text-base font-semibold text-slate-50 sm:text-lg">
              No order yet
            </strong>
            <p className="mt-2 text-xs leading-6 text-slate-300/65 sm:text-sm sm:leading-7">
              Add any menu item above to populate the live payment breakdown.
            </p>
          </div>
        ) : (
          <div className={`${compactCard} mt-4 space-y-3 p-4`}>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3.5 text-sm text-slate-200"
              >
                <span className="text-xs sm:text-sm">{item.name} × {item.qty}</span>
                <strong className="shrink-0 font-semibold text-slate-50">
                  {formatMoney(item.price * item.qty)}
                </strong>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs text-slate-300/65 sm:text-sm">
              <span>Convenience fee (AyoZ)</span>
              <span>{formatMoney(convenienceFee)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300/65 sm:text-sm">
              <span>Tax (10%)</span>
              <span>{formatMoney(tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.07] pt-3.5 text-sm font-semibold text-slate-50 sm:text-base">
              <span>Customer pays</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <div className="relative overflow-hidden rounded-[18px] border border-emerald-300/15 bg-[linear-gradient(135deg,rgba(52,211,153,0.1),rgba(16,185,129,0.05))] p-4 sm:rounded-[20px] sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-emerald-300/80 sm:text-xs">
                <PaymentsRoundedIcon fontSize="inherit" className="text-[0.92rem]" />
                Hotel receives
              </p>
              <strong className="mt-1.5 block font-display text-3xl tracking-[-0.05em] text-emerald-200 sm:mt-2 sm:text-4xl">
                {formatMoney(hotelGets)}
              </strong>
              <span className="mt-1.5 block text-xs text-emerald-100/60 sm:mt-2 sm:text-sm">
                Estimated payout settled within 24 hours
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Kitchen trigger card */}
      <div className={`${surfaceCard} p-4 sm:p-5`}>
        <Badge variant="warm">
          <NotificationsActiveRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
          Kitchen trigger demo
        </Badge>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-slate-50 sm:mt-4 sm:text-4xl lg:text-5xl">
          Live arrival alerts tell the kitchen exactly when to start.
        </h2>
        <p className="mt-3 text-xs leading-6 text-slate-300/75 sm:text-sm sm:leading-7">
          Less guesswork, better timing, and hotter food served closer to guest arrival.
        </p>

        {/* Hint when cart is empty */}
        {cartEmpty && !alert && !simulating && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <p className="text-xs text-amber-300/80">
              Add a menu item from above first — then simulate a guest arrival to hear the kitchen alert.
            </p>
          </motion.div>
        )}

        <div
          className={`${softCard} relative mt-4 overflow-hidden p-4 sm:p-5 transition-all duration-500 ${
            alert && !acknowledged
              ? 'border-brand/30 bg-[linear-gradient(135deg,rgba(255,107,26,0.14),rgba(255,179,71,0.08))] shadow-[0_0_0_1px_rgba(255,107,26,0.15),0_24px_60px_rgba(80,30,0,0.3)]'
              : acknowledged
              ? 'border-emerald-500/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(52,211,153,0.04))]'
              : ''
          }`}
        >
          {/* Pulsing background glow when alert is active */}
          {alert && !acknowledged && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[24px] bg-brand/[0.06]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <AnimatePresence mode="wait">
            {!simulating && !alert && !acknowledged && (
              <ConsoleIdle onSimulateArrival={onSimulateArrival} disabled={cartEmpty} />
            )}
            {simulating && !alert && <ConsoleTracking />}
            {alert && !acknowledged && (
              <ConsoleAlert onStop={handleStop} onAcknowledge={handleAcknowledge} />
            )}
            {acknowledged && <CookingConfirmed onReset={handleReset} />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
