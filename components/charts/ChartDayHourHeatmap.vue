<template>
  <div>
    <Card :enabled-classes="''">
      <div class="text-center space-y-10">
        <h2>
          {{ props.title }}
        </h2>
        <p>Outages by day of the week and time of day (Mauritius time)</p>
        <blockquote v-if="props.insight" class="mx-auto text-left">{{ props.insight }}</blockquote>
      </div>
      <div class="md:container md:mx-auto">
        <ClientOnly>
          <VueApexCharts
            type="heatmap"
            height="380"
            :options="chartOptions"
            :series="series"
          />
          <template #fallback>
            <div class="h-[380px] flex items-center justify-center">Loading chart...</div>
          </template>
        </ClientOnly>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, genericConfigs, barColor, highlightColor } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  title: string
  insight?: string
}>()

const series = computed(() => props.data)

const maxCount = computed(() => {
  return Math.max(1, ...props.data.flatMap((s: any) => (s.data ?? []).map((point: any) => point.y ?? 0)))
})

// Explicit color bands (dim -> blue -> red) so the hot cells glow on the
// dark background; Apex's default shading would highlight the low ones
const chartOptions = computed<ApexOptions>(() => ({
  ...genericConfigs,
  chart: {
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    width: 2,
    colors: ['#02011a'],
  },
  plotOptions: {
    heatmap: {
      radius: 3,
      enableShades: false,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: '#0d1130', name: 'none' },
          { from: 1, to: maxCount.value * 0.25, color: '#14328c', name: 'low' },
          { from: maxCount.value * 0.25, to: maxCount.value * 0.5, color: '#1d5fd1', name: 'medium' },
          { from: maxCount.value * 0.5, to: maxCount.value * 0.8, color: barColor, name: 'high' },
          { from: maxCount.value * 0.8, to: maxCount.value, color: highlightColor, name: 'peak' },
        ],
      },
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) => `${val.toLocaleString('en-US')} outages`,
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
    labels: {
      style: {
        colors: labelColor,
      },
    },
  },
}))
</script>
