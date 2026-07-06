<template>
  <div class="md:container md:mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 md:gap-24 gap-12">
      <div class="flex flex-col justify-center items-end gap-10 text-center md:text-right">
        <h2>
          {{ props.title }}
        </h2>
        <p>
          Total outages per calendar month, across all years
        </p>
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { labelColor, genericConfigs } from '~/composables/useChartConfig'

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
  plotOptions: {
    bar: {
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val.toLocaleString('en-US'),
  },
  xaxis: {
    title: {
      text: 'Month',
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
