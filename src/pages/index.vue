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
  <div class="grid grid-cols-1 text-left gap-10 max-w-7xl mx-auto shadow">
    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <List :data="allData"></List>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
