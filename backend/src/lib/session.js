import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_TTL_MS,
} from '../config/env.js'

function clearCookieOptions() {
  return {
    path: SESSION_COOKIE_OPTIONS.path,
    httpOnly: SESSION_COOKIE_OPTIONS.httpOnly,
    sameSite: SESSION_COOKIE_OPTIONS.sameSite,
    secure: SESSION_COOKIE_OPTIONS.secure,
  }
}

export function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export function saveSession(req) {
  req.session.cookie.maxAge = SESSION_TTL_MS

  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

export function destroySession(req, res) {
  return new Promise((resolve, reject) => {
    if (!req.session) {
      res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions())
      resolve()
      return
    }

    req.session.destroy((error) => {
      if (error) {
        reject(error)
        return
      }

      res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions())
      resolve()
    })
  })
}

export function getSessionExpiresAt(req) {
  const ttl = Number(req.session?.cookie?.maxAge ?? SESSION_TTL_MS)
  return new Date(Date.now() + ttl).toISOString()
}
