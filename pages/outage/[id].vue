<script setup lang="ts">
import { format } from 'date-fns'
import { filterByDate, flat } from '~/utils/filters'
import { API_URLS } from '~/utils/api'
import { downloadICS, generateGoogleCalendarUrl, type CalendarEvent } from '~/utils/calendar'
import type { Record } from '~/types'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

// Get outage ID from route
const route = useRoute()
const outageId = route.params.id as string

// Page meta
definePageMeta({
    layout: 'default',
})

// Fetch only the specific outage we need - extracts single record server-side
const { data: selectedOutage, status: outageStatus } = await useAsyncData<Record | null>(
    `outage-${outageId}`,
    async () => {
        // First, check latest data (small payload)
        const latestResponse = await $fetch<string>(API_URLS.latest)
        const latestData = typeof latestResponse === 'string' ? JSON.parse(latestResponse) : latestResponse
        const latestOutages = flat(latestData)
        const foundInLatest = latestOutages.find((o: Record) => o.id === outageId)

        if (foundInLatest) {
            return foundInLatest
        }

        // Not in latest, fetch full history and extract just the one we need
        const fullResponse = await $fetch<string>(API_URLS.full)
        const fullData = typeof fullResponse === 'string' ? JSON.parse(fullResponse) : fullResponse
        const allOutages = flat(fullData)
        return allOutages.find((o: Record) => o.id === outageId) || null
    },
    { server: true }
)

// Fetch latest data separately for "today's outages" section (small payload)
const { data: latestData, status: latestStatus } = await useAsyncData<{ today: Record[], future: Record[] }>(
    'latest-outages',
    async () => {
        // Only fetch if outage not in latest data
        if (outageInLatest.value) return null
        const response = await $fetch<string>(API_URLS.full)
        return typeof response === 'string' ? JSON.parse(response) : response
    },
    { server: true, default: () => ({ today: [], future: [] }) }
)

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

// Share functionality
const shareMessage = computed(() => {
    if (!selectedOutage.value) return ''

    const location = selectedOutage.value.locality
    const date = format(new Date(selectedOutage.value.from), 'MMM d, yyyy')
    const time = `${selectedOutage.value.from.slice(11, 16)} - ${selectedOutage.value.to.slice(11, 16)}`
    const district = selectedOutage.value.district

    return `⚡ Power outage alert: ${location} (${district}) - ${date} from ${time}. Stay safe!`
})

const shareUrl = computed(() => {
    if (!selectedOutage.value) return ''
    return `https://power-outages-mauritius.netlify.app/outage/${selectedOutage.value.id}`
})

const handleShare = async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Power Outage: ${selectedOutage.value?.locality}`,
                text: shareMessage.value,
                url: shareUrl.value,
            })
        } catch (error) {
            // User cancelled or error occurred
            console.log('Share cancelled or failed:', error)
        }
    } else {
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(`${shareMessage.value}\n\n${shareUrl.value}`)
            alert('Link copied to clipboard!')
        } catch (error) {
            // Final fallback: select text
            const textArea = document.createElement('textarea')
            textArea.value = `${shareMessage.value}\n\n${shareUrl.value}`
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            alert('Link copied to clipboard!')
        }
    }
}

// Calendar functionality
const calendarEvent = computed<CalendarEvent | null>(() => {
    if (!selectedOutage.value) return null

    const outage = selectedOutage.value
    const location = outage.locality
    const district = outage.district
    const streets = outage.streets

    return {
        title: `Power Outage: ${location}`,
        description: `Scheduled power outage in ${location}, ${district}.\n\nAffected areas: ${streets}\n\nMore info: ${shareUrl.value}`,
        location: `${location}, ${district}, Mauritius`,
        startTime: new Date(outage.from),
        endTime: new Date(outage.to),
        url: shareUrl.value,
    }
})

const handleSaveToCalendar = () => {
    if (!calendarEvent.value || !selectedOutage.value) return

    const filename = `power-outage-${selectedOutage.value.locality.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(selectedOutage.value.from), 'yyyy-MM-dd')}.ics`
    downloadICS(calendarEvent.value, filename)
}

const googleCalendarUrl = computed(() => {
    if (!calendarEvent.value) return ''
    return generateGoogleCalendarUrl(calendarEvent.value)
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
    return outageStatus.value === 'pending' || latestStatus.value === 'pending'
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
            <section v-if="selectedOutage" class="mb-8">
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

                <div class="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
                    <!-- Header -->
                    <div class="px-6 py-5 sm:px-8 sm:py-6 border-b border-white/[0.06]">
                        <div class="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div>
                                <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">{{
                                    selectedOutage.locality }}</h2>
                                <p class="text-white/50 text-sm mt-1 capitalize">{{ selectedOutage.district }} District
                                </p>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <span :class="{
                                    'w-2 h-2 rounded-full': true,
                                    'bg-orange-400': statusInfo.color === 'orange',
                                    'bg-red-400': statusInfo.color === 'red',
                                    'bg-green-400': statusInfo.color === 'green'
                                }"></span>
                                <span :class="{
                                    'text-sm': true,
                                    'text-orange-300/90': statusInfo.color === 'orange',
                                    'text-red-300/90': statusInfo.color === 'red',
                                    'text-green-300/90': statusInfo.color === 'green'
                                }">{{ statusInfo.action }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Countdown -->
                    <div v-if="outageState !== 'past'"
                        class="px-6 py-4 sm:px-8 bg-white/[0.02] border-b border-white/[0.06]">
                        <div class="flex items-center justify-between">
                            <span class="text-white/60 text-sm">{{ outageState === 'upcoming' ? 'Starts in' : 'Ends in'
                                }}</span>
                            <ClientOnly>
                                <vue-countdown v-slot="{ days, hours, minutes, seconds }" :time="timeDifference"
                                    class="text-white font-mono text-base sm:text-lg tracking-wide">
                                    <span v-if="days > 0">{{ days }}d </span>{{ hours }}h {{ minutes }}m {{ seconds }}s
                                </vue-countdown>
                                <template #fallback>
                                    <span class="text-white/40">--:--:--</span>
                                </template>
                            </ClientOnly>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="px-6 py-5 sm:px-8 sm:py-6">
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <div class="text-xs uppercase tracking-wider text-white/40 mb-1.5">Date</div>
                                    <div class="text-white text-lg">{{ formatDate(new Date(selectedOutage.from)) }}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-xs uppercase tracking-wider text-white/40 mb-1.5">Time</div>
                                    <div class="text-white text-lg font-medium">
                                        {{ selectedOutage.from.slice(11, 16) }} – {{ selectedOutage.to.slice(11, 16) }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="text-xs uppercase tracking-wider text-white/40 mb-1.5">Affected Areas</div>
                                <div class="text-white/80 leading-relaxed">{{ selectedOutage.streets }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 pt-6 border-t border-white/10 flex items-end justify-between gap-2">
                    <div class="flex flex-col items-start gap-1.5 sm:gap-2">
                        <span class="text-[11px] sm:text-xs text-white/40">Add to calendar</span>
                        <div class="flex gap-1.5">
                            <a :href="googleCalendarUrl" target="_blank" rel="noopener noreferrer"
                                :data-umami-event="ANALYTICS_EVENTS.OUTAGE_SAVE_GOOGLE_CALENDAR"
                                class="px-3 py-2 text-xs font-medium text-white/70 bg-white/8 rounded-md hover:bg-white/15 hover:text-white/90 transition-colors">
                                Google
                            </a>
                            <button @click="handleSaveToCalendar"
                                :data-umami-event="ANALYTICS_EVENTS.OUTAGE_SAVE_CALENDAR"
                                class="cursor-pointer px-3 py-2 text-xs font-medium text-white/70 bg-white/8 rounded-md hover:bg-white/15 hover:text-white/90 transition-colors">
                                .ics
                            </button>
                        </div>
                    </div>

                    <button @click="handleShare" :data-umami-event="ANALYTICS_EVENTS.OUTAGE_SHARE"
                        class="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white/70 bg-white/8 rounded-md hover:bg-white/15 hover:text-white/90 transition-colors">
                        <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>Share</span>
                    </button>
                </div>
            </section>

            <!-- Error state for invalid outage ID -->
            <section v-else class="mb-6">
                <div class="text-center mb-8">
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                        Outage Not Found
                    </h1>
                    <p class="text-white/70 text-lg mb-6">
                        The requested outage information could not be found.
                    </p>
                    <NuxtLink to="/" :data-umami-event="ANALYTICS_EVENTS.OUTAGE_VIEW_CURRENT"
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
                    <NuxtLink to="/" :data-umami-event="ANALYTICS_EVENTS.NAV_HOME_FROM_OUTAGE"
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

        <!-- Hidden OG image preload - warms cache for social sharing -->
        <img v-if="selectedOutage" :src="`/__og-image__/image/outage/${outageId}/og.png`" alt="" width="1" height="1"
            class="absolute opacity-0 pointer-events-none" aria-hidden="true" />
    </div>
</template>
