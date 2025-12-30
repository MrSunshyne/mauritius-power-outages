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
    <div class="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 flex-1 flex flex-col">
        <header class="mb-6 sm:mb-8 flex items-baseline justify-between gap-3">
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">Power Outages in Mauritius
            </h1>
            <div class="flex-shrink-0">
                <ClientOnly>
                    <ViewCounter />
                </ClientOnly>
            </div>
        </header>

        <main class="flex flex-col gap-6 sm:gap-8">
            <div class="hidden sm:flex sm:items-center sm:justify-between">
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white">{{ dateLabel }}</h2>
                <div class="flex gap-2">
                    <button class="btn" :disabled="isLoading" :data-umami-event="ANALYTICS_EVENTS.NAV_PREV"
                        @click="goToPrev">Prev</button>
                    <button class="btn" :disabled="isLoading" :data-umami-event="ANALYTICS_EVENTS.NAV_NEXT"
                        @click="goToNext">Next</button>
                    <button v-if="!isToday" class="btn" :disabled="isLoading"
                        :data-umami-event="ANALYTICS_EVENTS.NAV_TODAY" @click="goToToday">Today</button>
                </div>
            </div>

            <h2 class="text-xl font-bold text-white sm:hidden">{{ dateLabel }}</h2>

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
        </main>

        <footer class="mt-auto pt-8 pb-24 sm:pb-0">
            <SiteFooter />
        </footer>

        <nav class="fixed bottom-0 left-0 right-0 sm:hidden mobile-nav">
            <div class="max-w-4xl mx-auto px-4 py-3 flex gap-2">
                <button @click="goToPrev" class="btn-mobile" :disabled="isLoading"
                    :data-umami-event="ANALYTICS_EVENTS.NAV_PREV">
                    <span class="text-lg">&larr;</span>
                    <span>Prev</span>
                </button>
                <button @click="goToToday" class="btn-mobile" :disabled="isToday || isLoading"
                    :data-umami-event="ANALYTICS_EVENTS.NAV_TODAY">
                    <span class="text-lg">&bull;</span>
                    <span>Today</span>
                </button>
                <button @click="goToNext" class="btn-mobile" :disabled="isLoading"
                    :data-umami-event="ANALYTICS_EVENTS.NAV_NEXT">
                    <span>Next</span>
                    <span class="text-lg">&rarr;</span>
                </button>
            </div>
        </nav>
    </div>
</template>

<style scoped>
.btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: rgb(255 255 255 / 0.1);
    color: white;
    border-radius: 0.5rem;
    transition-property: color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.btn:hover {
    background-color: rgb(255 255 255 / 0.2);
}

.btn:active {
    background-color: rgb(255 255 255 / 0.25);
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn:disabled:hover,
.btn:disabled:active {
    background-color: rgb(255 255 255 / 0.1);
}

.mobile-nav {
    background-color: rgb(0 0 0 / 0.8);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgb(255 255 255 / 0.1);
    padding-bottom: env(safe-area-inset-bottom);
}

.btn-mobile {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    border-radius: 0.75rem;
    background-color: rgb(255 255 255 / 0.1);
    transition-property: color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.btn-mobile:active {
    background-color: rgb(255 255 255 / 0.2);
}

.btn-mobile:disabled {
    opacity: 0.4;
}

.btn-mobile:disabled:active {
    background-color: rgb(255 255 255 / 0.1);
}
</style>
