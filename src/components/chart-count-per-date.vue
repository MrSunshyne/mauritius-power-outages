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
      <div class="container mx-auto">
        <div v-if="!loading"
          class="chart-container flex flex-col text-blue-500">
          <VueApexCharts type="area"
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
import { labelColor, axisColor, genericConfigs } from "@/logic";

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
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0
    }
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
