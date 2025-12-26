<template>
  <div>
    <div class="max-w-[90vw] mx-auto md:grid grid-cols-2 items-center gap-24 h-[50vh]">
      <div>
        <div
          v-if="!loading"
          class="flex flex-col text-blue-500"
        >
          <ClientOnly>
            <VueApexCharts
              type="radar"
              :options="chartOptions"
              :series="series"
            />
            <template #fallback>
              <div class="h-[350px] flex items-center justify-center">Loading chart...</div>
            </template>
          </ClientOnly>
        </div>
        <div v-else>Loading data...</div>
      </div>

      <div class="flex flex-col justify-center gap-10">
        <h2>
          {{ props.title }}
        </h2>
        <p>
          The worst hour of the day
        </p>
        <blockquote>You might want to postpone standups if they're between 8-9 in the morning !</blockquote>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, lineColor } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  title: string
}>()

const loading = ref(false)

function xyToLabelSeries(data: any[]) {
  return {
    series: data.map(item => item.y),
    labels: data.map((item) => {
      return `${(parseInt(item.x)).toString()}h`
    }),
  }
}

const series = computed(() => {
  return [{ data: props.data, name: 'Number of outages' }]
})

const labels = computed(() => {
  return xyToLabelSeries(props.data).labels
})

const chartOptions: ApexOptions = reactive({
  labels: labels.value,
  dataLabels: {
    enabled: true,
    distributed: true,
    formatter(val: any) {
      return `${val.toString()} hours`
    },
    style: {
      fontSize: '16px',
      colors: [lineColor],
    },
  },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '18px',
    },
  },
  legend: {
    labels: {
      colors: labelColor,
    },
  },
})
</script>
