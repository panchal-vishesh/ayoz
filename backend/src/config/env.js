import 'dotenv/config'

const DEFAULT_SESSION_SECRET = 'change-me-in-production'
const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'https://ayoz.in']

function parseOrigins(value) {
  return String(value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export const PORT = Number(process.env.PORT ?? 4000)
export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'
export const SUPABASE_URL = process.env.SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
export const SESSION_SECRET = process.env.SESSION_SECRET ?? DEFAULT_SESSION_SECRET
export const SESSION_COOKIE_NAME = 'ayoz_session'
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24
export const CORS_ALLOWED_ORIGINS = parseOrigins(
  process.env.CORS_ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS.join(','),
)
export const SESSION_COOKIE_OPTIONS = Object.freeze({
  path: '/',
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'none' : 'lax',
  maxAge: SESSION_TTL_MS,
})

export function validateEnv() {
  const errors = []

  if (!SUPABASE_URL) {
    errors.push('SUPABASE_URL is required.')
  }

  if (!SUPABASE_ANON_KEY) {
    errors.push('SUPABASE_ANON_KEY is required.')
  }

  if (!SESSION_SECRET) {
    errors.push('SESSION_SECRET is required.')
  }

  if (IS_PRODUCTION && SESSION_SECRET === DEFAULT_SESSION_SECRET) {
    errors.push('SESSION_SECRET must be changed in production.')
  }

  if (IS_PRODUCTION && CORS_ALLOWED_ORIGINS.length === 0) {
    errors.push('CORS_ALLOWED_ORIGINS must include your frontend origin in production.')
  }

  if (errors.length) {
    throw new Error(errors.join(' '))
  }
}
