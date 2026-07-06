<template>
  <div class="md:container md:mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-12">
      <div class="md:container md:mx-auto">
        <div
          v-if="!loading"
          class="chart-container flex flex-col text-blue-500"
        >
          <ClientOnly>
            <VueApexCharts
              width="100%"
              class="h-full w-full"
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
          Which day of the week has the most power outages compared to the others?
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

// Highlight the worst day so the chart and the insight tell the same story
const series = computed(() => {
  const max = Math.max(...props.data.map(item => item.y))
  return [{
    name: 'Number of outages',
    data: props.data.map(item => ({ ...item, fillColor: item.y === max ? highlightColor : barColor })),
  }]
})

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toLocaleString('en-US'),
  },
  xaxis: {
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
  yaxis: {
    labels: {
      style: {
        colors: labelColor,
      },
    },
  },
})
</script>
