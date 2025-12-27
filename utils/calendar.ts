/**
 * Calendar utilities for generating ICS files and calendar links
 */

export interface CalendarEvent {
  title: string
  description: string
  location: string
  startTime: Date
  endTime: Date
  url?: string
}

/**
 * Format date to ICS format (YYYYMMDDTHHMMSS)
 */
function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

/**
 * Generate ICS file content
 */
export function generateICS(event: CalendarEvent): string {
  const now = new Date()
  const uid = `${formatICSDate(now)}-${Math.random().toString(36).substring(2, 9)}@power-outages-mauritius`

  // Escape special characters in text fields
  const escapeText = (text: string) =>
    text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Power Outages Mauritius//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(event.startTime)}`,
    `DTEND:${formatICSDate(event.endTime)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
  ]

  if (event.url) {
    lines.push(`URL:${event.url}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

/**
 * Download ICS file
 */
export function downloadICS(event: CalendarEvent, filename: string = 'power-outage.ics'): void {
  const icsContent = generateICS(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const formatGoogleDate = (date: Date) => formatICSDate(date).replace(/[-:]/g, '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.startTime)}/${formatGoogleDate(event.endTime)}`,
    details: event.description,
    location: event.location,
  })

  if (event.url) {
    params.set('details', `${event.description}\n\nMore info: ${event.url}`)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
