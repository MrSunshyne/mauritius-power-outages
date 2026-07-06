<script setup lang="ts">
import { getISOWeek } from 'date-fns'
import { flat } from '~/utils/filters'
import { API_URLS, fetchJson } from '~/utils/api'
import type { Dataset, Record } from '~/types'
import { DISTRICT_NAMES } from '~/constants/districts'
import { useAnalytics } from '~/composables/useAnalytics'

const { track } = useAnalytics()

// Continue the dark statistics background behind the (transparent) site
// header and footer, instead of the default blue app gradient
useHead({
  bodyAttrs: {
    class: 'page-statistics',
  },
})

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

// Runs on the server (ISR, revalidated hourly): the full ~3.5 MB dataset
// never reaches the browser, only the aggregates below do.
function computeStats(records: Record[]) {
    // The dataset contains a few records with missing timestamps; drop them
    const valid = records.filter(record => record.from && !Number.isNaN(new Date(record.from).getTime()))
    valid.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime())

    const perDate = {} as { [key: string]: number }
    const perDay = {} as { [key: string]: number }
    const perMonth = {} as { [key: string]: number }
    const perWeek = {} as { [key: number]: number }
    const perHour = {} as { [key: number]: number }
    const perDistrict = {} as { [key: string]: number }
    const perDistrictMs = {} as { [key: string]: number }
    let wastedMs = 0

    for (const outage of valid) {
        const d = toMauritius(outage.from)
        const date = d.toISOString().slice(0, 10)
        const day = WEEKDAYS[d.getUTCDay()]
        const month = MONTHS[d.getUTCMonth()]
        const week = getISOWeek(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))

        perDate[date] = (perDate[date] || 0) + 1
        perDay[day] = (perDay[day] || 0) + 1
        perMonth[month] = (perMonth[month] || 0) + 1
        perWeek[week] = (perWeek[week] || 0) + 1
        perHour[d.getUTCHours()] = (perHour[d.getUTCHours()] || 0) + 1
        perDistrict[outage.district] = (perDistrict[outage.district] || 0) + 1

        // A few records have to < from (bad source data); skip those
        if (outage.to) {
            const duration = new Date(outage.to).getTime() - new Date(outage.from).getTime()
            if (duration > 0) {
                wastedMs += duration
                perDistrictMs[outage.district] = (perDistrictMs[outage.district] || 0) + duration
            }
        }
    }

    // Continuous daily series (zero-filled), so days without outages show
    // as real dips instead of the line bridging the gap
    const dateKeys = Object.keys(perDate).sort()
    const countPerDate: { x: string, y: number }[] = []
    if (dateKeys.length) {
        const start = new Date(`${dateKeys[0]}T00:00:00Z`).getTime()
        const end = new Date(`${dateKeys[dateKeys.length - 1]}T00:00:00Z`).getTime()
        for (let t = start; t <= end; t += 86_400_000) {
            const date = new Date(t).toISOString().slice(0, 10)
            countPerDate.push({ x: date, y: perDate[date] || 0 })
        }
    }

    // Trailing 30-day average of the daily series
    const rollingAverage = countPerDate.map((point, i) => {
        const window = countPerDate.slice(Math.max(0, i - 29), i + 1)
        const mean = window.reduce((sum, p) => sum + p.y, 0) / window.length
        return { x: point.x, y: Math.round(mean * 10) / 10 }
    })

    const todayKey = toMauritius(new Date().toISOString()).toISOString().slice(0, 10)
    const first = valid[0]
    const firstDate = first ? toMauritius(first.from) : null
    const days = Object.keys(perDay)
    const hours = Object.keys(perHour).map(Number)

    return {
        countPerDate,
        rollingAverage,
        // Monday-first calendar order
        countPerDay: [...WEEKDAYS.slice(1), 'Sunday'].filter(day => perDay[day])
            .map(day => ({ x: day, y: perDay[day] })),
        countPerMonth: MONTHS.filter(month => perMonth[month])
            .map(month => ({ x: month, y: perMonth[month] })),
        countPerWeek: Object.keys(perWeek).map(Number).sort((a, b) => a - b)
            .map(week => ({ x: week, y: perWeek[week] })),
        // All 24 hours, zero-filled, labelled in Mauritius time
        countPerHour: Array.from({ length: 24 }, (_, hour) => ({
            x: `${String(hour).padStart(2, '0')}:00`,
            y: perHour[hour] || 0,
        })),
        countPerDistrict: Object.keys(perDistrict).sort((a, b) => perDistrict[b] - perDistrict[a])
            .map(district => ({
                x: DISTRICT_NAMES[district as keyof typeof DISTRICT_NAMES] || district,
                y: perDistrict[district],
                hours: Math.round((perDistrictMs[district] || 0) / 3_600_000),
            })),
        outagesTodayCount: perDate[todayKey] || 0,
        hoursWasted: Math.round(wastedMs / 3_600_000),
        since: firstDate ? `${firstDate.getUTCDate()} ${MONTHS[firstDate.getUTCMonth()]} ${firstDate.getUTCFullYear()}` : null,
        worstDay: days.length ? days.reduce((a, b) => (perDay[b] > perDay[a] ? b : a)) : null,
        peakHour: hours.length ? hours.reduce((a, b) => (perHour[b] > perHour[a] ? b : a)) : null,
    }
}

const { data: stats } = await useAsyncData('statistics', async () => {
    const dataset = await fetchJson<Dataset>(API_URLS.full)
    return computeStats(flat(dataset))
})

onMounted(() => {
    track('stats-page-view')
})

const hoursWasted = computed(() => {
    return stats.value ? stats.value.hoursWasted.toLocaleString('en-US') : undefined
})

const worstDayInsight = computed(() => {
    if (!stats.value?.worstDay)
        return undefined
    return `${stats.value.worstDay} is the worst day of the week. You should probably go to the seaside`
})

const peakHourInsight = computed(() => {
    if (stats.value?.peakHour == null)
        return undefined
    return `Most outages start between ${stats.value.peakHour}:00 and ${stats.value.peakHour + 1}:00 — plan around it !`
})

// Breadcrumb
const breadcrumbItems = [
    { label: 'Statistics' }
]
</script>

<template>
    <div class="text-white flex-1">
        <div class="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6">
            <Breadcrumb :items="breadcrumbItems" />
        </div>

        <div class="pb-12">
            <div class="grid grid-cols-2 gap-12 text-left">
            <HeroSection class="col-span-2" :outages-today-count="stats?.outagesTodayCount" :hours-wasted="hoursWasted"
                :count-per-date="stats?.countPerDate" :since="stats?.since ?? undefined" />

            <ClientOnly>
                <ChartsChartCountPerDate class="col-span-2" :data="stats?.countPerDate ?? []"
                    :average="stats?.rollingAverage ?? []" :title="'Detailed timeline'" />

                <ChartsChartCountPerDay class="col-span-2" :data="stats?.countPerDay ?? []" :title="'Distribution by day'"
                    :insight="worstDayInsight" />

                <ChartsChartCountPerMonth :data="stats?.countPerMonth ?? []" class="col-span-2" :title="'Monthly quota of darkness'" />

                <ChartsChartCountPerWeek :data="stats?.countPerWeek ?? []" :title="'Week of the year'" class="col-span-2" />

                <ChartsChartCountPerHour :data="stats?.countPerHour ?? []" class="col-span-2" :title="'Segments of the day'"
                    :insight="peakHourInsight" />

                <ChartsChartCountPerDistrict class="col-span-2" :data="stats?.countPerDistrict ?? []" :title="'District statistics'" />
                <template #fallback>
                    <div class="col-span-2 text-center py-8 text-white/50">
                        Loading charts...
                    </div>
                </template>
            </ClientOnly>
            </div>
        </div>
    </div>
</template>

<style>
body.page-statistics #__nuxt {
    background: rgb(2, 0, 36);
    background: linear-gradient(90deg, rgb(2, 1, 21) 0%, rgba(2, 0, 36, 1) 35%, rgb(3, 1, 43) 55%);
}
</style>

<style scoped>
h1 {
    font-size: 1.5rem;
    font-weight: 700;
}
</style>
