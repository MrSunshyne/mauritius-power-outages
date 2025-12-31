import { format } from 'date-fns'

export const MAURITIUS_TIMEZONE_OFFSET_MS = 4 * 60 * 60 * 1000

export function formatLocalTime(utcTimeStr: string): string {
  const utcDate = new Date(utcTimeStr)
  const mauritiusTime = new Date(utcDate.getTime() + MAURITIUS_TIMEZONE_OFFSET_MS)
  return mauritiusTime.toISOString().slice(11, 16)
}

export function formatMauritiusDate(utcTimeStr: string): string {
  const utcDate = new Date(utcTimeStr)
  const mauritiusDate = new Date(utcDate.getTime() + MAURITIUS_TIMEZONE_OFFSET_MS)
  return format(mauritiusDate, 'EEEE, MMMM d, yyyy')
}

export function formatMauritiusDateTime(utcTimeStr: string): string {
  const utcDate = new Date(utcTimeStr)
  const mauritiusDate = new Date(utcDate.getTime() + MAURITIUS_TIMEZONE_OFFSET_MS)
  return format(mauritiusDate, 'EEE, MMM d, yyyy')
}

export function formatMauritiusDateShort(utcTimeStr: string): string {
  const utcDate = new Date(utcTimeStr)
  const mauritiusDate = new Date(utcDate.getTime() + MAURITIUS_TIMEZONE_OFFSET_MS)
  return format(mauritiusDate, 'yyyy-MM-dd')
}
