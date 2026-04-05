import { CORS_ALLOWED_ORIGINS, IS_PRODUCTION } from '../config/env.js'
import { sendJson } from '../lib/http.js'

function isPrivateIpv4(hostname) {
  const parts = hostname.split('.').map((part) => Number.parseInt(part, 10))

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

function isLocalDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin)
    const hostname = url.hostname.toLowerCase()

    return (
      hostname === 'localhost' ||
      hostname === '::1' ||
      isPrivateIpv4(hostname) ||
      hostname.startsWith('fd') ||
      hostname.startsWith('fc')
    )
  } catch {
    return false
  }
}

function isAllowedOrigin(origin) {
  if (!IS_PRODUCTION) {
    return true
  }

  return CORS_ALLOWED_ORIGINS.includes(origin) || isLocalDevelopmentOrigin(origin)
}

export function applyCors(req, res, next) {
  const origin = req.get('origin')

  if (origin) {
    if (!isAllowedOrigin(origin)) {
      sendJson(res, 403, { message: 'Origin not allowed.' })
      return
    }

    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  next()
}
