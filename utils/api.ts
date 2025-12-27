const API_ENDPOINT = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json'
const API_ENDPOINT_LATEST = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.latest.json'

export const API_URLS = {
  full: API_ENDPOINT,
  latest: API_ENDPOINT_LATEST,
}

export async function fetchJson(url = API_ENDPOINT) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error fetching JSON: ${response.statusText}`)
  }
  return response.json()
}

export async function fetchLatestJson() {
  return fetchJson(API_ENDPOINT_LATEST)
}

export async function fetchFullJson() {
  return fetchJson(API_ENDPOINT)
}
