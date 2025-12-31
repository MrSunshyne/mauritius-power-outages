<script setup lang="ts">
import { addDays, format } from 'date-fns'
import { API_URLS, fetchJson } from '~/utils/api'
import { mergeWithMockData, isMockDataEnabled } from '~/utils/mock-data'
import type { Record } from '~/types'
import { useAnalytics } from '~/composables/useAnalytics'

const { track } = useAnalytics()

definePageMeta({
    layout: 'default',
})

useSeoMeta({
    title: 'Power Outages in Mauritius - Live Schedule & Updates',
    description: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
    ogTitle: 'Power Outages in Mauritius - Live Schedule & Updates',
    ogDescription: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
    ogUrl: 'https://power-outages-mauritius.netlify.app',
    ogType: 'website',
    ogSiteName: 'Power Outages Mauritius',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Power Outages in Mauritius - Live Schedule & Updates',
    twitterDescription: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information.',
})

defineOgImageComponent('Outage', {
    heading: 'Live status updates',
    title: 'Power Outages in Mauritius',
    columnPercentClass: 'max-w-[65%]',
    description: 'Stay informed about the latest power outages in Mauritius and share with your family and friends',
    icon: 'solar:lightbulb-bolt-broken',
    theme: '#FFD500',
    colorMode: 'dark',
    tagline: 'View more details',
    taglineRight: 'A project by Sandeep Ramgolam',
})

interface DailyResponse {
    outages: Record[]
}

const todayData = ref<Record[]>([])
const tomorrowData = ref<Record[]>([])
const latestStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

onMounted(async () => {
    latestStatus.value = 'pending'
    try {
        const today = format(new Date(), 'yyyy-MM-dd')
        const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

        // Fetch both today's and tomorrow's data in parallel
        const [todayResponse, tomorrowResponse] = await Promise.allSettled([
            fetchJson<DailyResponse>(API_URLS.daily(today)),
            fetchJson<DailyResponse>(API_URLS.daily(tomorrow))
        ])

        // Handle today's data
        if (todayResponse.status === 'fulfilled') {
            todayData.value = todayResponse.value.outages || []
        } else {
            console.error('Failed to fetch today\'s data:', todayResponse.reason)
        }

        // Handle tomorrow's data
        if (tomorrowResponse.status === 'fulfilled') {
            tomorrowData.value = tomorrowResponse.value.outages || []
        } else {
            console.error('Failed to fetch tomorrow\'s data:', tomorrowResponse.reason)
        }

        // Merge with mock data if enabled
        const mockData = mergeWithMockData({ 
            today: todayData.value, 
            future: tomorrowData.value 
        })
        todayData.value = mockData.today
        tomorrowData.value = mockData.future

        latestStatus.value = 'success'
    } catch (e) {
        console.error('Failed to fetch power outage data:', e)
        
        // Try mock data fallback if enabled
        if (isMockDataEnabled()) {
            const mockData = mergeWithMockData(null)
            todayData.value = mockData.today
            tomorrowData.value = mockData.future
            latestStatus.value = 'success'
        } else {
            latestStatus.value = 'error'
        }
    }
})

const cFlat = computed<Record[]>(() => {
    return [...todayData.value, ...tomorrowData.value]
})

const cToday = computed<Record[]>(() => {
    return todayData.value
})

const cTomorrow = computed<Record[]>(() => {
    return tomorrowData.value
})

const isLoading = computed(() => latestStatus.value === 'pending' || latestStatus.value === 'idle')

const goToPrev = () => {
    const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd')
    navigateTo(`/day/${yesterday}`)
}

const goToNext = () => {
    const dayAfterTomorrow = format(addDays(new Date(), 2), 'yyyy-MM-dd')
    navigateTo(`/day/${dayAfterTomorrow}`)
}

const breadcrumbItems = computed(() => {
    return [
        {
            label: 'Today',
            to: '/',
        },

    ]
})
</script>

<template>
    <PageContainer>
        <Breadcrumb :items="breadcrumbItems" />

        <div class="flex flex-col gap-6 sm:gap-8">
            <DateNavigation date-label="Today" :show-today="false" :disabled="isLoading" @prev="goToPrev"
                @next="goToNext" />

            <div>
                <div v-if="isLoading" class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
                    Loading outage data...
                </div>

                <template v-else>
                    <div class="space-y-10">
                        <section>
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
            </div>
        </div>

        <footer class="mt-auto pt-8 pb-24 sm:pb-0">
            <SiteFooter />
        </footer>
    </PageContainer>
</template>
