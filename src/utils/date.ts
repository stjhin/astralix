import { themeConfig } from '@/config'
import type { DateFormat } from '@/types'

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const VALID_SEPARATORS = ['.', '-', '/']

/**
 * Format a date using its UTC components.
 * pubDate strings like '2026-07-25' are stored as UTC midnight, so we
 * use getUTC* to always display the date as written, regardless of timezone.
 */
export function formatDate(date: Date, format?: string): string {
  const formatStr = (format || themeConfig.date.dateFormat).trim()
  const configSeparator = themeConfig.date.dateSeparator || '-'

  const separator = VALID_SEPARATORS.includes(configSeparator.trim()) ? configSeparator.trim() : '.'

  // Use UTC date components — pubDate strings like '2026-07-25' are stored
  // as UTC midnight, and the user's intent is the date as written.
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const monthName = MONTHS_EN[month - 1]

  const pad = (num: number) => String(num).padStart(2, '0')

  switch (formatStr) {
    case 'YYYY-MM-DD':
      return `${year}${separator}${pad(month)}${separator}${pad(day)}`

    case 'MM-DD-YYYY':
      return `${pad(month)}${separator}${pad(day)}${separator}${year}`

    case 'DD-MM-YYYY':
      return `${pad(day)}${separator}${pad(month)}${separator}${year}`

    case 'MONTH DAY YYYY':
      return `<span class="month">${monthName}</span> ${day} ${year}`

    case 'DAY MONTH YYYY':
      return `${day} <span class="month">${monthName}</span> ${year}`

    default:
      return `${year}${separator}${pad(month)}${separator}${pad(day)}`
  }
}

/**
 * Check if a post's pubDate is in the future relative to the configured timezone.
 * Returns true if the post should be hidden (scheduled for later).
 */
export function isFuturePost(pubDate: Date): boolean {
  const tz = themeConfig.date.timezone || 'UTC'
  const now = new Date()
  const nowInTz = new Date(now.toLocaleString('en-US', { timeZone: tz }))
  const todayStart = new Date(nowInTz.getFullYear(), nowInTz.getMonth(), nowInTz.getDate())
  return pubDate.getTime() > todayStart.getTime()
}

export const SUPPORTED_DATE_FORMATS: readonly DateFormat[] = [
  'YYYY-MM-DD',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
  'MONTH DAY YYYY',
  'DAY MONTH YYYY'
] as const
