const API_ENDPOINT = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json'
const API_ENDPOINT_LATEST = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.latest.json'

export async function fetchJson(url = API_ENDPOINT) {
  try {
    const response = await fetch(url)
    return response.json()
  }
  catch (error) {
    throw new Error(`Error fetching JSON: ${error}`)
  }
}

export async function fetchLatestJson() {
  return fetchJson(API_ENDPOINT_LATEST)
}

export async function fetchFullJson() {
  return fetchJson(API_ENDPOINT)
}
