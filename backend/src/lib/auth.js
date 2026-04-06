import db from '../services/database.js'
import { getTokenFromRequest, verifyToken } from '../lib/jwt.js'

export function getIdentifierMatch(store, identifier) {
  const trimmed = String(identifier ?? '').trim()
  const emailNeedle = trimmed.toLowerCase()
  const loginNeedle = trimmed.toUpperCase()

  return store.users.find(
    (user) =>
      user.email?.toLowerCase() === emailNeedle ||
      user.login_id?.toUpperCase() === loginNeedle,
  )
}

export async function getAuthContext(req, allowedRoles = null) {
  const token = getTokenFromRequest(req)
  if (!token) return { error: 'Authentication required', statusCode: 401 }

  const payload = verifyToken(token)
  if (!payload) return { error: 'Invalid or expired token', statusCode: 401 }

  try {
    const user = await db.getUserById(payload.userId)
    if (!user) return { error: 'Authentication required', statusCode: 401 }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { error: 'You do not have access to this action', statusCode: 403 }
    }

    return { user }
  } catch (error) {
    console.error('Auth context error:', error)
    return { error: 'Authentication error', statusCode: 500 }
  }
}
