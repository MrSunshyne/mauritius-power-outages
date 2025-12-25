<script setup lang="ts">
import { Head } from '@vueuse/head'
import { useQuery } from 'vue-query'
import { ComputedRef } from 'vue'
import { addDays, startOfDay, format } from 'date-fns'
import { fetchLatestJson, fetchFullJson } from '@/services/api'
import { filterByDate, flat } from '@/logic'
import { Record } from '@/types'

const latestQuery = reactive(useQuery(
  'power-outage-latest',
  () => fetchLatestJson(),
))

const fullQuery = reactive(useQuery(
  'power-outage-full',
  () => fetchFullJson(),
  { enabled: false },
))

const selectedDate = ref(new Date())
const isLoadingHistory = ref(false)

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

const cFlat: ComputedRef<Record[]> = computed(() => {
  if (isCurrentOrFuture.value) {
    return flat(latestQuery.data)
  }
  return flat(fullQuery.data)
})

const cToday: ComputedRef<Record[]> = computed(() => {
  return filterByDate(cFlat.value, new Date())
})

const cTomorrow: ComputedRef<Record[]> = computed(() => {
  return filterByDate(cFlat.value, addDays(new Date(), 1))
})

const cSelected: ComputedRef<Record[]> = computed(() => {
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
    return latestQuery.isFetching
  }
  return fullQuery.isFetching
})

const goToPrev = async () => {
  const newDate = addDays(selectedDate.value, -1)
  const willBeHistory = startOfDay(newDate).getTime() < startOfDay(new Date()).getTime()

  if (willBeHistory && !fullQuery.data) {
    isLoadingHistory.value = true
    await fullQuery.refetch()
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
  } else {
    selectedDate.value = addDays(selectedDate.value, 1)
  }
}

</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 flex-1 flex flex-col">

    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <header class="mb-6 sm:mb-8 flex items-baseline justify-between gap-3">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">Power Outages in Mauritius</h1>
      <div class="flex-shrink-0">
        <ViewCounter />
      </div>
    </header>

    <main class="flex flex-col gap-6 sm:gap-8">
      <!-- Desktop nav -->
      <div class="hidden sm:flex sm:items-center sm:justify-between">
        <h2 v-if="!isToday" class="text-xl sm:text-2xl md:text-3xl font-bold text-white">{{ dateLabel }}</h2>
        <h2 v-else class="text-xl sm:text-2xl md:text-3xl font-bold text-white">Today</h2>
        <div class="flex gap-2">
          <button @click="goToPrev" class="btn" :disabled="isLoading">Prev</button>
          <button v-if="!isToday" @click="goToToday" class="btn" :disabled="isLoading">Today</button>
          <button v-if="!isToday" @click="goToNext" class="btn" :disabled="isLoading">Next</button>
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
              <CellGroup v-if="cToday.length > 0" :data="cToday"></CellGroup>
              <div v-else class="py-8 text-white/50 text-center text-base">
                No power outages scheduled for today
              </div>
            </section>

            <section>
              <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Tomorrow</h2>
              <CellGroup v-if="cTomorrow.length > 0" :data="cTomorrow"></CellGroup>
              <div v-else class="py-8 text-white/50 text-center text-base">
                No power outages scheduled for tomorrow
              </div>
            </section>
          </div>
        </template>

        <!-- Other dates: show single day -->
        <template v-else>
          <CellGroup v-if="cSelected.length > 0" :data="cSelected"></CellGroup>
          <div v-else class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg">
            No power outages scheduled for this day
          </div>
        </template>
      </div>
    </main>

    <footer class="mt-auto pt-8 pb-24 sm:pb-0">
      <site-footer />
    </footer>

    <!-- Mobile sticky nav -->
    <nav class="fixed bottom-0 left-0 right-0 sm:hidden mobile-nav">
      <div class="max-w-4xl mx-auto px-4 py-3 flex gap-2">
        <button @click="goToPrev" class="btn-mobile" :disabled="isLoading">
          <span class="text-lg">←</span>
          <span>Prev</span>
        </button>
        <button @click="goToToday" class="btn-mobile" :disabled="isToday || isLoading">
          <span class="text-lg">•</span>
          <span>Today</span>
        </button>
        <button @click="goToNext" class="btn-mobile" :disabled="isToday || isLoading">
          <span>Next</span>
          <span class="text-lg">→</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="postcss">
.btn {
  @apply px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-lg;
  @apply hover:bg-white/20 active:bg-white/25 transition-colors;
}

.btn:disabled {
  @apply opacity-40 cursor-not-allowed hover:bg-white/10 active:bg-white/10;
}

.mobile-nav {
  @apply bg-black/80 backdrop-blur-xl border-t border-white/10;
  padding-bottom: env(safe-area-inset-bottom);
}

.btn-mobile {
  @apply flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-white rounded-xl;
  @apply bg-white/10 active:bg-white/20 transition-colors;
}

.btn-mobile:disabled {
  @apply opacity-40 active:bg-white/10;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
