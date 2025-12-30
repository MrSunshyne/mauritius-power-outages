const API_BASE = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/'

export const API_URLS = {
  full: `${API_BASE}power-outages.json`,
  latest: `${API_BASE}power-outages.latest.json`,
  daily: (date: string) => `${API_BASE}daily/${date}.json`, // YYYY-MM-DD format
}
