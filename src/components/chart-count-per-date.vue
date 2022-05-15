<template>
  <div>
    <Card :enabledClasses="''">
      <!-- <template #title>
        <h2>
          {{ props.title }}
        </h2>
      </template> -->

      <div class="text-center space-y-10">
        <h2 class="">
          {{ props.title }}
        </h2>
        <p>A detailed day-by-day timeline of when powercuts occurred on the island</p>
      </div>
      <div class="md:container md:mx-auto">
        <div v-if="!loading"
          class="chart-container flex flex-col text-blue-500">
          <VueApexCharts type="line"
            :options="chartOptions"
            :series="series"></VueApexCharts>
        </div>
        <div v-else>Loading data...</div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { labelColor, lineColor, axisColor, genericConfigs } from "@/logic";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

let loading = ref(false);

let series = computed(() => {
  return [{ data: props.data, name: "Number of outages" }];
});

let chartOptions: ApexOptions = reactive({
  ...genericConfigs,
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      type: "vertical",
      colorStops: [
        {
          offset: 0,
          color: "red",
          opacity: 1
        },

        {
          offset: 10,
          color: lineColor,
          opacity: 1
        },
        {
          offset: 80,
          color: lineColor,
          opacity: 0.8
        },
        {
          offset: 100,
          color: lineColor,
          opacity: 0.2
        }
      ]
    }
  },
  stroke: {
    width: 5,
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    title: {
      text: "Day of the Week",
      style: {
        color: labelColor,
      },
    },
    axisBorder: {
      color: axisColor
    },
    labels: {
      style: {
        colors: labelColor
      }
    }
  },
  yaxis: {
    title: {
      text: "Count",
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

});
</script>
