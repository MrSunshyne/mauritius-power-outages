<template>
  <div>
    <Card :enabled-classes="''">
      <div class="text-center space-y-10">
        <h2>
          {{ props.title }}
        </h2>
        <p>Which areas are most affected ?</p>
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
    </Card>
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
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number, { dataPointIndex }: any) => {
        const hours = props.data[dataPointIndex]?.hours
        const outages = val.toLocaleString('en-US')
        return hours ? `${outages} outages · ${hours.toLocaleString('en-US')} hours lost` : `${outages} outages`
      },
    },
  },
  xaxis: {
    title: {
      text: 'District',
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
