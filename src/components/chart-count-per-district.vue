<template>
  <div>
    <Card :enabled-classes="''">
      <!-- <template #title>
        <h2>
          {{ props.title }}
        </h2>
      </template> -->

      <div class="text-center space-y-10">
        <h2 class="">
          {{ props.title }}
        </h2>
        <p>Which areas are most affected ?</p>
      </div>
      <div class="md:container md:mx-auto">
        <div
          v-if="!loading"
          class="chart-container flex flex-col text-blue-500"
        >
          <VueApexCharts
            width="100%"
            class="h-full w-full"
            type="bar"
            :options="chartOptions"
            :series="series"
          ></VueApexCharts>
        </div>
        <div v-else>Loading data...</div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { ApexOptions } from 'apexcharts'
import { labelColor, genericConfigs, lineColor } from '@/logic'

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
  },
  xaxis: {
    title: {
      text: 'Day of the Week',
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
  plotOptions: {
    bar: {
      colors: {
        backgroundBarColors: [lineColor],
        backgroundBarOpacity: 0.2,
      },
    },
  },

})
</script>
