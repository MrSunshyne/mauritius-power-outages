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
  OUTAGE_SHARE_WHATSAPP: 'outage-share-whatsapp',
  OUTAGE_SAVE_CALENDAR: 'outage-save-calendar',
  OUTAGE_SAVE_GOOGLE_CALENDAR: 'outage-save-google-calendar',
  OUTAGE_VIEW_CURRENT: 'outage-view-current',

  // Locality interactions
  LOCALITY_VIEW: 'locality-view',
  LOCALITY_PAGE_VIEW: 'locality-page-view',

  // Heatmap
  HEATMAP_CELL_CLICK: 'heatmap-cell-click',

  // Page views
  STATS_PAGE_VIEW: 'stats-page-view',

  // Header
  HEADER_HOME_CLICK: 'header-home-click',

  // Hero
  HERO_CTA_CLICK: 'hero-cta-click',

  // Error
  ERROR_GO_HOME: 'error-go-home',

  // Footer links
  FOOTER_STATISTICS: 'footer-statistics',
  FOOTER_DATA_SOURCE: 'footer-data-source',
  FOOTER_AUTHOR: 'footer-author',
  FOOTER_SOURCE_CODE: 'footer-source-code',

  // PWA Events
  PWA_INSTALL_PROMPT_SHOWN: 'pwa-install-prompt-shown',
  PWA_INSTALL_CLICK: 'pwa-install-click',
  PWA_INSTALLED: 'pwa-installed',
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
  PWA_UPDATE_AVAILABLE: 'pwa-update-available',
  PWA_UPDATE_ACCEPTED: 'pwa-update-accepted',
  PWA_UPDATE_DISMISSED: 'pwa-update-dismissed',
  PWA_FORCE_UPDATE_TRIGGERED: 'pwa-force-update-triggered',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
