<script setup lang="ts">
import { addDays, startOfDay, format } from 'date-fns'
import { filterByDate, flat } from '~/utils/filters'
import { API_URLS } from '~/utils/api'
import { mergeWithMockData } from '~/utils/mock-data'
import type { Record } from '~/types'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

// Page meta
definePageMeta({
    layout: 'default',
})

// SEO - with WhatsApp/Instagram compatibility
useSeoMeta({
    title: 'Power Outages in Mauritius - Live Schedule & Updates',
    description: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
    ogTitle: 'Power Outages in Mauritius - Live Schedule & Updates',
    ogDescription: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
    ogUrl: 'https://power-outages-mauritius.netlify.app',
    ogType: 'website',
    ogSiteName: 'Power Outages Mauritius',
    // Twitter/X
    twitterCard: 'summary_large_image',
    twitterTitle: 'Power Outages in Mauritius - Live Schedule & Updates',
    twitterDescription: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information.',
})

// OG Image - Using community template
defineOgImageComponent('Outage', {
    heading: 'Live status updates',
    title: 'Power Outages in Mauritius',
    columnPercentClass: 'max-w-[65%]',
    description: 'Stay informed about the latest power outages in Mauritius and share with your family and friends',
    icon: 'solar:lightbulb-bolt-broken',
    theme: '#FFD500',
    colorMode: 'dark',
    tagline: 'View more details',
    taglineRight: 'A project by Sandeep Ramgolam'
})

// Data fetching - latest data
const latestData = ref<{ today: Record[], future: Record[] } | null>(null)
const latestStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

// Fetch data on mount (client-side only since ssr: false)
onMounted(async () => {
    latestStatus.value = 'pending'
    try {
        const response = await $fetch<string>(API_URLS.latest)
        // GitHub raw URLs return text, need to parse JSON manually
        const data = typeof response === 'string' ? JSON.parse(response) : response
        // In development, merge with mock data for testing
        latestData.value = mergeWithMockData(data)
        latestStatus.value = 'success'
    } catch (e) {
        console.error('Failed to fetch power outage data:', e)
        // In development, still show mock data even if API fails
        latestData.value = mergeWithMockData(null)
        latestStatus.value = latestData.value.today.length > 0 || latestData.value.future.length > 0 ? 'success' : 'error'
    }
})

// Full history - lazy, fetched on demand
const fullData = ref<any>(null)
const isLoadingHistory = ref(false)

const selectedDate = ref(new Date())

const isToday = computed(() => {
    return startOfDay(selectedDate.value).getTime() === startOfDay(new Date()).getTime()
})

const isTomorrow = computed(() => {
    const tomorrow = startOfDay(addDays(new Date(), 1)).getTime()
    return startOfDay(selectedDate.value).getTime() === tomorrow
})

const isCurrentOrFuture = computed(() => {
    return isToday.value || isTomorrow.value
})

const cFlat = computed<Record[]>(() => {
    if (isCurrentOrFuture.value) {
        return flat(latestData.value)
    }
    return flat(fullData.value)
})

const cToday = computed<Record[]>(() => {
    return filterByDate(cFlat.value, new Date())
})

const cTomorrow = computed<Record[]>(() => {
    return filterByDate(cFlat.value, addDays(new Date(), 1))
})

const cSelected = computed<Record[]>(() => {
    return filterByDate(cFlat.value, selectedDate.value)
})

const dateLabel = computed(() => {
    return format(selectedDate.value, 'EEEE, MMM d, yyyy')
})

const isLoading = computed(() => {
    if (isLoadingHistory.value) {
        return true
    }
    if (isCurrentOrFuture.value) {
        return latestStatus.value === 'pending' || latestStatus.value === 'idle'
    }
    return false
})

const goToPrev = async () => {
    const newDate = addDays(selectedDate.value, -1)
    const willBeHistory = startOfDay(newDate).getTime() < startOfDay(new Date()).getTime()

    if (willBeHistory && !fullData.value) {
        isLoadingHistory.value = true
        try {
            const response = await $fetch<string>(API_URLS.full)
            // GitHub raw URLs return text, need to parse JSON manually
            fullData.value = typeof response === 'string' ? JSON.parse(response) : response
        }
        catch (e) {
            console.error('Failed to fetch full history:', e)
        }
        isLoadingHistory.value = false
    }

    selectedDate.value = newDate
}

const goToToday = () => {
    selectedDate.value = new Date()
}

const goToNext = () => {
    // Skip tomorrow if we're on today since it's already shown
    if (isToday.value) {
        selectedDate.value = addDays(new Date(), 2)
    }
    else {
        selectedDate.value = addDays(selectedDate.value, 1)
    }
}
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
            <!-- Desktop nav -->
            <div class="hidden sm:flex sm:items-center sm:justify-between">
                <h2 v-if="!isToday" class="text-xl sm:text-2xl md:text-3xl font-bold text-white">{{ dateLabel }}</h2>
                <h2 v-else class="text-xl sm:text-2xl md:text-3xl font-bold text-white">Today</h2>
                <div class="flex gap-2">
                    <button class="btn" :disabled="isLoading" :data-umami-event="ANALYTICS_EVENTS.NAV_PREV"
                        @click="goToPrev">Prev</button>
                    <button v-if="!isToday" class="btn" :disabled="isLoading"
                        :data-umami-event="ANALYTICS_EVENTS.NAV_TODAY" @click="goToToday">Today</button>
                    <button v-if="!isToday" class="btn" :disabled="isLoading"
                        :data-umami-event="ANALYTICS_EVENTS.NAV_NEXT" @click="goToNext">Next</button>
                </div>
            </div>

            <!-- Mobile date label (hidden when viewing today) -->
            <h2 v-if="!isToday" class="text-xl font-bold text-white sm:hidden">{{ dateLabel }}</h2>

            <div>
                <div v-if="isLoading" class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
                    Loading outage data...
                </div>

                <!-- Today view: show both today and tomorrow -->
                <template v-else-if="isToday">
                    <div class="space-y-10">
                        <section>
                            <!-- Mobile only heading for Today -->
                            <h2 class="text-xl font-bold text-white mb-4 sm:hidden">Today</h2>
                            <CellGroup v-if="cToday.length > 0" :data="cToday" />
                            <div v-else class="py-8 text-white/50 text-center text-base">
                                No power outages scheduled for today
                            </div>
                        </section>

                        <section>
                            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Tomorrow</h2>
                            <CellGroup v-if="cTomorrow.length > 0" :data="cTomorrow" />
                            <div v-else class="py-8 text-white/50 text-center text-base">
                                No power outages scheduled for tomorrow
                            </div>
                        </section>
                    </div>
                </template>

                <!-- Other dates: show single day -->
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

        <!-- Mobile sticky nav -->
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
                <button @click="goToNext" class="btn-mobile" :disabled="isToday || isLoading"
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
