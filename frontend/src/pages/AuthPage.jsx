import { useMemo, useState } from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Button from '../components/ui/Button'
import { sectionShell, surfaceCard } from '../components/ui/styles'
import {
  getPasswordStrength,
  getPasswordValidationMessage,
} from '../utils/passwordStrength'

const demoAccess = [
  { label: 'Admin', identifier: 'admin@ayoz.in', password: 'Admin@12345', icon: ShieldRoundedIcon, tone: 'border-blue-400/20 bg-blue-500/[0.08] text-blue-100', iconTone: 'border-blue-400/20 bg-blue-500/[0.10] text-blue-200' },
  { label: 'Restaurant', identifier: 'AYOZREST01', password: 'AyoZ@Rest01', icon: StorefrontRoundedIcon, tone: 'border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-100', iconTone: 'border-emerald-400/20 bg-emerald-500/[0.10] text-emerald-200' },
  { label: 'Customer', identifier: 'guest@ayoz.in', password: 'Guest@12345', icon: PersonRoundedIcon, tone: 'border-orange-400/20 bg-orange-500/[0.08] text-orange-100', iconTone: 'border-orange-400/20 bg-orange-500/[0.10] text-orange-200' },
]

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-azure/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-azure/20'

const strengthToneStyles = {
  slate: { badge: 'border-white/10 bg-white/[0.04] text-slate-300', fill: 'bg-slate-500/50' },
  rose:  { badge: 'border-rose-300/20 bg-rose-300/[0.08] text-rose-100', fill: 'bg-rose-400' },
  amber: { badge: 'border-amber-300/20 bg-amber-300/[0.08] text-amber-100', fill: 'bg-amber-400' },
  blue:  { badge: 'border-blue-400/20 bg-blue-500/[0.08] text-blue-100', fill: 'bg-blue-400' },
  green: { badge: 'border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-100', fill: 'bg-emerald-400' },
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#2563EB,#FF6B1A)] shadow-[0_4px_14px_rgba(37,99,235,0.35)]">
        <BoltRoundedIcon fontSize="inherit" className="text-[1rem] text-white" />
      </span>
      <span className="font-display text-lg font-bold tracking-[-0.04em] text-slate-50">
        AyoZ
      </span>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <input className={`mt-2 ${inputClass}`} {...props} />
    </label>
  )
}

function PasswordField({ label, visible, onToggle, ...props }) {
  return (
    <label className="block">
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      <div className="relative mt-2">
        <input className={`${inputClass} pr-12`} type={visible ? 'text' : 'password'} {...props} />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-400/25 hover:text-blue-100"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible
            ? <VisibilityOffRoundedIcon fontSize="inherit" className="text-[1rem]" />
            : <VisibilityRoundedIcon fontSize="inherit" className="text-[1rem]" />}
        </button>
      </div>
    </label>
  )
}

function PasswordStrengthPanel({ password, confirmPassword }) {
  const strength = getPasswordStrength(password)
  const tone = strengthToneStyles[strength.tone]
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword
  const passwordsDifferent = Boolean(confirmPassword) && password !== confirmPassword

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Password strength
        </p>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${tone.badge}`}>
          {strength.isStrong ? <CheckCircleRoundedIcon fontSize="inherit" className="text-[0.85rem]" /> : null}
          {strength.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {strength.checks.map((check, index) => (
          <div
            key={check.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${index < strength.score ? tone.fill : 'bg-white/[0.08]'}`}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {strength.checks.map((check) => (
          <div
            key={check.id}
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs transition-colors duration-200 ${
              check.met
                ? 'border-emerald-400/20 bg-emerald-500/[0.08] text-emerald-100'
                : 'border-white/10 bg-white/[0.03] text-slate-400'
            }`}
          >
            <CheckCircleRoundedIcon fontSize="inherit" className="text-[0.95rem]" />
            {check.label}
          </div>
        ))}
      </div>

      {passwordsMatch ? (
        <p className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2 text-sm text-emerald-100">
          ✓ Passwords match — you're good to go.
        </p>
      ) : passwordsDifferent ? (
        <p className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] px-3 py-2 text-sm text-amber-100">
          Passwords do not match yet.
        </p>
      ) : null}
    </div>
  )
}

export default function AuthPage({ mode, onNavigate, onLogin, onSignup, signupDisabled, toast }) {
  const isLogin = mode === 'login'
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    confirmPassword: '',
  })

  const fillDemo = (identifier, password) => {
    setForm((f) => ({ ...f, identifier, password }))
    setFormError('')
  }
  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password])

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')

    try {
      if (isLogin) {
        await onLogin({ identifier: form.identifier, password: form.password })
        return
      }

      if (form.password !== form.confirmPassword) throw new Error('Passwords do not match.')
      if (!passwordStrength.isStrong) throw new Error(getPasswordValidationMessage())

      await onSignup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={`${sectionShell} relative min-h-screen pt-[5rem] pb-10 sm:pt-[6rem] flex items-center justify-center`}>
      {/* Page-level ambient glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500/[0.06] blur-[100px]" />

      <div className="relative w-full grid lg:grid-cols-2 lg:items-stretch gap-6 max-w-5xl">

        {/* ── Left panel — demo credentials (desktop only) ── */}
        <div className={`hidden lg:flex flex-col ${surfaceCard} relative overflow-hidden p-8`}>
          <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-blue-500/[0.14] blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-orange-500/[0.10] blur-[90px]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.7),rgba(251,146,60,0.5),transparent)]" />

          <BrandMark />

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-blue-100 w-fit">
            <BoltRoundedIcon fontSize="inherit" className="text-[0.85rem]" />
            Demo access
          </div>

          <h2 className="mt-4 font-display text-3xl tracking-[-0.05em] text-slate-50">
            Try any role instantly.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300/70">
            Use these credentials to explore each workspace. Each role has its own dashboard, tools, and live data.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {demoAccess.map(({ label, identifier, password, icon: Icon, tone, iconTone }) => (
              <button
                key={label}
                type="button"
                onClick={() => fillDemo(identifier, password)}
                className={`rounded-2xl border p-4 text-left transition hover:brightness-110 active:scale-[0.98] ${tone}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${iconTone}`}>
                      <Icon fontSize="inherit" className="text-[1rem]" />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{label}</p>
                  </div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] opacity-50">click to fill</span>
                </div>
                <div className="mt-3 space-y-1">
                  <p className="font-mono text-sm tracking-wide">{identifier}</p>
                  <p className="font-mono text-sm tracking-wide opacity-60">{password}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-auto pt-8 text-xs text-slate-500">
            Click any card to auto-fill the login form.
          </p>
        </div>

        {/* ── Right panel — form ── */}
        <div className={`${surfaceCard} relative overflow-hidden p-6 sm:p-8`}>
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-[80px]" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <BrandMark />
              <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {isLogin ? 'Welcome back' : 'Create account'}
              </p>
              <h2 className="mt-1 font-display text-2xl tracking-[-0.05em] text-slate-50 sm:text-3xl">
                {isLogin ? 'Log in to AyoZ' : 'Join AyoZ'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(isLogin ? '/signup' : '/login')}
              className="mt-1 shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-blue-400/25 hover:bg-white/[0.07] hover:text-blue-200"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>



          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {isLogin ? 'Sign in' : 'Register'}
            </span>
            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          {/* Form */}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {isLogin ? (
              <Field
                label="Email or login ID"
                value={form.identifier}
                onChange={updateField('identifier')}
                placeholder="abc@gmail.com / abc1209"
                autoComplete="username"
              />
            ) : (
              <>
                <Field label="Full name" value={form.name} onChange={updateField('name')} placeholder="Enter your full name" autoComplete="name" />
                <Field label="Email" value={form.email} onChange={updateField('email')} placeholder="you@example.com" autoComplete="email" />
                <Field label="Phone" value={form.phone} onChange={updateField('phone')} placeholder="+91 98765 43210" autoComplete="tel" />
              </>
            )}

            <PasswordField
              label="Password"
              visible={showPassword}
              onToggle={() => setShowPassword((c) => !c)}
              value={form.password}
              onChange={updateField('password')}
              placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {isLogin ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => toast?.('Password reset link sent to your email.', 'success', 4000)}
                  className="text-xs font-semibold text-slate-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <>
                {form.password.length > 0 && (
                  <PasswordStrengthPanel password={form.password} confirmPassword={form.confirmPassword} />
                )}
                <PasswordField
                  label="Confirm password"
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((c) => !c)}
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </>
            )}

            {formError ? (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/[0.08] px-4 py-3">
                <ErrorRoundedIcon fontSize="inherit" className="mt-0.5 shrink-0 text-[1.1rem] text-rose-400" />
                <p className="text-sm text-rose-100/90">{formError}</p>
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Please wait…' : isLogin ? 'Open dashboard' : 'Create account'}
              <ArrowOutwardRoundedIcon fontSize="inherit" className="text-[0.9rem]" />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            {isLogin ? (
              <>No account?{' '}
                {signupDisabled ? (
                  <span className="font-semibold text-slate-500">Signup is currently disabled</span>
                ) : (
                  <button type="button" onClick={() => onNavigate('/signup')} className="font-semibold text-blue-300 transition hover:text-white">
                    Sign up free
                  </button>
                )}
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => onNavigate('/login')} className="font-semibold text-blue-300 transition hover:text-white">
                  Log in
                </button>
              </>
            )}
          </p>
        </div>

      </div>
    </section>
  )
}
