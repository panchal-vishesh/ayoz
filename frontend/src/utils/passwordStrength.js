const PASSWORD_RULES = [
  {
    id: 'length',
    label: '8+ characters',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'Lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'Number',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'Special character',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
]

const PASSWORD_MESSAGE =
  'Use at least 8 characters with uppercase, lowercase, number, and special character.'

export function getPasswordValidationMessage() {
  return PASSWORD_MESSAGE
}

export function getPasswordChecks(password) {
  const value = String(password ?? '')

  return PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(value),
  }))
}

export function getPasswordStrength(password) {
  const checks = getPasswordChecks(password)
  const score = checks.filter((check) => check.met).length
  const isStrong = score === checks.length
  let label = 'Add a stronger password'
  let tone = 'slate'

  if (isStrong) {
    label = 'Strong password'
    tone = 'green'
  } else if (score >= 4) {
    label = 'Almost ready'
    tone = 'blue'
  } else if (score >= 2) {
    label = 'Needs more strength'
    tone = 'amber'
  } else if (score >= 1) {
    label = 'Weak password'
    tone = 'rose'
  }

  return {
    checks,
    score,
    isStrong,
    label,
    tone,
  }
}
