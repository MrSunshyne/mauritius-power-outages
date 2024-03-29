<template>
  <div class="md:container md:mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-12">
      <div class="md:container md:mx-auto">
        <div
          v-if="!loading"
          class="chart-container flex flex-col text-blue-500"
        >
          <VueApexCharts
            width="100%"
            class="h-full w-full"
            type="treemap"
            :options="chartOptions"
            :series="series"
          ></VueApexCharts>
        </div>
        <div v-else>Loading data...</div>
      </div>

      <div class="flex flex-col justify-center gap-10 ">
        <h2>
          {{ props.title }}
        </h2>
        <p>
          Which day of the week has the most power outages compared to the others?
        </p>
        <blockquote>Sunday is the worst day of the week. You should probably go to the seaside</blockquote>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { labelColor, lineColor, genericConfigs } from '@/logic'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

const loading = ref(false)

const series = computed(() => {
  return [{ data: props.data, name: 'Number of outages' }]
})

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  dataLabels: {
    enabled: true,
    // distributed: true,

  },
  plotOptions: {
    treemap: {
      enableShades: true,
      useFillColorAsStroke: true,
      colorScale: {
        inverse: false,
        ranges: [{
          from: 0,
          to: 50,
          color: lineColor,
        },
        {
          from: 50,
          to: 100,
          color: '#ff0000',
        }],
      },
    },
  },
  xaxis: {
    title: {
      text: 'Day of the Week',
      style: {
        color: labelColor,
      },
    },

  },
  yaxis: {
    title: {
      text: 'Count',
      style: {
        color: labelColor,
      },
    },
    labels: {
      style: {
        colors: labelColor,
      },
    },
  },

})
</script>
