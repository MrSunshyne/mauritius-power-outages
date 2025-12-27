/**
 * Umami Analytics Event Names
 *
 * All trackable events are defined here for consistency and easy maintenance.
 * Usage: data-umami-event="event-name" or umami.track('event-name')
 */

export const ANALYTICS_EVENTS = {
  // Navigation
  NAV_PREV: 'nav-prev',
  NAV_TODAY: 'nav-today',
  NAV_NEXT: 'nav-next',
  NAV_HOME_FROM_OUTAGE: 'nav-home-from-outage',

  // Outage interactions
  OUTAGE_VIEW_DETAIL: 'outage-view-detail',
  OUTAGE_SHARE: 'outage-share',
  OUTAGE_SAVE_CALENDAR: 'outage-save-calendar',
  OUTAGE_SAVE_GOOGLE_CALENDAR: 'outage-save-google-calendar',
  OUTAGE_VIEW_CURRENT: 'outage-view-current',

  // Footer links
  FOOTER_STATISTICS: 'footer-statistics',
  FOOTER_DATA_SOURCE: 'footer-data-source',
  FOOTER_AUTHOR: 'footer-author',
  FOOTER_SOURCE_CODE: 'footer-source-code',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
