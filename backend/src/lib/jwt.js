import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const auth = req.get('Authorization') ?? ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}
