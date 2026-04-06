function resolveApiBase() {
  const configuredBase = import.meta.env.VITE_API_URL || ''
  return configuredBase.replace(/\/$/, '')
}

async function fetchWithFallback(path, options) {
  return fetch(`${apiBase}${path}`, options)
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
