function isLocalHostname(hostname) {
  const value = String(hostname ?? '').toLowerCase()

  if (value === 'localhost' || value === '127.0.0.1' || value === '::1') {
    return true
  }

  if ((value && !value.includes('.')) || value.endsWith('.local')) {
    return true
  }

  const parts = value.split('.').map((part) => Number.parseInt(part, 10))

  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false
  }

  const [first, second] = parts

  return (
    first === 127 ||
    first === 10 ||
    (first === 192 && second === 168) ||
    (first === 172 && second >= 16 && second <= 31)
  )
}

function createAlternateApiBase(baseUrl, hostname) {
  try {
    const url = new URL(baseUrl)
    url.hostname = hostname
    return url.toString().replace(/\/$/, '')
  } catch {
    return ''
  }
}

function resolveApiBase() {
  const browserOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  const browserHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const configuredBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  try {
    const url = new URL(configuredBase, browserOrigin)

    if (isLocalHostname(browserHostname) && isLocalHostname(url.hostname)) {
      url.hostname = browserHostname
    }

    return url.toString().replace(/\/$/, '')
  } catch {
    return configuredBase.replace(/\/$/, '')
  }
}

function getFallbackApiBases(currentBase) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const currentUrl = new URL(currentBase)
    const browserHostname = window.location.hostname
    const candidates = []

    if (browserHostname && browserHostname !== currentUrl.hostname) {
      candidates.push(createAlternateApiBase(currentBase, browserHostname))
    }

    if (browserHostname !== '127.0.0.1') {
      candidates.push(createAlternateApiBase(currentBase, '127.0.0.1'))
    }

    if (browserHostname !== 'localhost') {
      candidates.push(createAlternateApiBase(currentBase, 'localhost'))
    }

    return candidates.filter(
      (candidate, index, list) =>
        candidate && candidate !== currentBase && list.indexOf(candidate) === index,
    )
  } catch {
    return []
  }
}

async function fetchWithFallback(path, options) {
  try {
    return await fetch(`${apiBase}${path}`, options)
  } catch (error) {
    for (const nextBase of getFallbackApiBases(apiBase)) {
      try {
        const response = await fetch(`${nextBase}${path}`, options)
        apiBase = nextBase
        return response
      } catch {
        // try next local candidate
      }
    }

    throw error
  }
}

let apiBase = resolveApiBase()
let csrfToken = null

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function createNetworkError(error) {
  return new ApiError(
    'Cannot reach the server right now. Make sure the backend is running and try again.',
    0,
    {
      cause: error instanceof Error ? error.message : String(error ?? ''),
    },
  )
}

function isMutationMethod(method) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method)
}

async function fetchCsrfToken() {
  let response

  try {
    response = await fetchWithFallback('/api/auth/csrf-token', {
      credentials: 'include',
      method: 'GET',
    })
  } catch (error) {
    throw createNetworkError(error)
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Unable to initialize a secure session.',
      response.status,
      data,
    )
  }

  if (!data?.csrfToken) {
    throw new ApiError('Unable to initialize a secure session.', response.status, data)
  }

  csrfToken = data.csrfToken
  return csrfToken
}

async function ensureCsrfToken() {
  return csrfToken || fetchCsrfToken()
}

async function refreshCsrfTokenSilently() {
  try {
    await fetchCsrfToken()
  } catch {
    csrfToken = null
  }
}

async function request(path, { method = 'GET', body, retryOnCsrfError = true } = {}) {
  const normalizedMethod = method.toUpperCase()
  const headers = {}

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (isMutationMethod(normalizedMethod)) {
    headers['X-CSRF-Token'] = await ensureCsrfToken()
  }

  let response

  try {
    response = await fetchWithFallback(path, {
      method: normalizedMethod,
      credentials: 'include',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw createNetworkError(error)
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (response.ok) {
    if (data?.csrfToken) {
      csrfToken = data.csrfToken
    }

    return data
  }

  if (
    retryOnCsrfError &&
    normalizedMethod !== 'GET' &&
    response.status === 403 &&
    data?.message === 'Invalid CSRF token.'
  ) {
    csrfToken = null
    await ensureCsrfToken()
    return request(path, { method: normalizedMethod, body, retryOnCsrfError: false })
  }

  throw new ApiError(
    data?.message || 'Something went wrong while talking to the server.',
    response.status,
    data,
  )
}

export const api = {
  async login(payload) {
    const data = await request('/api/auth/login', { method: 'POST', body: payload })
    csrfToken = null
    await refreshCsrfTokenSilently()
    return data
  },
  async signup(payload) {
    const data = await request('/api/auth/signup', { method: 'POST', body: payload })
    csrfToken = null
    await refreshCsrfTokenSilently()
    return data
  },
  async logout() {
    const data = await request('/api/auth/logout', { method: 'POST' })
    csrfToken = null
    return data
  },
  getMe() {
    return request('/api/auth/me')
  },
  getStats() {
    return request('/api/stats')
  },
  getDashboard() {
    return request('/api/dashboard')
  },
  getRestaurants() {
    return request('/api/restaurants')
  },
  getAdminRestaurants() {
    return request('/api/admin/restaurants')
  },
  getRestaurant(id) {
    return request(`/api/admin/restaurants/${id}`)
  },
  createRestaurant(payload) {
    return request('/api/admin/restaurants', { method: 'POST', body: payload })
  },
  updateRestaurant(id, payload) {
    return request(`/api/admin/restaurants/${id}`, { method: 'PUT', body: payload })
  },
  deleteRestaurant(id) {
    return request(`/api/admin/restaurants/${id}`, { method: 'DELETE' })
  },
  getAdminUsers() {
    return request('/api/admin/users')
  },
  getAdminPlatform() {
    return request('/api/admin/platform')
  },
  getAdminSettings() {
    return request('/api/admin/settings')
  },
  updateAdminSettings(toggles) {
    return request('/api/admin/settings', { method: 'PATCH', body: toggles })
  },
  getRestaurantSettings() {
    return request('/api/restaurant/settings')
  },
  updateRestaurantSettings(settings) {
    return request('/api/restaurant/settings', { method: 'PATCH', body: settings })
  },
  setUserSuspended(id, suspended) {
    return request(`/api/admin/users/${id}/status`, { method: 'PATCH', body: { suspended } })
  },
  getRestaurantMenu() {
    return request('/api/restaurant/menu')
  },
  addMenuItem(payload) {
    return request('/api/restaurant/menu', { method: 'POST', body: payload })
  },
  updateMenuItem(id, payload) {
    return request(`/api/restaurant/menu/${id}`, { method: 'PUT', body: payload })
  },
  deleteMenuItem(id) {
    return request(`/api/restaurant/menu/${id}`, { method: 'DELETE' })
  },
  getRestaurantStaff() {
    return request('/api/restaurant/staff')
  },
  addStaffMember(payload) {
    return request('/api/restaurant/staff', { method: 'POST', body: payload })
  },
  updateStaffMember(id, payload) {
    return request(`/api/restaurant/staff/${id}`, { method: 'PUT', body: payload })
  },
  deleteStaffMember(id) {
    return request(`/api/restaurant/staff/${id}`, { method: 'DELETE' })
  },
}

export { ApiError }
