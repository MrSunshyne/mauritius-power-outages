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

const cSelected: ComputedRef<Record[]> = computed(() => {
  return filterByDate(cFlat.value, selectedDate.value)
})

const dateLabel = computed(() => {
  if (isToday.value) return 'Today'
  if (isTomorrow.value) return 'Tomorrow'
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
  selectedDate.value = addDays(selectedDate.value, 1)
}

</script>

<template>
  <div class="px-4 py-10 grid grid-cols-1 text-left gap-10 max-w-4xl mx-auto">

    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <h1>Power Outages in Mauritius</h1>

    <div class="grid gap-10">
      <div class="flex items-center justify-between gap-4">
        <h2>{{ dateLabel }}</h2>
        <div class="flex gap-2">
          <button @click="goToPrev" class="btn" :disabled="isLoading">Prev</button>
          <button @click="goToToday" class="btn" :disabled="isToday || isLoading">Today</button>
          <button @click="goToNext" class="btn" :disabled="isTomorrow || isLoading">Next</button>
        </div>
      </div>

      <div v-if="isLoading" class="py-16 text-white/60 text-center text-xl">
        Loading outage data...
      </div>
      <CellGroup v-else-if="cSelected.length > 0" :data="cSelected"></CellGroup>
      <div v-else class="py-16 text-white/60 text-center text-xl">
        No power outages scheduled for this day
      </div>
    </div>
    <site-footer />
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply text-4xl font-black text-white;
}

h2 {
  @apply text-3xl font-black text-white;
}

.btn {
  @apply px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-white/10;
}

</style>

<route lang="yaml">
meta:
  layout: default
</route>
