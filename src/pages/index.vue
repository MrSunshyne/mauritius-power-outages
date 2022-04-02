<script setup lang="ts">
import { Head } from '@vueuse/head'
import { fetchJson } from '@/services/api';
import { useQuery } from 'vue-query';
import { filterByToday, filterByAfterToday, flat } from '@/logic'
import { ComputedRef } from 'vue';
import { Record } from '@/types'

const powerOutageQuery = reactive(useQuery(
  'power-outage-data',
  () => fetchJson(),
))

const cFlat: ComputedRef<Record[]> = computed(() => {
  return flat(powerOutageQuery.data)
})

const cToday: ComputedRef<Record[]> = computed(() => {
  let real = filterByToday(cFlat.value)
  let fake = {
    "date": "Le samedi 2 avril 2022 de  08:30:00 à  15:00:00",
    "locality": "Roche Bois (Sample)",
    "streets": "Abbatoir Road",
    "district": "portlouis",
    "from": "2022-04-02T04:30:00.000Z",
    "to": "2022-04-02T20:00:00.000Z",
    "id": "c33ebe9c075be561b0ea85cae0bbaabf"
  }
  return { fake, ...real }
})

const cFuture: ComputedRef<Record[]> = computed(() => {
  return filterByAfterToday(cFlat.value)
})

</script>

<template>
  <div class="grid grid-cols-1 text-left gap-10 max-w-4xl mx-auto">
    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <h1>Power Outages in Mauritius</h1>

    <div v-if="powerOutageQuery.isFetching">loading...</div>
    <div v-else>
      <div class="grid gap-10">
        <h2>Today</h2>
        <CellGroup :data="cToday"></CellGroup>
        <h2>Tomorrow</h2>
        <CellGroup :data="cFuture"></CellGroup>
      </div>
      <!-- <List :data="powerOutageQuery.data"></List> -->
    </div>
    <div class="text-sm text-center text-white">
      A project by
      <a class="underline" href="https://sandeep.ramgolam.com">Sandeep Ramgolam</a>
    </div>
  </div>
</template> 

<style scoped>
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
