<script setup lang="ts">
import { addDays, format, parseISO } from 'date-fns'
import { API_URLS } from '~/utils/api'
import type { Record } from '~/types'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

definePageMeta({
    layout: 'default',
})

const route = useRoute()
const dateParam = route.params.date as string

const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateParam)

if (!isValidDate) {
    navigateTo('/')
}

const currentDate = computed(() => parseISO(dateParam))

const yesterday = computed(() => format(addDays(currentDate.value, -1), 'yyyy-MM-dd'))
const tomorrow = computed(() => format(addDays(currentDate.value, 1), 'yyyy-MM-dd'))

const dateLabel = computed(() => format(currentDate.value, 'EEEE, MMM d, yyyy'))

const isToday = computed(() => {
    const today = new Date()
    return format(today, 'yyyy-MM-dd') === dateParam
})

const isTomorrow = computed(() => {
    const tomorrow = addDays(new Date(), 1)
    return format(tomorrow, 'yyyy-MM-dd') === dateParam
})

const isFuture = computed(() => {
    const tomorrow = addDays(new Date(), 1)
    return currentDate.value > tomorrow
})

const dailyData = ref<{ outages: Record[] } | null>(null)
const dailyStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

const fetchDailyData = async () => {
    dailyStatus.value = 'pending'
    try {
        const response = await $fetch<string>(API_URLS.daily(dateParam))
        const data = typeof response === 'string' ? JSON.parse(response) : response
        dailyData.value = { outages: data.outages || [] }
        dailyStatus.value = 'success'
    } catch (e) {
        console.error('Failed to fetch daily data:', e)
        dailyData.value = null
        dailyStatus.value = 'error'
    }
}

await fetchDailyData()

const cFlat = computed<Record[]>(() => dailyData.value?.outages || [])
const cSelected = computed<Record[]>(() => cFlat.value)

const isLoading = computed(() => dailyStatus.value === 'pending')

const goToPrev = () => {
    navigateTo(`/day/${yesterday.value}`)
}

const goToNext = () => {
    navigateTo(`/day/${tomorrow.value}`)
}

const goToToday = () => {
    navigateTo('/')
}

// Breadcrumb
const breadcrumbItems = computed(() => [
    { label: 'Browse' },
    { label: dateLabel.value }
])

useSeoMeta({
    title: () => `Power Outages - ${dateLabel.value}`,
    description: () => `Scheduled power outages for ${dateLabel.value} in Mauritius. Find affected areas and timings.`,
    ogTitle: () => `Power Outages - ${dateLabel.value}`,
    ogDescription: () => `Scheduled power outages for ${dateLabel.value} in Mauritius.`,
})

defineOgImageComponent('Outage', {
    heading: dateLabel.value,
    title: 'Power Outages in Mauritius',
    columnPercentClass: 'max-w-[65%]',
    description: 'View outage details for this date',
    icon: 'solar:lightbulb-bolt-broken',
    theme: '#FFD500',
    colorMode: 'dark',
    tagline: 'View more details',
    taglineRight: 'A project by Sandeep Ramgolam',
})
</script>

<template>
    <PageContainer>
        <Breadcrumb :items="breadcrumbItems" />
        
        <div class="flex flex-col gap-6 sm:gap-8">
            <DateNavigation 
                :date-label="dateLabel" 
                :show-today="!isToday" 
                :disabled="isLoading"
                @prev="goToPrev"
                @next="goToNext"
                @today="goToToday"
            />

            <div>
                <div v-if="isLoading" class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
                    Loading outage data...
                </div>

                <template v-else-if="dailyStatus === 'error'">
                    <div class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
                        <p v-if="isFuture">Data not yet available for this future date.</p>
                        <p v-else>No power outages scheduled for this day or data not available.</p>
                    </div>
                </template>

                <template v-else>
                    <CellGroup v-if="cSelected.length > 0" :data="cSelected" />
                    <div v-else class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
                        No power outages scheduled for this day
                    </div>
                </template>
            </div>
        </div>

        <footer class="mt-auto pt-8 pb-24 sm:pb-0">
            <SiteFooter />
        </footer>
    </PageContainer>
</template>


