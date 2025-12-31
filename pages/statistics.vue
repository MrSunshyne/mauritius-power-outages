<script setup lang="ts">
import { flat } from '~/utils/filters'
import { API_URLS } from '~/utils/api'
import type { Record } from '~/types'

// SEO
useSeoMeta({
  title: 'Power Outage Statistics Mauritius - Trends & Analysis',
  description: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogTitle: 'Power Outage Statistics Mauritius - Trends & Analysis',
  ogDescription: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogUrl: 'https://power-outages-mauritius.netlify.app/statistics',
  twitterCard: 'summary_large_image',
})

// OG Image
defineOgImageComponent('Statistics', {
  title: 'Power Outage Statistics',
  subtitle: 'Mauritius Trends & Analysis',
})

function getWeek(date: Date) {
    const firstDay = new Date(date.getFullYear(), 0, 1)
    const dayOfYear = (date.getTime() - firstDay.getTime()) / 86400000 + 1
    return Math.ceil(dayOfYear / 7)
}

// Fetch full data for statistics
const powerOutageData = ref<{ [key: string]: Record[] } | null>(null)

onMounted(async () => {
    // Track statistics page view
    if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('stats-page-view');
    }
    
    try {
        const response = await $fetch<string>(API_URLS.full)
        // GitHub raw URLs return text, need to parse JSON manually
        powerOutageData.value = typeof response === 'string' ? JSON.parse(response) : response
    } catch (e) {
        console.error('Failed to fetch power outage data:', e)
    }
})

const cFlat = computed<Record[]>(() => {
    return flat(powerOutageData.value)
})

const sortByDate = computed<Record[]>(() => {
    return cFlat.value.sort((a, b) => {
        return new Date(a.from).getTime() - new Date(b.from).getTime()
    })
})

const countPerWeek = computed(() => {
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

const countPerDay = computed(() => {
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

const countPerDate = computed(() => {
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

const countPerMonth = computed(() => {
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

const countPerDistrict = computed(() => {
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

const countPerHour = computed(() => {
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
                :count-per-date="countPerDate" />

            <ClientOnly>
                <ChartsChartCountPerDate class="col-span-2" :data="countPerDate" :title="'Detailed timeline'" />

                <ChartsChartCountPerDay class="col-span-2" :data="countPerDay" :title="'Distribution by day'" />

                <ChartsChartCountPerMonth :data="countPerMonth" class="col-span-2" :title="'Monthly quota of darkness'" />

                <ChartsChartCountPerWeek :data="countPerWeek" :title="'Week of the year'" class="col-span-2" />

                <ChartsChartCountPerHour :data="countPerHour" class="col-span-2" :title="'Segments of the day'" />

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
