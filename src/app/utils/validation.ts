export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean)

  return parts.join('-')
}

export function getPhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function isValidPhoneNumber(value: string) {
  return getPhoneDigits(value).length === 10
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
