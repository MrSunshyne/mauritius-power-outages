<template>
  <div>
    <Card :enabled-classes="''">
      <div class="text-center space-y-10">
        <h2>
          {{ props.title }}
        </h2>
        <p>Daily outages across the island, with a 30-day average showing the trend. Drag on the chart to zoom in.</p>
      </div>
      <div class="md:container md:mx-auto">
        <div
          v-if="!loading"
          class="chart-container flex flex-col text-blue-500"
        >
          <ClientOnly>
            <VueApexCharts
              type="line"
              height="420"
              :options="chartOptions"
              :series="series"
            />
            <template #fallback>
              <div class="h-[420px] flex items-center justify-center">Loading chart...</div>
            </template>
          </ClientOnly>
        </div>
        <div v-else>Loading data...</div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, lineColor, axisColor, genericConfigs } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  average?: any[]
  title: string
}>()

const loading = ref(false)

const series = computed(() => {
  return [
    { name: 'Daily outages', type: 'area', data: props.data },
    { name: '30-day average', type: 'line', data: props.average ?? [] },
  ]
})

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  chart: {
    type: 'line',
    foreColor: labelColor,
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        pan: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        reset: true,
      },
      autoSelected: 'zoom',
    },
    zoom: {
      enabled: true,
      autoScaleYaxis: true,
    },
  },
  colors: [lineColor, '#ffffff'],
  fill: {
    type: ['gradient', 'solid'],
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      colorStops: [
        {
          offset: 0,
          color: 'red',
          opacity: 1,
        },
        {
          offset: 10,
          color: lineColor,
          opacity: 1,
        },
        {
          offset: 80,
          color: lineColor,
          opacity: 0.8,
        },
        {
          offset: 100,
          color: lineColor,
          opacity: 0.2,
        },
      ],
    },
  },
  stroke: {
    width: [1.5, 3],
    curve: 'smooth',
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    labels: {
      colors: labelColor,
    },
  },
  tooltip: {
    theme: 'dark',
    shared: true,
    x: {
      format: 'dd MMM yyyy',
    },
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: 'Date',
      style: {
        color: labelColor,
      },
    },
    axisBorder: {
      color: axisColor,
    },
    labels: {
      style: {
        colors: labelColor,
      },
    },
  },
  yaxis: {
    title: {
      text: 'Outages per day',
      style: {
        color: labelColor,
      },
    },
    labels: {
      formatter: (val: number) => String(Math.round(val)),
      style: {
        colors: labelColor,
      },
    },
  },
})
</script>
