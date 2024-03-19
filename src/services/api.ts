const API_ENDPOINT = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json'

export async function fetchJson(url = API_ENDPOINT) {
  try {
    const response = await fetch(url)
    return response.json()
  }
  catch (error) {
    throw new Error(`Error fetching JSON: ${error}`)
  }
}
