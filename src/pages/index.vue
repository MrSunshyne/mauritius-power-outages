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
  return filterByToday(cFlat.value)
})

const cFuture: ComputedRef<Record[]> = computed(() => {
  return filterByAfterToday(cFlat.value)
})

</script>

<template>
  <div class="grid grid-cols-1 text-left gap-10 max-w-7xl mx-auto shadow">
    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <div v-if="powerOutageQuery.isFetching">loading...</div>
    <div v-else>
      today
      <pre>
        {{ cToday }}
      </pre>future
      <pre>
        {{ cFuture }}
      </pre>
      <List :data="powerOutageQuery.data"></List>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
