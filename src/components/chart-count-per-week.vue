<template>
  <div class="container mx-auto">
    <h2>
      {{ props.title }}
    </h2>
    <div v-if="!loading" class="chart-container flex flex-col text-blue-500">
      <VueApexCharts
        width="100%"
        class="h-full w-full"
        type="bar"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </div>
    <div v-else>Loading data...</div>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";

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

let labels = {
  style: {
    colors: "#fff",
  },
};

let chartOptions: ApexOptions = reactive({
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    title: {
      text: "Day of the Week",
      style: {
        color: "#fff",
      },
    },
    labels,
  },
  yaxis: {
    title: {
      text: "Count",
      style: {
        color: "#fff",
      },
    },
    labels,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    floating: false,
  },
});
</script>
