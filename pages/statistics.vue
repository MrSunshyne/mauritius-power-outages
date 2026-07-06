<script setup lang="ts">
import { getISOWeek } from 'date-fns'
import { flat } from '~/utils/filters'
import { API_URLS, fetchJson } from '~/utils/api'
import { generateSlug } from '~/utils/slug'
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
const MONTHS_SHORT = MONTHS.map(month => month.slice(0, 3))
const DURATION_LABELS = ['< 1h', '1–2h', '2–3h', '3–4h', '4–5h', '5–6h', '6–8h', '8h +']
const HOUR_LABELS = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)

function toMauritius(iso: string) {
    return new Date(new Date(iso).getTime() + MU_OFFSET_MS)
}

function titleCase(name: string) {
    return name.toLowerCase().replace(/(^|[\s-])\S/g, s => s.toUpperCase())
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
    const perYearMonth = {} as { [year: string]: number[] }
    const perDayHour = {} as { [day: string]: number[] }
    const perLocality = {} as { [name: string]: { count: number, ms: number } }
    const durationBuckets = DURATION_LABELS.map(() => 0)
    let durationCount = 0
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
        const hour = d.getUTCHours()
        perHour[hour] = (perHour[hour] || 0) + 1
        perDistrict[outage.district] = (perDistrict[outage.district] || 0) + 1

        if (!perDayHour[day])
            perDayHour[day] = HOUR_LABELS.map(() => 0)
        perDayHour[day][hour] += 1

        const year = String(d.getUTCFullYear())
        if (!perYearMonth[year])
            perYearMonth[year] = MONTHS.map(() => 0)
        perYearMonth[year][d.getUTCMonth()] += 1

        const locality = outage.locality?.trim()
        if (locality) {
            if (!perLocality[locality])
                perLocality[locality] = { count: 0, ms: 0 }
            perLocality[locality].count += 1
        }

        // A few records have to < from (bad source data); skip those
        if (outage.to) {
            const duration = new Date(outage.to).getTime() - new Date(outage.from).getTime()
            if (duration > 0) {
                wastedMs += duration
                durationCount += 1
                perDistrictMs[outage.district] = (perDistrictMs[outage.district] || 0) + duration
                if (locality)
                    perLocality[locality].ms += duration

                const hours = duration / 3_600_000
                const bucket = hours < 1 ? 0 : hours < 2 ? 1 : hours < 3 ? 2 : hours < 4 ? 3 : hours < 5 ? 4 : hours < 6 ? 5 : hours < 8 ? 6 : 7
                durationBuckets[bucket] += 1
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

    // One series per year, Jan-Dec; null outside the dataset's range so
    // lines start/stop where the data does instead of dropping to zero
    const firstYm = dateKeys.length ? dateKeys[0].slice(0, 7) : ''
    const lastYm = dateKeys.length ? dateKeys[dateKeys.length - 1].slice(0, 7) : ''
    const yearlySeries = Object.keys(perYearMonth).sort().map(year => ({
        name: year,
        data: MONTHS_SHORT.map((month, i) => {
            const ym = `${year}-${String(i + 1).padStart(2, '0')}`
            return { x: month, y: ym >= firstYm && ym <= lastYm ? perYearMonth[year][i] : null }
        }),
    }))

    // Day x hour matrix; Apex heatmaps draw the first series at the bottom,
    // so reverse to display Monday at the top
    const weekOrder = [...WEEKDAYS.slice(1), 'Sunday']
    const heatmapSeries = [...weekOrder].reverse().map(day => ({
        name: day,
        data: HOUR_LABELS.map((label, hour) => ({ x: label, y: perDayHour[day]?.[hour] || 0 })),
    }))
    let peakDayHour = null as { day: string, hour: number, count: number } | null
    for (const day of weekOrder) {
        (perDayHour[day] || []).forEach((count, hour) => {
            if (!peakDayHour || count > peakDayHour.count)
                peakDayHour = { day, hour, count }
        })
    }

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
        yearlySeries,
        heatmapSeries,
        peakDayHour,
        durationHistogram: DURATION_LABELS.map((label, i) => ({ x: label, y: durationBuckets[i] })),
        avgDurationHours: durationCount ? Math.round((wastedMs / durationCount / 3_600_000) * 10) / 10 : null,
        topLocalities: Object.keys(perLocality)
            .sort((a, b) => perLocality[b].count - perLocality[a].count)
            .slice(0, 15)
            .map(name => ({
                name: titleCase(name),
                slug: generateSlug(name),
                count: perLocality[name].count,
                hours: Math.round(perLocality[name].ms / 3_600_000),
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

const durationInsight = computed(() => {
    if (stats.value?.avgDurationHours == null)
        return undefined
    return `The average scheduled outage lasts ${stats.value.avgDurationHours} hours`
})

const heatmapInsight = computed(() => {
    const peak = stats.value?.peakDayHour
    if (!peak)
        return undefined
    return `${peak.day}s at ${peak.hour}:00 are the darkest hour of the week — ${peak.count.toLocaleString('en-US')} outages and counting`
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

        <div class="pb-16 text-left">
            <HeroSection :outages-today-count="stats?.outagesTodayCount" :hours-wasted="hoursWasted"
                :count-per-date="stats?.countPerDate" :since="stats?.since ?? undefined" />

            <div class="flex flex-col gap-16">
                <SectionHeading :kicker="'The trend'" :title="'Is it getting better?'"
                    :subtitle="'How outages have evolved since March 2022 — and how this year compares to the last four'" />
                <ClientOnly>
                    <div class="flex flex-col gap-16">
                        <ChartsChartYearOverYear :data="stats?.yearlySeries ?? []" :title="'Year over year'" />

                        <ChartsChartCountPerDate :data="stats?.countPerDate ?? []"
                            :average="stats?.rollingAverage ?? []" :title="'Detailed timeline'" />
                    </div>
                    <template #fallback>
                        <div class="text-center py-8 text-white/50">Loading charts...</div>
                    </template>
                </ClientOnly>

                <SectionHeading :kicker="'The rhythm'" :title="'When do cuts happen?'"
                    :subtitle="'The hours, days and seasons the island goes dark'" />
                <ClientOnly>
                    <div class="flex flex-col gap-16">
                        <ChartsChartDayHourHeatmap :data="stats?.heatmapSeries ?? []"
                            :title="'The weekly heatmap'" :insight="heatmapInsight" />

                        <ChartsChartDurations :data="stats?.durationHistogram ?? []"
                            :title="'How long do cuts last?'" :insight="durationInsight" />

                        <ChartsChartCountPerHour :data="stats?.countPerHour ?? []" :title="'Segments of the day'"
                            :insight="peakHourInsight" />

                        <ChartsChartCountPerDay :data="stats?.countPerDay ?? []" :title="'Distribution by day'"
                            :insight="worstDayInsight" />

                        <ChartsChartCountPerMonth :data="stats?.countPerMonth ?? []" :title="'Monthly quota of darkness'" />

                        <ChartsChartCountPerWeek :data="stats?.countPerWeek ?? []" :title="'Week of the year'" />
                    </div>
                    <template #fallback>
                        <div class="text-center py-8 text-white/50">Loading charts...</div>
                    </template>
                </ClientOnly>

                <SectionHeading :kicker="'The map'" :title="'Where do cuts happen?'"
                    :subtitle="'The districts and localities that spend the most time in the dark'" />

                <TopLocalities :items="stats?.topLocalities ?? []" :title="'Most affected localities'" />

                <ClientOnly>
                    <ChartsChartCountPerDistrict :data="stats?.countPerDistrict ?? []" :title="'District statistics'" />
                    <template #fallback>
                        <div class="text-center py-8 text-white/50">Loading charts...</div>
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
