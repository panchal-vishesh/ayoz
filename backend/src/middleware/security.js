import csrf from 'csurf'
import rateLimit from 'express-rate-limit'
import { sendJson } from '../lib/http.js'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

function createJsonRateLimiter({ max, message }) {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res) {
      sendJson(res, 429, { message })
    },
  })
}

export const authRateLimiter = createJsonRateLimiter({
  max: 100,
  message: 'Too many authentication requests. Please try again in 15 minutes.',
})

export const loginRateLimiter = createJsonRateLimiter({
  max: 10,
  message: 'Too many login attempts. Please try again in 15 minutes.',
})
