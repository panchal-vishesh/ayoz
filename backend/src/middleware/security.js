import csrf from 'csurf'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import {
  IS_PRODUCTION,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_SECRET,
  SESSION_TTL_MS,
} from '../config/env.js'
import { sendJson } from '../lib/http.js'
import { SupabaseSessionStore } from '../lib/sessionStore.js'

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

export const csrfProtection = csrf({
  value: (req) =>
    req.get('x-csrf-token') ||
    req.get('csrf-token') ||
    req.body?._csrf ||
    '',
})

export function createSessionMiddleware() {
  return session({
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: IS_PRODUCTION,
    unset: 'destroy',
    cookie: { ...SESSION_COOKIE_OPTIONS },
    store: new SupabaseSessionStore({
      ttl: Math.floor(SESSION_TTL_MS / 1000),
    }),
  })
}
