import type { Record } from '~/types'

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Get the locality slug from a record, using the pre-generated slug if available
 */
export function getLocalitySlug(record: Record): string {
  return record.localitySlug || generateSlug(record.locality)
}
