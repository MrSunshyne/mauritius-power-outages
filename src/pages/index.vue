<script setup lang="ts">
import { Head } from '@vueuse/head'

const API_ENDPOINT = 'https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-electricity/main/data/power-outages.json'

const allData = ref(null);

const getData = () => {
  fetch(API_ENDPOINT)
    .then(res => res.json())
    .then(res => {
      allData.value = res;
    })
    .catch((error) => {
      console.log('Looks like there was a problem: \n', error);
    });
}




onMounted(() => {
  // getPowerOutages()
  getData();

})

</script>

<template>
  <div class="grid grid-cols-2 text-left gap-10 max-w-7xl mx-auto shadow p-8">
    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>
    <div v-for="(district, name) in allData">
      <div class="text-2xl font-medium">{{ name }}</div>
      <div>
        <div v-for="(outage, index) in (district as any)" :key="index">
          {{ outage.locality }}
          {{ outage.date }}
          {{ outage.streets }}
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
