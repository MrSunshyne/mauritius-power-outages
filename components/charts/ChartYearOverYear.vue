<template>
  <div>
    <Card :enabled-classes="''">
      <div class="text-center space-y-10">
        <h2>
          {{ props.title }}
        </h2>
        <p>Monthly outages, one line per year — is the situation improving?</p>
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
import { labelColor, genericConfigs } from '~/composables/useChartConfig'

const props = defineProps<{
  data: any[]
  title: string
}>()

const loading = ref(false)

const series = computed(() => props.data)

const chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  chart: {
    toolbar: {
      show: false,
    },
  },
  colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#A78BFA', '#ffffff'],
  stroke: {
    width: 3,
    curve: 'smooth',
  },
  markers: {
    size: 0,
    hover: {
      size: 5,
    },
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
