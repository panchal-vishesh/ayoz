import { useEffect, useState } from 'react'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { api } from '../api/client'
import Button from '../components/ui/Button'
import { sectionShell } from '../components/ui/styles'
import AdminDashboard from './admin/AdminDashboard'
import CustomerDashboard from './customer/CustomerDashboard'
import RestaurantDashboard from './restaurant/RestaurantDashboard'
import { formatDateLabel, ROLE_THEMES, RoleBadge } from './shared'

function DashboardSkeleton({ theme }) {
  return (
    <div className="space-y-6">
      <div className={`${theme.surface} animate-pulse p-8`}>
        <div className="h-4 w-32 rounded-full bg-white/[0.08]" />
        <div className="mt-5 h-12 w-2/3 rounded-2xl bg-white/[0.08]" />
        <div className="mt-4 h-4 w-full rounded-full bg-white/[0.06]" />
        <div className="mt-3 h-4 w-5/6 rounded-full bg-white/[0.06]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className={`${theme.card} h-40 animate-pulse`} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className={`${theme.card} h-80 animate-pulse`} />
        <div className={`${theme.card} h-80 animate-pulse`} />
      </div>
    </div>
  )
}

export default function DashboardPage({ user, activeSection, onSectionChange, onLogout, onNavigate, toast }) {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    const loadDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.getDashboard()
        if (!ignore) setDashboard(data)
      } catch (err) {
        if (ignore) return
        setError(err.message)
        toast?.(err.message, 'alert', 4000)
        if (err.status === 401) {
          await onLogout()
          onNavigate('/login', { replace: true })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    if (user) loadDashboard()
    return () => { ignore = true }
  }, [onLogout, onNavigate, reloadKey, toast, user])

  if (!user) return null

  const theme = ROLE_THEMES[user.role] ?? ROLE_THEMES.customer

  let content = null

  if (loading) {
    content = <DashboardSkeleton theme={theme} />
  } else if (error) {
    content = (
      <section className={`${theme.surface} p-6 sm:p-8`}>
        <RoleBadge theme={theme}>
          <BoltRoundedIcon fontSize="inherit" className="text-[0.85rem]" />
          Dashboard error
        </RoleBadge>
        <h1 className="mt-5 font-display text-4xl tracking-[-0.06em] text-slate-50">We could not load the dashboard.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300/80 sm:text-base">{error}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant={theme.button} onClick={() => setReloadKey((v) => v + 1)}>
            Try again <ArrowOutwardRoundedIcon fontSize="inherit" className="text-[0.92rem]" />
          </Button>
          <Button variant={theme.ghost} onClick={() => onNavigate('/')}>
            Back to site <ArrowOutwardRoundedIcon fontSize="inherit" className="text-[0.92rem]" />
          </Button>
        </div>
      </section>
    )
  } else if (user.role === 'admin') {
    content = (
      <AdminDashboard
        dashboard={dashboard}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        theme={theme}
        onRefresh={() => setReloadKey((v) => v + 1)}
        toast={toast}
        loading={loading}
      />
    )
  } else if (user.role === 'restaurant') {
    content = (
      <RestaurantDashboard
        dashboard={dashboard}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        theme={theme}
        onRefresh={() => setReloadKey((v) => v + 1)}
        toast={toast}
      />
    )
  } else {
    content = (
      <CustomerDashboard
        user={user}
        dashboard={dashboard}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        theme={theme}
      />
    )
  }

  return (
    <div data-role={user.role} className="min-h-screen pb-10 pt-24 sm:pt-28 lg:pt-8">
      <div className={`${sectionShell} space-y-6`}>
        {content}
        {!loading && !error ? (
          <footer className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-slate-400">
            Signed in as <span className="font-semibold text-slate-200">{user.name}</span>
            {user.loginId ? <> · <span className="font-mono font-semibold text-slate-200">{user.loginId}</span></> : null}
            . Workspace refreshed for the {user.role} role on {formatDateLabel(new Date().toISOString())}.
          </footer>
        ) : null}
      </div>
    </div>
  )
}
