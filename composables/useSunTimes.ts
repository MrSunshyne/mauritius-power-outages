import { format } from 'date-fns'
import { MAURITIUS_TIMEZONE_OFFSET_MS } from '~/utils/datetime'

interface SunTimesResult {
  sunrise: string
  sunset: string
  first_light: string
  last_light: string
  dawn: string
  dusk: string
  golden_hour: string
  day_length: string
  solar_noon: string
  timezone: string
}

interface SunTimesResponse {
  results: SunTimesResult
  status: string
}

export interface SunTimes {
  sunrise: number // Hour in decimal (e.g., 6.25 for 6:15 AM)
  sunset: number  // Hour in decimal (e.g., 18.5 for 6:30 PM)
  sunriseFormatted: string
  sunsetFormatted: string
  goldenHour: string
  dayLength: string
}

// Mauritius coordinates
const MAURITIUS_LAT = -20.3484
const MAURITIUS_LNG = 57.5522
const MAURITIUS_TIMEZONE = 'Indian/Mauritius'

// Default values (fallback)
const DEFAULT_SUNRISE = 6
const DEFAULT_SUNSET = 18

// Cache for sun times by date
const sunTimesCache = new Map<string, SunTimes>()

/**
 * Parse time string from API (e.g., "6:15:30 AM") to decimal hours
 */
function parseTimeToHours(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) {
    console.warn(`Failed to parse time string: ${timeStr}`)
    return 0
  }

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const seconds = parseInt(match[3], 10)
  const period = match[4].toUpperCase()

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }

  return hours + minutes / 60 + seconds / 3600
}

/**
 * Format decimal hours to readable time (e.g., 6.25 -> "6:15 AM")
 */
function formatHoursToTime(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`
}

/**
 * Fetch sun times for a specific date in Mauritius
 */
export async function fetchSunTimes(date: Date | string): Promise<SunTimes> {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const dateStr = format(dateObj, 'yyyy-MM-dd')

  // Check cache first
  if (sunTimesCache.has(dateStr)) {
    return sunTimesCache.get(dateStr)!
  }

  try {
    const url = new URL('https://api.sunrisesunset.io/json')
    url.searchParams.set('lat', MAURITIUS_LAT.toString())
    url.searchParams.set('lng', MAURITIUS_LNG.toString())
    url.searchParams.set('timezone', MAURITIUS_TIMEZONE)
    url.searchParams.set('date', dateStr)

    const response = await $fetch<SunTimesResponse>(url.toString())

    if (response.status !== 'OK') {
      throw new Error(`API returned status: ${response.status}`)
    }

    const result = response.results
    const sunTimes: SunTimes = {
      sunrise: parseTimeToHours(result.sunrise),
      sunset: parseTimeToHours(result.sunset),
      sunriseFormatted: result.sunrise,
      sunsetFormatted: result.sunset,
      goldenHour: result.golden_hour,
      dayLength: result.day_length,
    }

    // Cache the result
    sunTimesCache.set(dateStr, sunTimes)

    return sunTimes
  } catch (error) {
    console.error('Failed to fetch sun times:', error)
    
    // Return defaults on error
    return {
      sunrise: DEFAULT_SUNRISE,
      sunset: DEFAULT_SUNSET,
      sunriseFormatted: formatHoursToTime(DEFAULT_SUNRISE),
      sunsetFormatted: formatHoursToTime(DEFAULT_SUNSET),
      goldenHour: '',
      dayLength: '',
    }
  }
}

/**
 * Composable for reactive sun times
 */
export function useSunTimes(date: Ref<Date | string> | Date | string) {
  const sunTimes = ref<SunTimes>({
    sunrise: DEFAULT_SUNRISE,
    sunset: DEFAULT_SUNSET,
    sunriseFormatted: formatHoursToTime(DEFAULT_SUNRISE),
    sunsetFormatted: formatHoursToTime(DEFAULT_SUNSET),
    goldenHour: '',
    dayLength: '',
  })
  
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const load = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const dateValue = isRef(date) ? date.value : date
      sunTimes.value = await fetchSunTimes(dateValue)
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  }

  // Watch for date changes if it's a ref
  if (isRef(date)) {
    watch(date, load, { immediate: true })
  } else {
    // Load immediately for static date
    load()
  }

  return {
    sunTimes,
    isLoading,
    error,
    refresh: load,
  }
}
