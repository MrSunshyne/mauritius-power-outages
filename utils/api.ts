const API_BASE = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/'

export const API_URLS = {
  full: `${API_BASE}power-outages.json`,
  latest: `${API_BASE}power-outages.latest.json`,
  daily: (date: string) => `${API_BASE}daily/${date}.json`,
  localitiesIndex: `${API_BASE}localities/index.json`,
  locality: (slug: string) => `${API_BASE}localities/${slug}.json`,
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await $fetch<string>(url)
  return typeof response === 'string' ? JSON.parse(response) : response
}
