const TOKEN_KEY = 'ayoz_token'

function resolveApiBase() {
  const configuredBase = import.meta.env.VITE_API_URL || ''
  return configuredBase.replace(/\/$/, '')
}

const apiBase = resolveApiBase()

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
}

export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

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
    { cause: error instanceof Error ? error.message : String(error ?? '') },
  )
}

async function request(path, { method = 'GET', body } = {}) {
  const normalizedMethod = method.toUpperCase()
  const headers = {}

  if (body) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: normalizedMethod,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw createNetworkError(error)
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (response.ok) return data

  throw new ApiError(
    data?.message || 'Something went wrong while talking to the server.',
    response.status,
    data,
  )
}

export const api = {
  async login(payload) {
    const data = await request('/api/auth/login', { method: 'POST', body: payload })
    if (data?.token) setToken(data.token)
    return data
  },
  async signup(payload) {
    const data = await request('/api/auth/signup', { method: 'POST', body: payload })
    if (data?.token) setToken(data.token)
    return data
  },
  async logout() {
    clearToken()
    return { message: 'Signed out successfully.' }
  },
  getMe() { return request('/api/auth/me') },
  getStats() { return request('/api/stats') },
  getDashboard() { return request('/api/dashboard') },
  getRestaurants() { return request('/api/restaurants') },
  getAdminRestaurants() { return request('/api/admin/restaurants') },
  getRestaurant(id) { return request(`/api/admin/restaurants/${id}`) },
  createRestaurant(payload) { return request('/api/admin/restaurants', { method: 'POST', body: payload }) },
  updateRestaurant(id, payload) { return request(`/api/admin/restaurants/${id}`, { method: 'PUT', body: payload }) },
  deleteRestaurant(id) { return request(`/api/admin/restaurants/${id}`, { method: 'DELETE' }) },
  getAdminUsers() { return request('/api/admin/users') },
  getAdminPlatform() { return request('/api/admin/platform') },
  getAdminSettings() { return request('/api/admin/settings') },
  updateAdminSettings(toggles) { return request('/api/admin/settings', { method: 'PATCH', body: toggles }) },
  getRestaurantSettings() { return request('/api/restaurant/settings') },
  updateRestaurantSettings(settings) { return request('/api/restaurant/settings', { method: 'PATCH', body: settings }) },
  setUserSuspended(id, suspended) { return request(`/api/admin/users/${id}/status`, { method: 'PATCH', body: { suspended } }) },
  getRestaurantMenu() { return request('/api/restaurant/menu') },
  addMenuItem(payload) { return request('/api/restaurant/menu', { method: 'POST', body: payload }) },
  updateMenuItem(id, payload) { return request(`/api/restaurant/menu/${id}`, { method: 'PUT', body: payload }) },
  deleteMenuItem(id) { return request(`/api/restaurant/menu/${id}`, { method: 'DELETE' }) },
  getRestaurantStaff() { return request('/api/restaurant/staff') },
  addStaffMember(payload) { return request('/api/restaurant/staff', { method: 'POST', body: payload }) },
  updateStaffMember(id, payload) { return request(`/api/restaurant/staff/${id}`, { method: 'PUT', body: payload }) },
  deleteStaffMember(id) { return request(`/api/restaurant/staff/${id}`, { method: 'DELETE' }) },
}

export { ApiError }
