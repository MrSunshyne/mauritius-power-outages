<template>
  <div class="text-white px-4 stats-bg ">

    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <!-- <h1>Statistics</h1> -->

    <div class=" grid grid-cols-2 gap-48 text-left">

      <hero-section
        class="col-span-2"
        :outages-today="outagesToday"
        :hours-wasted="hoursWasted"
        :count-per-date="countPerDate"
      />

      <chart-count-per-date
        class="col-span-2"
        :data="countPerDate"
        :title="'Detailed timeline'"
      />

      <chart-count-per-day
        class="col-span-2"
        :data="countPerDay"
        :title="'Distribution by day'"
      />

      <chart-count-per-month
        :data="countPerMonth"
        class="col-span-2"
        :title="'Monthly quota of darkness'"
      />

      <chart-count-per-week
        :data="countPerWeek"
        :title="'Week of the year'"
        class="col-span-2"
      />

      <chart-count-per-hour
        :data="countPerHour"
        class="col-span-2"
        :title="'Segments of the day'"
      />

      <chart-count-per-district
        class="col-span-2"
        :data="countPerDistrict"
        :title="'District statistics'"
      />

    </div>
  </div>
</template>

<script lang="ts" setup>
import { Head } from '@vueuse/head'
import { useQuery } from 'vue-query'
import { ComputedRef } from 'vue'
import { fetchJson } from '@/services/api'
import { flat } from '@/logic'
import { Record } from '@/types'

function getWeek(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const dayOfYear = (date.getTime() - firstDay.getTime()) / 86400000 + 1
  return Math.ceil(dayOfYear / 7)
}

const powerOutageQuery = reactive(useQuery('power-outage-data', () => fetchJson()))

const cFlat: ComputedRef<Record[]> = computed(() => {
  return flat(powerOutageQuery.data)
})

const sortByDate: ComputedRef<Record[]> = computed(() => {
  return cFlat.value.sort((a, b) => {
    return new Date(a.from).getTime() - new Date(b.from).getTime()
  })
})

const countPerWeek: ComputedRef<{ week: string; count: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const date = new Date(outage.from)
    const week = getWeek(date)
    if (occurence[week])
      occurence[week] += 1
    else
      occurence[week] = 1
  }
  for (const week in occurence)
    result.push({ x: week, y: occurence[week], week, count: occurence[week] })

  return result
})

const countPerDay: ComputedRef<{ x: string; y: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const date = new Date(outage.from)
    const day = date.toLocaleDateString('en-US', {
      weekday: 'long',
    })
    if (occurence[day])
      occurence[day] += 1
    else
      occurence[day] = 1
  }
  for (const day in occurence)
    result.push({ day, count: occurence[day], x: day, y: occurence[day] })

  return result
})

const countPerDate: ComputedRef<{ day: string; count: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const date = new Date(outage.from)
    const day = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    if (occurence[day])
      occurence[day] += 1
    else
      occurence[day] = 1
  }
  for (const day in occurence)
    result.push({ x: day, y: occurence[day], day, count: occurence[day] })

  return result
})

const countPerMonth: ComputedRef<{ month: string; count: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const date = new Date(outage.from)
    const month = date.toLocaleDateString('en-US', {
      month: 'long',
    })
    if (occurence[month])
      occurence[month] += 1
    else
      occurence[month] = 1
  }
  for (const month in occurence) {
    result.push({
      x: month,
      y: occurence[month],
      month,
      count: occurence[month],
    })
  }
  return result
})

const countPerDistrict: ComputedRef<{ district: string; count: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const district = outage.district
    if (occurence[district])
      occurence[district] += 1
    else
      occurence[district] = 1
  }
  for (const district in occurence)
    result.push({ x: district, y: occurence[district], district, count: occurence[district] })

  return result
})

const countPerHour: ComputedRef<{ hour: string; count: number }[]> = computed(() => {
  const occurence = {} as { [key: string]: number }
  const result = []
  for (const outage of sortByDate.value) {
    const date = new Date(outage.from)
    const hour = date.getHours()
    if (occurence[hour])
      occurence[hour] += 1
    else
      occurence[hour] = 1
  }
  for (const hour in occurence)
    result.push({ hour, count: occurence[hour], x: hour, y: occurence[hour] })

  return result
})

const outagesToday = computed(() => {
  const date = new Date()
  const result = []
  for (const outage of sortByDate.value) {
    const outageDate = new Date(outage.from)
    if (outageDate.toDateString() === date.toDateString())
      result.push(outage)
  }
  return result
})

// the sum of hours between the outage From and To
const hoursWasted = computed(() => {
  let result = 0
  for (const outage of sortByDate.value) {
    const from = new Date(outage.from)
    const to = new Date(outage.to)
    result += to.getHours() - from.getHours()
  }
  return result.toString()
})

</script>

<style scoped>
h1 {
  @apply text-2xl font-bold;
}

.stats-bg {
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, rgb(2, 1, 21) 0%, rgba(2, 0, 36, 1) 35%, rgb(3, 1, 43) 55%);
  background-size: cover;
}
</style>
