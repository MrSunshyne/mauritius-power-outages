<template>
  <div>
    <div
      v-if="!loading"
      class="chart-container flex flex-col text-blue-500"
    >
      <ClientOnly>
        <VueApexCharts
          ref="chart"
          type="line"
          height="800px"
          :options="chartOptions"
          :series="series"
        />
        <template #fallback>
          <div class="h-[800px] flex items-center justify-center">Loading chart...</div>
        </template>
      </ClientOnly>
    </div>
    <div v-else>Loading data...</div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, lineColor, axisColor, genericConfigs } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  title: string
}>()

const loading = ref(false)

const series = computed(() => {
  return [{ data: props.data, name: 'Number of outages' }]
})

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    enabled: false,
  },
  animations: {
    enabled: true,
    easing: 'linear',
    dynamicAnimation: {
      speed: 1000,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.5,
      type: 'vertical',
      colorStops: [
        {
          offset: 0,
          color: lineColor,
          opacity: 1,
        },
        {
          offset: 100,
          color: 'transparent',
          opacity: 0,
        },
      ],
    },
  },
  stroke: {
    width: 5,
    curve: 'smooth',
  },
  xaxis: {
    type: 'datetime',
    axisTicks: {
      show: false,
    },
    axisBorder: {
      color: axisColor,
      show: false,
    },
    labels: {
      show: false,
      style: {
        colors: labelColor,
      },
    },
    show: false,
  },
  yaxis: {
    show: false,
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
