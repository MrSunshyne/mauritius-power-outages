<script setup lang="ts">
import { getISOWeek } from 'date-fns'
import { flat } from '~/utils/filters'
import { API_URLS, fetchJson } from '~/utils/api'
import type { Record } from '~/types'
import { useAnalytics } from '~/composables/useAnalytics'

const { track } = useAnalytics()

// SEO
const requestUrl = useRequestURL()
useSeoMeta({
  title: 'Power Outage Statistics Mauritius - Trends & Analysis',
  description: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogTitle: 'Power Outage Statistics Mauritius - Trends & Analysis',
  ogDescription: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogUrl: `${requestUrl.origin}/statistics`,
  twitterCard: 'summary_large_image',
})

// OG Image
defineOgImageComponent('Statistics', {
  title: 'Power Outage Statistics',
  subtitle: 'Mauritius Trends & Analysis',
})

// All aggregations use Mauritius time, not the visitor's timezone.
// Mauritius is UTC+4 with no DST, so shift the timestamp and read UTC fields.
const MU_OFFSET_MS = 4 * 60 * 60 * 1000
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function toMauritius(iso: string) {
    return new Date(new Date(iso).getTime() + MU_OFFSET_MS)
}

// Calendar day in Mauritius as 'yyyy-MM-dd'
function muDateKey(iso: string) {
    return toMauritius(iso).toISOString().slice(0, 10)
}

function muWeek(iso: string) {
    const d = toMauritius(iso)
    return getISOWeek(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

// Fetch full data for statistics
const powerOutageData = ref<{ [key: string]: Record[] } | null>(null)

onMounted(async () => {
    track('stats-page-view')

    try {
        const response = await fetchJson<{ [key: string]: Record[] }>(API_URLS.full)
        powerOutageData.value = response
    } catch (e) {
        console.error('Failed to fetch power outage data:', e)
    }
})

// The dataset contains a few records with missing timestamps; drop them
const cFlat = computed<Record[]>(() => {
    return flat(powerOutageData.value).filter(record => record.from && !Number.isNaN(new Date(record.from).getTime()))
})

const sortByDate = computed<Record[]>(() => {
    return [...cFlat.value].sort((a, b) => {
        return new Date(a.from).getTime() - new Date(b.from).getTime()
    })
})

const countPerWeek = computed(() => {
    const occurence = {} as { [key: number]: number }
    for (const outage of sortByDate.value) {
        const week = muWeek(outage.from)
        occurence[week] = (occurence[week] || 0) + 1
    }
    return Object.keys(occurence).map(Number).sort((a, b) => a - b)
        .map(week => ({ x: week, y: occurence[week], week, count: occurence[week] }))
})

const countPerDay = computed(() => {
    const occurence = {} as { [key: string]: number }
    for (const outage of sortByDate.value) {
        const day = WEEKDAYS[toMauritius(outage.from).getUTCDay()]
        occurence[day] = (occurence[day] || 0) + 1
    }
    // Monday-first calendar order
    return [...WEEKDAYS.slice(1), 'Sunday'].filter(day => occurence[day])
        .map(day => ({ x: day, y: occurence[day], day, count: occurence[day] }))
})

const countPerDate = computed(() => {
    const occurence = {} as { [key: string]: number }
    for (const outage of sortByDate.value) {
        const date = muDateKey(outage.from)
        occurence[date] = (occurence[date] || 0) + 1
    }
    return Object.keys(occurence).map(date => ({ x: date, y: occurence[date], day: date, count: occurence[date] }))
})

const countPerMonth = computed(() => {
    const occurence = {} as { [key: string]: number }
    for (const outage of sortByDate.value) {
        const month = MONTHS[toMauritius(outage.from).getUTCMonth()]
        occurence[month] = (occurence[month] || 0) + 1
    }
    return MONTHS.filter(month => occurence[month])
        .map(month => ({ x: month, y: occurence[month], month, count: occurence[month] }))
})

const countPerDistrict = computed(() => {
    const occurence = {} as { [key: string]: number }
    for (const outage of sortByDate.value) {
        const district = outage.district
        occurence[district] = (occurence[district] || 0) + 1
    }
    const result = []
    for (const district in occurence)
        result.push({ x: district, y: occurence[district], district, count: occurence[district] })

    return result
})

const countPerHour = computed(() => {
    const occurence = {} as { [key: number]: number }
    for (const outage of sortByDate.value) {
        const hour = toMauritius(outage.from).getUTCHours()
        occurence[hour] = (occurence[hour] || 0) + 1
    }
    return Object.keys(occurence).map(Number).sort((a, b) => a - b)
        .map(hour => ({ hour, count: occurence[hour], x: hour, y: occurence[hour] }))
})

const outagesToday = computed(() => {
    const todayKey = muDateKey(new Date().toISOString())
    return sortByDate.value.filter(outage => muDateKey(outage.from) === todayKey)
})

// Total hours of scheduled outages. A few records have to < from
// (bad source data); those are skipped rather than subtracted.
const hoursWasted = computed(() => {
    if (!sortByDate.value.length)
        return undefined
    let ms = 0
    for (const outage of sortByDate.value) {
        if (!outage.to)
            continue
        const duration = new Date(outage.to).getTime() - new Date(outage.from).getTime()
        if (duration > 0)
            ms += duration
    }
    return Math.round(ms / 3_600_000).toLocaleString('en-US')
})

const since = computed(() => {
    const first = sortByDate.value[0]
    if (!first)
        return undefined
    const d = toMauritius(first.from)
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
})

const worstDayInsight = computed(() => {
    if (!countPerDay.value.length)
        return undefined
    const worst = countPerDay.value.reduce((a, b) => (b.count > a.count ? b : a))
    return `${worst.day} is the worst day of the week. You should probably go to the seaside`
})

const peakHourInsight = computed(() => {
    if (!countPerHour.value.length)
        return undefined
    const peak = countPerHour.value.reduce((a, b) => (b.count > a.count ? b : a))
    return `Most outages start between ${peak.hour}:00 and ${peak.hour + 1}:00 — plan around it !`
})

// Breadcrumb
const breadcrumbItems = [
    { label: 'Statistics' }
]
</script>

<template>
    <PageContainer>
        <Breadcrumb :items="breadcrumbItems" />

        <div class="text-white stats-bg py-6">
            <div class="grid grid-cols-2 gap-48 text-left">
            <HeroSection class="col-span-2" :outages-today="outagesToday" :hours-wasted="hoursWasted"
                :count-per-date="countPerDate" :since="since" />

            <ClientOnly>
                <ChartsChartCountPerDate class="col-span-2" :data="countPerDate" :title="'Detailed timeline'" />

                <ChartsChartCountPerDay class="col-span-2" :data="countPerDay" :title="'Distribution by day'"
                    :insight="worstDayInsight" />

                <ChartsChartCountPerMonth :data="countPerMonth" class="col-span-2" :title="'Monthly quota of darkness'" />

                <ChartsChartCountPerWeek :data="countPerWeek" :title="'Week of the year'" class="col-span-2" />

                <ChartsChartCountPerHour :data="countPerHour" class="col-span-2" :title="'Segments of the day'"
                    :insight="peakHourInsight" />

                <ChartsChartCountPerDistrict class="col-span-2" :data="countPerDistrict" :title="'District statistics'" />
                <template #fallback>
                    <div class="col-span-2 text-center py-8 text-white/50">
                        Loading charts...
                    </div>
                </template>
            </ClientOnly>
        </div>
        </div>
    </PageContainer>
</template>

<style scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 700;
}

.stats-bg {
    background: rgb(2, 0, 36);
    background: linear-gradient(90deg, rgb(2, 1, 21) 0%, rgba(2, 0, 36, 1) 35%, rgb(3, 1, 43) 55%);
    background-size: cover;
}
</style>
