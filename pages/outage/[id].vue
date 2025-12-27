<script setup lang="ts">
import { format } from 'date-fns'
import { filterByDate, flat } from '~/utils/filters'
import { API_URLS } from '~/utils/api'
import type { Record } from '~/types'
import VueCountdown from '@chenfengyuan/vue-countdown'

// Get outage ID from route
const route = useRoute()
const outageId = route.params.id as string

// Page meta
definePageMeta({
    layout: 'default',
})

// SSR-compatible data fetching using useAsyncData
// This runs on both server and client, enabling dynamic OG tags
// Data is cached for 15 minutes (ISR) so we don't fetch on every request
const { data: latestData, status: latestStatus } = await useAsyncData<{ today: Record[], future: Record[] }>(
    'latest-outages',
    async () => {
        const response = await $fetch<string>(API_URLS.latest)
        return typeof response === 'string' ? JSON.parse(response) : response
    },
    { server: true, default: () => [] }
)

// Check if outage exists in latest data
const outageInLatest = computed(() => {
    if (!latestData.value) return null
    return flat(latestData.value).find(o => o.id === outageId)
})

// Fetch historical data only if outage not found in latest (lazy load on client)
// Also cached for 15 minutes via ISR
const { data: fullData, status: fullStatus } = await useAsyncData<any>(
    `full-outages-${outageId}`,
    async () => {
        // Only fetch if outage not in latest data
        if (outageInLatest.value) return null
        const response = await $fetch<string>(API_URLS.full)
        return typeof response === 'string' ? JSON.parse(response) : response
    },
    {
        server: true,
        immediate: true,
        default: () => null
    }
)

// Computed properties
const allOutages = computed(() => {
    const outages: Record[] = []
    if (latestData.value) {
        outages.push(...flat(latestData.value))
    }
    if (fullData.value) {
        outages.push(...flat(fullData.value))
    }
    return outages
})

const selectedOutage = computed(() => {
    return allOutages.value.find(o => o.id === outageId)
})

// Calculate outage status and timing information
const outageState = computed(() => {
    if (!selectedOutage.value) return null

    let state = 'upcoming'
    const from = new Date(selectedOutage.value.from)
    const to = new Date(selectedOutage.value.to)
    const now = new Date()

    if (now.getTime() > from.getTime()) {
        state = 'ongoing'
    }

    if (now.getTime() > to.getTime()) {
        state = 'past'
    }

    return state
})

const timeDifference = computed(() => {
    if (!selectedOutage.value || !outageState.value) return 0

    let target
    if (outageState.value === 'ongoing') {
        target = new Date(selectedOutage.value.to)
    } else if (outageState.value === 'upcoming') {
        target = new Date(selectedOutage.value.from)
    } else {
        target = new Date(selectedOutage.value.to)
    }

    const now = new Date()
    return Math.abs(target.getTime() - now.getTime())
})

// Status display information
const statusInfo = computed(() => {
    if (!outageState.value) return { text: '', action: '', color: '' }

    switch (outageState.value) {
        case 'upcoming':
            return {
                text: 'Scheduled Power Outage',
                action: 'Power will be cut',
                color: 'orange'
            }
        case 'ongoing':
            return {
                text: 'Power Currently Out',
                action: 'Power will resume',
                color: 'red'
            }
        case 'past':
            return {
                text: 'Power Restored',
                action: 'Power was restored',
                color: 'green'
            }
        default:
            return {
                text: 'Unknown Status',
                action: '',
                color: 'gray'
            }
    }
})

// Check if outage is from a previous day (historical)
const isHistoricalOutage = computed(() => {
    if (!selectedOutage.value) return false

    const outageDate = new Date(selectedOutage.value.from)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of today

    return outageDate < today
})

// Dynamic SEO based on outage data - computed values available during SSR
const title = computed(() => {
    if (selectedOutage.value) {
        const location = selectedOutage.value.locality
        const date = format(new Date(selectedOutage.value.from), 'MMM d, yyyy')
        const time = selectedOutage.value.from.slice(11, 16) + ' - ' + selectedOutage.value.to.slice(11, 16)
        return `Power Outage: ${location} - ${date} ${time} | Mauritius`
    }
    return 'Power Outage Details - Mauritius'
})

const description = computed(() => {
    if (selectedOutage.value) {
        const location = selectedOutage.value.locality
        const streets = selectedOutage.value.streets
        const date = format(new Date(selectedOutage.value.from), 'EEEE, MMMM d, yyyy')
        const time = selectedOutage.value.from.slice(11, 16) + ' to ' + selectedOutage.value.to.slice(11, 16)
        return `Power outage scheduled for ${location} (${streets}) on ${date} from ${time}. Check current power outage information for Mauritius.`
    }
    return 'View specific power outage information for Mauritius'
})

// Set dynamic OG tags - works on both server and client
useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogType: 'article',
    // ogUrl will be set automatically by nuxt-og-image
    ogSiteName: 'Power Outages Mauritius',
    ogLocale: 'en_MU',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
})

// Dynamic OG Image based on outage data
defineOgImageComponent('Outage', {
    title: selectedOutage.value?.locality || 'Mauritius',
    description: selectedOutage.value?.locality + ', ' + selectedOutage.value?.streets || 'View outage details',
    descriptionHeading: 'Affected locality:',
    icon: 'solar:lightbulb-bolt-broken',
    tagline: 'View more details',
    taglineRight: 'Power Outages in Mauritius',
    theme: '#FFD500',
    colorMode: 'light',
    headline: 'hi',
    mode: 'svg',
    date: selectedOutage.value ? format(new Date(selectedOutage.value.from), 'EEEE, MMM d, yyyy') : '',
    time: selectedOutage.value ? `${selectedOutage.value.from.slice(11, 16)} - ${selectedOutage.value.to.slice(11, 16)}` : '',
})

const currentOutages = computed(() => {
    return latestData.value ? flat(latestData.value) : []
})

const todayOutages = computed(() => {
    return currentOutages.value ? filterByDate(currentOutages.value, new Date()) : []
})

const isLoading = computed(() => {
    return latestStatus.value === 'pending' || fullStatus.value === 'pending'
})

// Helper function
function formatDate(date: Date) {
    return format(date, 'EEEE, MMM d, yyyy')
}
</script>

<template>
    <div class="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 flex-1 flex flex-col">

        <!-- Loading state -->
        <div v-if="isLoading" class="py-12 text-center">
            <div class="text-white/50 text-base sm:text-lg">Loading outage information...</div>
        </div>

        <template v-else>
            <!-- Specific outage section -->
            <section v-if="selectedOutage" class="mb-12">
                <div class="text-center mb-8">
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                        <span v-if="isHistoricalOutage">Oudated </span>Power Outage Details
                    </h1>
                    <!-- Historical outage hint - near heading -->
                    <div v-if="isHistoricalOutage" class="mb-4 text-center">
                        <div class="text-white/50 text-sm">
                            This is an old outage which occurred on {{
                                format(new Date(selectedOutage.from), 'MMM d, yyyy')
                            }}
                        </div>
                    </div>
                </div>

                <div class="bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10">
                    <!-- Status Header -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <div :class="{
                                'w-4 h-4 rounded-full': true,
                                'bg-orange-500': statusInfo.color === 'orange',
                                'bg-red-500': statusInfo.color === 'red',
                                'bg-green-500': statusInfo.color === 'green'
                            }"></div>
                            <div>
                                <h2 class="text-xl sm:text-2xl font-bold text-white">{{ selectedOutage.locality }}</h2>
                                <p class="text-sm text-white/70">{{ statusInfo.text }}</p>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div :class="{
                            'px-4 py-2 rounded-full text-sm font-semibold': true,
                            'bg-orange-500/20 text-orange-300': statusInfo.color === 'orange',
                            'bg-red-500/20 text-red-300': statusInfo.color === 'red',
                            'bg-green-500/20 text-green-300': statusInfo.color === 'green'
                        }">
                            {{ statusInfo.action }}
                        </div>
                    </div>

                    <!-- Countdown/Timer Section -->
                    <div v-if="outageState !== 'past'" class="mb-6 p-4 rounded-lg border bg-black/20" :class="{
                        'border-orange-500/30': statusInfo.color === 'orange',
                        'border-red-500/30': statusInfo.color === 'red'
                    }">
                        <div class="flex items-center justify-between">
                            <div class="text-white/90 font-medium">
                                {{ outageState === 'upcoming' ? 'Starts in:' : 'Ends in:' }}
                            </div>
                            <ClientOnly>
                                <vue-countdown v-slot="{ days, hours, minutes, seconds }" :time="timeDifference"
                                    class="text-white font-mono text-lg">
                                    <span v-if="days > 0">{{ days }}d </span>{{ hours }}h {{ minutes }}m {{ seconds }}s
                                </vue-countdown>
                                <template #fallback>
                                    <span class="text-white/60">Loading...</span>
                                </template>
                            </ClientOnly>
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div class="text-white/70 mb-1">Date & Time</div>
                            <div class="text-white font-bold">
                                {{ formatDate(new Date(selectedOutage.from)) }}
                            </div>
                            <div class="text-white text-lg mt-1 font-bold">
                                {{ selectedOutage.from.slice(11, 16) }} - {{ selectedOutage.to.slice(11, 16) }}
                            </div>
                            <div class="text-white/70 mt-4 mb-1">District</div>
                            <div class="text-white font-bold capitalize">
                                {{ selectedOutage.district }}
                            </div>
                        </div>

                        <div>
                            <div class="text-white/70 mb-1">Areas Affected</div>
                            <div class="text-white font-medium">{{ selectedOutage.streets }}</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Error state for invalid outage ID -->
            <section v-else class="mb-12">
                <div class="text-center mb-8">
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                        Outage Not Found
                    </h1>
                    <p class="text-white/70 text-lg mb-6">
                        The requested outage information could not be found.
                    </p>
                    <NuxtLink to="/"
                        class="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors">
                        View Current Outages
                    </NuxtLink>
                </div>
            </section>

            <!-- Current outages section -->
            <section class="space-y-8  border-t border-white/10 pt-8">
                <div class="" v-if="todayOutages.length > 0">
                    <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                        Current Power Outages
                    </h2>
                </div>

                <!-- Today -->
                <div v-if="todayOutages.length > 0" class="space-y-4">
                    <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Today
                    </h3>
                    <div class="space-y-3">
                        <CellGroup :data="todayOutages" />
                    </div>
                </div>
                <!-- Link to main page -->
                <div class="text-center pt-8">
                    <NuxtLink to="/"
                        class="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors">
                        View Latest Outages
                    </NuxtLink>
                </div>
            </section>
        </template>

        <!-- Footer -->
        <footer class="mt-auto pt-8 pb-24 sm:pb-0">
            <SiteFooter />
        </footer>
    </div>
</template>
