<script setup lang="ts">
import { startOfDay, format } from 'date-fns'
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

// Dynamic SEO based on outage data
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

// Update head when data loads (only in production for OG tags)
if (process.dev) {
  // In dev mode, just set a basic title
  useHead({
    title: 'Power Outage Details - Mauritius',
  })
} else {
  // In production, set dynamic OG tags
  watch([selectedOutage, description], () => {
    useHead({
      title: title.value,
      meta: [
        { name: 'description', content: description.value },
        { property: 'og:title', content: title.value },
        { property: 'og:description', content: description.value },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `https://power-outages-mauritius.netlify.app/outage/${outageId}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title.value },
        { name: 'twitter:description', content: description.value },
      ],
    })
  }, { immediate: true })
}

// Data fetching
const latestData = ref<{ today: Record[], future: Record[] } | null>(null)
const fullData = ref<any>(null)
const latestStatus = ref<'idle' | 'pending' | 'success' | 'error'>('pending')
const isLoadingHistory = ref(false)

// Fetch data on mount
onMounted(async () => {
  // Always fetch latest data
  latestStatus.value = 'pending'
  try {
    const response = await $fetch<string>(API_URLS.latest)
    const data = typeof response === 'string' ? JSON.parse(response) : response
    latestData.value = data
    latestStatus.value = 'success'
  } catch (e) {
    console.error('Failed to fetch latest data:', e)
    latestStatus.value = 'error'
  }

  // If outage not found in latest data, fetch historical data
  const allCurrentOutages = flat(latestData.value)
  const foundOutage = allCurrentOutages.find(o => o.id === outageId)

  if (!foundOutage) {
    console.log('Outage not found in current data, fetching historical...')
    isLoadingHistory.value = true
    try {
      const response = await $fetch<string>(API_URLS.full)
      fullData.value = typeof response === 'string' ? JSON.parse(response) : response
    } catch (e) {
      console.error('Failed to fetch historical data:', e)
    } finally {
      isLoadingHistory.value = false
    }
  }
})

// Computed properties
const allOutages = computed(() => {
  const outages = []
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

const currentOutages = computed(() => {
  return latestData.value ? flat(latestData.value) : []
})

const todayOutages = computed(() => {
  return currentOutages.value ? filterByDate(currentOutages.value, new Date()) : []
})

const isLoading = computed(() => {
  return latestStatus.value === 'pending' || isLoadingHistory.value
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