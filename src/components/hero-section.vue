<template>
  <div class="grid place-items-center h-[100vh] relative">
    <chart-deco class="absolute z-0 bottom-[0] left-0 right-0"
      :data="countPerDate"
      :title="'Detailed timeline'" />

    <div class="flex flex-col gap-24 items-center relative z-10">
      <div class="space-y-10">
        <h1 class="font-bold text-center  ">
          Statistics of power outages in Mauritius
        </h1>
        <p class="text-center ">A detailed day-by-day timeline of when powercuts occurred on the island <span
            class="font-bold underline">
            since 10 March
            2022
          </span></p>

      </div>
      <div class="flex flex-col md:flex-row gap-10">


        <div class="bg-gray-500/10 rounded-lg px-10 py-5 text-right">
          <div class="text-5xl font-black"
            v-if="props.hoursWasted">
            {{ props.hoursWasted }}
          </div>
          <div class=" uppercase font-medium text-white/50">
            Dark Hours
          </div>
        </div>

        <div class="bg-gray-500/10 rounded-lg px-10 py-5 text-right">
          <div class="text-5xl font-black"
            v-if="props.outagesToday">
            {{ props.outagesToday.length }}
          </div>
          <div class=" uppercase font-medium text-white/50">
            cuts today
          </div>
        </div>
      </div>
      <router-link :to="{ name: 'index' }"
        class="bg-white/90 text-blue-700 font-bold hover:bg-white/80 px-10 py-4 rounded-md uppercase cursor-pointer text-lg">
        View today's power cuts
      </router-link>
    </div>


  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  outagesToday: {
    type: Array,
  },
  hoursWasted: {
    type: String,
  },
  countPerDate: {
    type: Array,
  },
});
</script> 