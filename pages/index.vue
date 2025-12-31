<script setup lang="ts">
import { addDays, format } from 'date-fns'
import { API_URLS } from '~/utils/api'
import { mergeWithMockData } from '~/utils/mock-data'
import type { Record } from '~/types'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

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

const latestData = ref<{ today: Record[], future: Record[] } | null>(null)
const latestStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')

onMounted(async () => {
    latestStatus.value = 'pending'
    try {
        const response = await $fetch<string>(API_URLS.latest)
        const data = typeof response === 'string' ? JSON.parse(response) : response
        latestData.value = mergeWithMockData(data)
        latestStatus.value = 'success'
    } catch (e) {
        console.error('Failed to fetch power outage data:', e)
        latestData.value = mergeWithMockData(null)
        latestStatus.value = latestData.value.today.length > 0 || latestData.value.future.length > 0 ? 'success' : 'error'
    }
})

const cFlat = computed<Record[]>(() => {
    if (!latestData.value) return []
    return [...(latestData.value.today || []), ...(latestData.value.future || [])]
})

const cToday = computed<Record[]>(() => {
    return latestData.value?.today || []
})

const cTomorrow = computed<Record[]>(() => {
    return latestData.value?.future || []
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
