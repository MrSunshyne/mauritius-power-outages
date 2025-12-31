import { addDays, format, setHours, setMinutes, startOfDay } from 'date-fns'
import { District, type Record } from '~/types'
import { generateSlug } from './slug'
import { formatLocalTime } from './datetime'

/**
 * Generates mock outage data for development/testing purposes.
 * This provides realistic sample data for today and tomorrow.
 */

function generateId(date: Date, index: number): string {
  const dateStr = format(date, 'yyyy-MM-dd')
  return `mock-${dateStr}-${index}`
}

function createOutage(
  date: Date,
  startHour: number,
  endHour: number,
  district: District,
  locality: string,
  streets: string,
  index: number
): Record {
  const baseDate = startOfDay(date)
  const fromDate = setMinutes(setHours(baseDate, startHour), 0)
  const toDate = setMinutes(setHours(baseDate, endHour), 0)

  return {
    id: generateId(date, index),
    date: format(date, 'yyyy-MM-dd'),
    district,
    locality,
    localitySlug: generateSlug(locality),
    streets,
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  }
}

export function generateMockOutages(): { today: Record[]; future: Record[] } {
  const now = new Date()
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const currentHour = now.getHours()

  const todayOutages: Record[] = []
  const tomorrowOutages: Record[] = []

  // Today's outages - mix of past, ongoing, and upcoming
  // Past outage (already finished)
  if (currentHour > 10) {
    todayOutages.push(
      createOutage(
        today,
        8,
        10,
        District.portlouis,
        'Port Louis',
        'Rue Royale, Rue La Corderie, Rue Desforges',
        1
      )
    )
  }

  // Ongoing outage (happening now) - only if current time is within window
  if (currentHour >= 9 && currentHour < 17) {
    todayOutages.push(
      createOutage(
        today,
        currentHour - 1,
        currentHour + 2,
        District.plainewilhems,
        'Curepipe',
        'Royal Road, Avenue Victoria, Rue Pope Hennessy, Impasse des Lilas',
        2
      )
    )
  }

  // Upcoming outage today (in a few hours)
  if (currentHour < 20) {
    const upcomingStart = Math.max(currentHour + 2, 14)
    todayOutages.push(
      createOutage(
        today,
        upcomingStart,
        upcomingStart + 3,
        District.moka,
        'Moka',
        'Avenue Belle Rose, Rue Gustave Colin, Cite EDC',
        3
      )
    )
  }

  // Another upcoming outage today
  if (currentHour < 18) {
    const upcomingStart = Math.max(currentHour + 4, 16)
    todayOutages.push(
      createOutage(
        today,
        upcomingStart,
        upcomingStart + 2,
        District.flacq,
        'Centre de Flacq',
        'Rue Centrale, Avenue de la Gare, Impasse des Bambous',
        4
      )
    )
  }

  // Tomorrow's outages - variety of districts and times
  tomorrowOutages.push(
    createOutage(
      tomorrow,
      9,
      12,
      District.pamplemousses,
      'Pamplemousses',
      'Route Royale, Rue des Jardins, Avenue SSR',
      1
    ),
    createOutage(
      tomorrow,
      10,
      14,
      District.grandport,
      'Mahebourg',
      'Rue des Hollandais, Rue de la Passe, Waterfront Road',
      2
    ),
    createOutage(
      tomorrow,
      13,
      16,
      District.blackriver,
      'Tamarin',
      'Coastal Road, Avenue des Salines, Rue Manioc',
      3
    ),
    createOutage(
      tomorrow,
      15,
      18,
      District.savanne,
      'Souillac',
      'Route Royale, Rue du Port, Avenue Telfair',
      4
    ),
    createOutage(
      tomorrow,
      8,
      11,
      District.rivieredurempart,
      'Goodlands',
      'Rue Paul et Virginie, Avenue Antelme, Impasse Desroches',
      5
    )
  )

  return {
    today: todayOutages,
    future: tomorrowOutages,
  }
}

/**
 * Checks if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Checks if mock data is enabled via runtime config
 */
export function isMockDataEnabled(): boolean {
  const config = useRuntimeConfig()
  const isEnabled = config.public.enableMockData
  return isEnabled
}

/**
 * Merges mock data with real data, adding mock entries only in development
 */
export function mergeWithMockData(
  realData: { today: Record[]; future: Record[] } | null
): { today: Record[]; future: Record[] } {
  const devMode = isDevelopment()
  const mockEnabled = isMockDataEnabled()
  
  if (!devMode || !mockEnabled) {
    return realData || { today: [], future: [] }
  }

  const mockData = generateMockOutages()

  if (!realData) {
    return mockData
  }

  return {
    today: [...mockData.today, ...realData.today],
    future: [...mockData.future, ...realData.future],
  }
}
