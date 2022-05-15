<template>
  <div class="grid place-items-center h-[80vh]">
    <div class="flex flex-col gap-24 items-center">
      <h1 class="font-bold text-center  ">
        Statistic of power outages in Mauritius
      </h1>
      <p class="text-center ">A detailed day-by-day timeline of when powercuts occurred on the island <span
          class="font-bold underline">
          since 10 March
          2022
        </span></p>

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
            Outages today
          </div>
        </div>


      </div>
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
});
</script> 