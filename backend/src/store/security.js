import { scryptSync, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcrypt'

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$/
const SALT_ROUNDS = 12
const PASSWORD_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'

export function getPasswordChecks(password) {
  const value = String(password ?? '')

  return [
    {
      id: 'length',
      label: '8+ characters',
      met: value.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'Uppercase letter',
      met: /[A-Z]/.test(value),
    },
    {
      id: 'lowercase',
      label: 'Lowercase letter',
      met: /[a-z]/.test(value),
    },
    {
      id: 'number',
      label: 'Number',
      met: /\d/.test(value),
    },
    {
      id: 'symbol',
      label: 'Special character',
      met: /[^A-Za-z0-9]/.test(value),
    },
  ]
}

export function isStrongPassword(password) {
  return getPasswordChecks(password).every((check) => check.met)
}

export function getPasswordValidationMessage() {
  return PASSWORD_MESSAGE
}

export function validatePasswordStrength(password) {
  return isStrongPassword(password) ? '' : PASSWORD_MESSAGE
}

export async function hashPassword(password) {
  return bcrypt.hash(String(password ?? ''), SALT_ROUNDS)
}

export function isBcryptHash(storedHash) {
  return BCRYPT_HASH_PATTERN.test(String(storedHash ?? ''))
}

export async function verifyPassword(password, storedHash) {
  const safeHash = String(storedHash ?? '')

  if (!safeHash) {
    return false
  }

  if (isBcryptHash(safeHash)) {
    return bcrypt.compare(String(password ?? ''), safeHash)
  }

  return verifyLegacyScryptHash(password, safeHash)
}

function verifyLegacyScryptHash(password, storedHash) {
  const [salt, savedHash] = String(storedHash ?? '').split(':')

  if (!salt || !savedHash) {
    return false
  }

  const attempt = scryptSync(String(password ?? ''), salt, 64)
  const saved = Buffer.from(savedHash, 'hex')

  if (attempt.length !== saved.length) {
    return false
  }

  return timingSafeEqual(attempt, saved)
}
