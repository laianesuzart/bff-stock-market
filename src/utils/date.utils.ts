export function normalizeDate({
  date,
  endOfDay,
}: {
  date: string | Date
  endOfDay: boolean
}) {
  const newDate = new Date(date)
  endOfDay
    ? newDate.setUTCHours(23, 59, 59, 59)
    : newDate.setUTCHours(0, 0, 0, 0)
  return newDate
}

export function calculateRange(startDate: Date): string {
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 5) return '5d'
  if (diffDays <= 30) return '1mo'
  if (diffDays <= 90) return '3mo'
  if (diffDays <= 180) return '6mo'
  if (diffDays <= 365) return '1y'
  if (diffDays <= 730) return '2y'
  if (diffDays <= 1825) return '5y'

  return 'max'
}
