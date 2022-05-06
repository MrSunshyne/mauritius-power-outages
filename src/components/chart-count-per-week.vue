<template>

  <Card>
    <template #title>
      <h2>
        {{ props.title }}
      </h2>
    </template>
    <div class="container mx-auto">
      <div v-if="!loading"
        class="chart-container flex flex-col text-blue-500">
        <VueApexCharts width="100%"
          class="h-full w-full"
          type="bar"
          :options="chartOptions"
          :series="series"></VueApexCharts>
      </div>
      <div v-else>Loading data...</div>
    </div>
  </Card>

</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { genericConfigs, labelColor, lineColor } from "@/logic";

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
  xaxis: {
    title: {
      text: "Day of the Week",
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
  plotOptions: {
    bar: {
      colors: {
        backgroundBarColors: [lineColor],
      }
    }
  }
});
</script>
