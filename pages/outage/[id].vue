<script setup lang="ts">
import { format } from 'date-fns'
import { filterByDate, flat } from '~/utils/filters'
import { API_URLS } from '~/utils/api'
import type { Record } from '~/types'

// Get outage ID from route
const route = useRoute()
const outageId = route.params.id as string

// Page meta
definePageMeta({
  layout: 'default',
})

// SSR-compatible data fetching using useAsyncData
// This runs on both server and client, enabling dynamic OG tags
const { data: latestData, status: latestStatus } = await useAsyncData<{ today: Record[], future: Record[] }>(
  'latest-outages',
  async () => {
    const response = await $fetch<string>(API_URLS.latest)
    return typeof response === 'string' ? JSON.parse(response) : response
  },
  { server: true }
)

// Check if outage exists in latest data
const outageInLatest = computed(() => {
  if (!latestData.value) return null
  return flat(latestData.value).find(o => o.id === outageId)
})

// Fetch historical data only if outage not found in latest (lazy load on client)
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
  ogUrl: `https://power-outages-mauritius.netlify.app/outage/${outageId}`,
  ogImage: 'https://power-outages-mauritius.netlify.app/og/outage.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => selectedOutage.value 
    ? `Power outage details for ${selectedOutage.value.locality}, Mauritius`
    : 'Power outage details for Mauritius',
  ogSiteName: 'Power Outages Mauritius',
  ogLocale: 'en_MU',
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  twitterImage: 'https://power-outages-mauritius.netlify.app/og/outage.png',
  twitterImageAlt: () => selectedOutage.value 
    ? `Power outage details for ${selectedOutage.value.locality}, Mauritius`
    : 'Power outage details for Mauritius',
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
            Power Outage Details
          </h1>
          <p class="text-white/70 text-lg">
            Information for the shared outage
          </p>
        </div>

        <div class="bg-white/5 rounded-xl p-6 sm:p-8 border border-white/10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 rounded-full bg-orange-500"></div>
            <h2 class="text-xl sm:text-2xl font-bold text-white">{{ selectedOutage.locality }}</h2>
          </div>

          <div class="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <div class="text-white/70 mb-1">Date & Time</div>
              <div class="text-white font-medium">
                {{ formatDate(new Date(selectedOutage.from)) }}
              </div>
              <div class="text-white/70 text-sm mt-1">
                {{ selectedOutage.from.slice(11, 16) }} - {{ selectedOutage.to.slice(11, 16) }}
              </div>
            </div>

            <div>
              <div class="text-white/70 mb-1">Areas Affected</div>
              <div class="text-white font-medium">{{ selectedOutage.streets }}</div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-white/10">
            <div class="text-white/70 text-sm">
              District: {{ selectedOutage.district }}
            </div>
            <div class="text-white/70 text-sm">
              ID: {{ selectedOutage.id.slice(0, 8) }}...
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
          <NuxtLink
            to="/"
            class="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Current Outages
          </NuxtLink>
        </div>
      </section>

      <!-- Current outages section -->
      <section class="space-y-8">
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            Current Power Outages
          </h2>
          <p class="text-white/70">
            Latest information for today and tomorrow
          </p>
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

        <div v-else class="text-center py-8 text-white/50">
          No power outages scheduled for today
        </div>

        <!-- Link to main page -->
        <div class="text-center pt-8">
          <NuxtLink
            to="/"
            class="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View All Outages
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