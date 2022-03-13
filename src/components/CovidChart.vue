<template>
  <div class="w-full">
    <div class="flex justify-between">
      <h1 class="text-xl font- mt-10">
        Covid Chart for
        <template v-if="loadingData">loading...</template>
        <template v-else>{{ selectedCountry }}</template>
      </h1>
      <button @click="clearChart()">Clear Chart</button>
    </div>
    <div v-if="series">
      <VueApexCharts
        width="100%"
        class="w-full"
        type="line"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>

    <div class="flex gap-2 flex-wrap">
      <div
        v-for="country in allCountries"
        :key="country"
        class="hover:bg-gray-400 p-1 cursor-pointer text-xs"
        :class="country === selectedCountry ? 'bg-gray-500' : ''"
        @click="selectedCountry = country"
      >{{ country }}</div>
    </div>
    <!-- <pre>
            {{ allCountries }}
    </pre>-->
    <!-- <pre>
            {{ variable }}
            {{ series }}
    </pre>-->
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Ref, ref, watch } from 'vue'
import { getCovidData } from '@/services/covid.api'

export interface CountryEntity {
  date: string
  confirmed: number
  deaths: number
  recovered: number
}

export interface CountryData {
  [key: string]: CountryEntity[]
}

interface Timeline {
  x: string
  y: number
}

interface Series {
  name: string
  data?: Timeline[]
}

const series = ref(null) as any
const allCountries = ref([]) as any
const selectedCountry = ref('Mauritius') as Ref<string>
const loadingData = ref(false) as Ref<Boolean>

const chartOptions: ApexOptions = reactive({
  chart: {},

  noData: {
    text: 'No Data available',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: '#000000',
      fontSize: '14px',
    },
  },
})

function fetchData() {
  getCovidData(selectedCountry.value).then((data) => {
    populateCountriesList(data)
    buildChart(data, selectedCountry.value)
  })
}

function pickCountry(countries: any, countryName: string) {
  const country = countries[countryName]
  return country
}

function populateCountriesList(countries: any) {
  const countryNames = Object.keys(countries)
  allCountries.value = countryNames
}

function buildSeries(data: CountryEntity[]) {
  const series: Series[] = []
  const confirmed: Timeline[] = []
  const deaths: Timeline[] = []
  const recovered: Timeline[] = []

  for (let index = 0; index < data.length; index++) {
    const element = data[index]

    confirmed.push({
      x: element.date,
      y: element.confirmed,
    })
    deaths.push({
      x: element.date,
      y: element.deaths,
    })
    recovered.push({
      x: element.date,
      y: element.recovered,
    })
  }

  series.push({
    name: 'Confirmed',
    data: confirmed,
  })
  series.push({
    name: 'Deaths',
    data: deaths,
  })
  series.push({
    name: 'Recovered',
    data: recovered,
  })

  return series
}

function buildChart(data: CountryData, countryName: string) {
  const pickedCountry = pickCountry(data, countryName)
  series.value = buildSeries(pickedCountry)
}

function clearChart() {
  series.value = []
}

onMounted(() => {
  fetchData()
})

watch(
  () => selectedCountry,
  (selectedCountry) => {
    // console.log('watchEffect')
    clearChart()
    fetchData()
  }, { deep: true })
</script>
