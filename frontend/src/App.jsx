import { startTransition, useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import PageBackdrop from './components/layout/PageBackdrop'
import StartupLoader from './components/layout/StartupLoader'
import ToastContainer from './components/layout/ToastContainer'
import { useAuthSession } from './hooks/useAuthSession'
import { useAppRoute, buildDashboardPath, getRoleBase, parseDashboardRoute } from './hooks/useAppRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import { useToast } from './utils/useToast'
import { SettingsProvider, useSettings } from './hooks/useSettings.jsx'
import ConnectionBanner from './components/layout/ConnectionBanner'

const authRoutes = new Set(['/login', '/signup'])
const dashboardBases = new Set(['/admin', '/restaurant', '/customer', '/dashboard'])

function isDashboardPath(path) {
  return [...dashboardBases].some(base => path === base || path.startsWith(base + '/'))
}

export default function App() {
  const { path, navigate } = useAppRoute()
  const { user, initializing, login, signup, logout, serverDown, connectionState, retryCount, nextRetryIn, manualRetry } = useAuthSession()
  const { toasts, toast } = useToast()

  const [isBooting, setIsBooting] = useState(true)
  const [bootProgress, setBootProgress] = useState(24)

  // derive activeSection from URL
  const activeSection = (user ? parseDashboardRoute(path, user.role) : null) ?? 'overview'

  const setActiveSection = (section) => {
    if (user) navigate(buildDashboardPath(user.role, section), { scroll: false })
  }

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
      if (document.readyState === 'complete') { resolve(); return }
      loadHandler = () => { window.removeEventListener('load', loadHandler); resolve() }
      window.addEventListener('load', loadHandler)
    })

    const tickProgress = () => {
      currentProgress = Math.min(92, currentProgress + (currentProgress < 60 ? 14 : currentProgress < 84 ? 7 : 4))
      setBootProgress(currentProgress)
    }

    const intervalId = window.setInterval(tickProgress, 85)
    tickProgress()

    Promise.allSettled([pageReady, minimumDelay]).then(() => {
      if (!active) return
      window.clearInterval(intervalId)
      setBootProgress(100)
      revealDelayId = window.setTimeout(() => {
        if (!active) return
        startTransition(() => setIsBooting(false))
      }, 150)
    })

    return () => {
      active = false
      window.clearInterval(intervalId)
      window.clearTimeout(minimumDelayId)
      window.clearTimeout(revealDelayId)
      if (loadHandler) window.removeEventListener('load', loadHandler)
    }
  }, [])

  const locked = isBooting || initializing
  useEffect(() => {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [locked])

  // redirect logic
  useEffect(() => {
    if (initializing) return
    if (serverDown) return // Don't redirect if server is just down
    if (!user && isDashboardPath(path)) {
      navigate('/login', { replace: true, scroll: false })
      return
    }
    if (user && (authRoutes.has(path) || path === '/dashboard')) {
      navigate(getRoleBase(user.role), { replace: true, scroll: false })
    }
  }, [initializing, navigate, path, user, serverDown])

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials)
      toast(`Welcome back, ${data.user.name}`, 'success')
      navigate(getRoleBase(data.user.role))
    } catch (error) {
      toast(error.message, 'alert', 4000)
    }
  }

  const handleSignup = async (details) => {
    try {
      const data = await signup(details)
      toast(`Account created for ${data.user.name}`, 'success')
      navigate(getRoleBase(data.user.role))
    } catch (error) {
      toast(error.message, 'alert', 4000)
    }
  }
  const handleLogout = async () => {
    await logout()
    toast('You have been signed out.', 'info')
    navigate('/', { replace: true })
  }

  const loadingShell = isBooting || initializing

  return (
    <SettingsProvider>
      <AppContent
        path={path}
        navigate={navigate}
        user={user}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleLogout={handleLogout}
        loadingShell={loadingShell}
        bootProgress={bootProgress}
        toast={toast}
        toasts={toasts}
        serverDown={serverDown}
        connectionState={connectionState}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        manualRetry={manualRetry}
      />
    </SettingsProvider>
  )
}

function AppContent({ path, navigate, user, activeSection, setActiveSection, handleLogin, handleSignup, handleLogout, loadingShell, bootProgress, toast, toasts, serverDown, connectionState, retryCount, nextRetryIn, manualRetry }) {
  const { toggles } = useSettings()

  return (
    <>
      <StartupLoader isVisible={loadingShell} progress={bootProgress} />
      <div
        aria-busy={loadingShell}
        className={`relative isolate transition-opacity duration-[350ms] ${loadingShell ? 'opacity-0' : 'opacity-100'}`}
      >
        <ToastContainer toasts={toasts} />
        <PageBackdrop />
        <Navbar
          currentPath={path}
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <ConnectionBanner
          connectionState={connectionState}
          retryCount={retryCount}
          nextRetryIn={nextRetryIn}
          onRetry={manualRetry}
        />
        {toggles.maintenanceMode && user?.role !== 'admin' && (
          <div className="fixed inset-x-0 top-0 z-[999] flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-semibold text-black">
            <span>🔧</span>
            Platform is under maintenance. Some features may be unavailable.
          </div>
        )}
        <div className={user ? 'lg:pl-[56px]' : ''}>
          {!user && path === '/' ? (
            <LandingPage toast={toast} onNavigate={navigate} />
          ) : !user && path === '/login' ? (
            <AuthPage mode="login" onNavigate={navigate} onLogin={handleLogin} onSignup={handleSignup} toast={toast} />
          ) : !user && path === '/signup' ? (
            toggles.customerSignup
              ? <AuthPage mode="signup" onNavigate={navigate} onLogin={handleLogin} onSignup={handleSignup} toast={toast} />
              : <AuthPage mode="login" onNavigate={navigate} onLogin={handleLogin} onSignup={handleSignup} signupDisabled toast={toast} />
          ) : user ? (
            <DashboardPage
              user={user}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
              onNavigate={navigate}
              toast={toast}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}
