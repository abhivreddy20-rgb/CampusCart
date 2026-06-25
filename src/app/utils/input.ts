export function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

export function normalizeText(value: string, maxLength = 500) {
  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export function normalizeOptionalText(value: string, maxLength = 500) {
  const normalized = normalizeText(value, maxLength)
  return normalized || null
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 10)
}
