import { useEffect, useState } from 'react'

const ROLE_BASE = { admin: '/admin', restaurant: '/restaurant', customer: '/customer' }

const VALID_SECTIONS = {
  admin: new Set(['overview', 'restaurants', 'analytics', 'support', 'users', 'settings']),
  restaurant: new Set(['overview', 'orders', 'staff', 'menu', 'settings']),
  customer: new Set(['overview', 'explore', 'orders', 'rewards']),
}

export function getRoleBase(role) {
  return ROLE_BASE[role] ?? '/dashboard'
}

export function parseDashboardRoute(pathname, role) {
  const base = getRoleBase(role)
  if (!pathname.startsWith(base)) return null
  const rest = pathname.slice(base.length)
  const section = rest.replace(/^\//, '') || 'overview'
  const valid = VALID_SECTIONS[role]
  return valid?.has(section) ? section : 'overview'
}

export function buildDashboardPath(role, section) {
  const base = getRoleBase(role)
  return section === 'overview' ? base : `${base}/${section}`
}

function getRouteState() {
  return { path: window.location.pathname || '/' }
}

export function useAppRoute() {
  const [route, setRoute] = useState(getRouteState)

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteState())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (nextPath, options = {}) => {
    const { replace = false, scroll = true } = options
    if (nextPath !== window.location.pathname) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath)
      setRoute(getRouteState())
    }
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return { path: route.path, navigate }
}
