export const getCovidData = () => {
  // eslint-disable-next-line no-console
  return fetch('https://pomber.github.io/covid19/timeseries.json')
    .then(response => response.json())
}
