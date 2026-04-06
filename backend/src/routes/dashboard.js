import { sendJson } from '../lib/http.js'
import { buildDashboard } from '../services/dashboard.js'
import { getAuthContext } from '../lib/auth.js'

export async function handleDashboardRoutes({ req, res, pathname }) {
  if (pathname !== '/api/dashboard' || req.method !== 'GET') return false

  try {
    const auth = await getAuthContext(req)
    if (auth.error) {
      sendJson(res, auth.statusCode, { message: auth.error }, { request: req })
      return true
    }

    const dashboard = await buildDashboard(req, auth.user)
    if (!dashboard) {
      sendJson(res, 401, { message: 'Not authenticated.' }, { request: req })
      return true
    }

    sendJson(res, 200, dashboard, { request: req })
    return true
  } catch (error) {
    console.error('Dashboard error:', error)
    sendJson(res, 500, { message: 'Failed to load dashboard' }, { request: req })
    return true
  }
}
