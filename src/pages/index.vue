<script setup lang="ts">
import { Head } from '@vueuse/head'
import { useQuery } from 'vue-query'
import { ComputedRef } from 'vue'
import { fetchJson } from '@/services/api'
import { filterByToday, filterByAfterToday, flat } from '@/logic'
import { Record } from '@/types'

const powerOutageQuery = reactive(useQuery(
  'power-outage-data',
  () => fetchJson(),
))

const cFlat: ComputedRef<Record[]> = computed(() => {
  return flat(powerOutageQuery.data)
})

const cToday: ComputedRef<Record[]> = computed(() => {
  const real = filterByToday(cFlat.value)
  // One line of Data to test the Power Off Animations
  // let fake = {
  //   "date": "Le samedi 2 avril 2022 de  08:30:00 à  15:00:00",
  //   "locality": "Roche Bois (Sample)",
  //   "streets": "Abbatoir Road",
  //   "district": "portlouis",
  //   "from": "2022-04-02T04:30:00.000Z",
  //   "to": "2022-04-16T20:00:00.000Z",
  //   "id": "c33ebe9c075be561b0ea85cae0bbaabf"
  // }
  // return { fake, ...real }
  return real
})

const cFuture: ComputedRef<Record[]> = computed(() => {
  return filterByAfterToday(cFlat.value)
})

</script>

<template>
  <div class="px-4 py-10 grid grid-cols-1 text-left gap-10 max-w-4xl mx-auto">

    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <h1>Power Outages in Mauritius</h1>

    <div v-if="powerOutageQuery.isFetching" class="py-16 text-white text-center text-2xl">loading outage data...</div>
    <div v-else>
      <div class="grid gap-10">
        <h2>Today</h2>
        <CellGroup :data="cToday"></CellGroup>

        <template v-if="cFuture.length > 0">
          <h2>Tomorrow</h2>
          <CellGroup :data="cFuture"></CellGroup>
        </template>
      </div>
      <!-- <List :data="powerOutageQuery.data"></List> -->
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

</style>

<route lang="yaml">
meta:
  layout: default
</route>
