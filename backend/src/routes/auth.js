import { randomUUID } from 'node:crypto'
import { signToken, verifyToken, getTokenFromRequest } from '../lib/jwt.js'
import { parseBody, sendJson } from '../lib/http.js'
import {
  createCustomerProfile,
  getPasswordValidationMessage,
  hashPassword,
  isBcryptHash,
  buildCustomerLoginId,
  sanitizeUser,
  validatePasswordStrength,
  verifyPassword,
} from '../store/index.js'
import db from '../services/database.js'

export async function handleAuthRoutes({ req, res, pathname }) {
  if (pathname === '/api/auth/csrf-token' && req.method === 'GET') {
    sendJson(res, 200, { csrfToken: 'disabled' }, { request: req })
    return true
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req)
    const identifier = String(body.identifier ?? '').trim()
    const password = String(body.password ?? '')

    if (!identifier || !password) {
      sendJson(res, 400, { message: 'Identifier and password are required.' }, { request: req })
      return true
    }

    let user = null
    if (identifier.includes('@')) {
      user = await db.getUserByEmail(identifier)
    } else {
      user = await db.getUserByLoginId(identifier)
    }

    const passwordValid = user ? await verifyPassword(password, user.password_hash) : false

    if (!user || !passwordValid) {
      sendJson(res, 401, { message: 'Invalid login ID, email, or password.' }, { request: req })
      return true
    }

    if (!isBcryptHash(user.password_hash)) {
      const newHash = await hashPassword(password)
      await db.updateUser(user.id, { password_hash: newHash })
      user.password_hash = newHash
    }

    const token = signToken(user.id)
    sendJson(res, 200, { token, user: sanitizeUser(user) })
    return true
  }

  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    const body = await parseBody(req)
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const phone = String(body.phone ?? '').trim()
    const password = String(body.password ?? '')

    if (!name || !email || !password) {
      sendJson(res, 400, { message: 'Name, email, and password are required.' }, { request: req })
      return true
    }

    const passwordError = validatePasswordStrength(password)
    if (passwordError) {
      sendJson(res, 400, { message: getPasswordValidationMessage() }, { request: req })
      return true
    }

    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      sendJson(res, 409, { message: 'An account already exists with this email.' }, { request: req })
      return true
    }

    const allUsers = await db.getAllUsers()
    const loginId = buildCustomerLoginId({ users: allUsers })

    const userId = randomUUID()
    const user = {
      id: userId,
      role: 'customer',
      name,
      email,
      phone,
      login_id: loginId,
      password_hash: await hashPassword(password),
    }

    const createdUser = await db.createUser(user)
    const profileData = createCustomerProfile({ userId })
    await db.createCustomerProfile({ ...profileData, user_id: userId })

    const token = signToken(createdUser.id)
    sendJson(res, 201, { token, user: sanitizeUser(createdUser) })
    return true
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const token = getTokenFromRequest(req)
    if (!token) {
      sendJson(res, 401, { message: 'Not authenticated.' }, { request: req })
      return true
    }

    const payload = verifyToken(token)
    if (!payload) {
      sendJson(res, 401, { message: 'Invalid or expired token.' }, { request: req })
      return true
    }

    try {
      const user = await db.getUserById(payload.userId)
      if (!user) {
        sendJson(res, 401, { message: 'User not found.' }, { request: req })
        return true
      }
      sendJson(res, 200, { user: sanitizeUser(user) }, { request: req })
    } catch (error) {
      console.error('Auth me error:', error)
      sendJson(res, 500, { message: 'Authentication error.' }, { request: req })
    }
    return true
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    // JWT is stateless — client just drops the token
    sendJson(res, 200, { message: 'Signed out successfully.' })
    return true
  }

  return false
}
