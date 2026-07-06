<template>
  <div>
    <div class="max-w-[90vw] mx-auto md:grid grid-cols-2 items-center gap-24">
      <div>
        <div
          v-if="!loading"
          class="flex flex-col text-blue-500"
        >
          <ClientOnly>
            <VueApexCharts
              type="bar"
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
        <blockquote v-if="props.insight">{{ props.insight }}</blockquote>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, genericConfigs, highlightColor, barColor } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  title: string
  insight?: string
}>()

const loading = ref(false)

// Highlight the peak hour so the chart and the insight tell the same story
const series = computed(() => {
  const max = Math.max(...props.data.map(item => item.y))
  return [{
    name: 'Number of outages',
    data: props.data.map(item => ({ ...item, fillColor: item.y === max && max > 0 ? highlightColor : barColor })),
  }]
})

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  plotOptions: {
    bar: {
      borderRadius: 3,
    },
  },
  xaxis: {
    tickAmount: 12,
    title: {
      text: 'Hour of the day (Mauritius time)',
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
      text: 'Outages',
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
