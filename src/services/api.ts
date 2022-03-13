const API_ENDPOINT = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json'

export async function fetchJson(url = API_ENDPOINT) {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.log(error)
    // const isJsonError =
    //   error.message.includes('Unexpected token') &&
    //   error.message.includes('in JSON at position')

    // if (isJsonError) {
    //   return null
    // }

  }
}