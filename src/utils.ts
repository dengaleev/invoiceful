export function formatAmount(n: number, currency: string, locale: string): string {
  return `${currency}${n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatDate(iso: string, locale: string, fallback = ''): string {
  if (!iso) return fallback
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale)
}
