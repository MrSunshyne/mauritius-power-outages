<template>

  <Card>
    <template #title>
      <h2>
        {{ props.title }}
      </h2>
    </template>
    <div class="container mx-auto p-24">
      <div v-if="!loading"
        class="chart-container flex flex-col text-blue-500">
        <VueApexCharts width="100%"
          class="h-full w-full"
          type="radar"
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
import { labelColor } from "@/logic";

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

function xyToLabelSeries(data: any[]) {
  return {
    series: data.map((item) => item.y),
    labels: data.map((item) => {
      return (parseInt(item.x) + 1).toString() + "h";
    }),
  };
}

let series = computed(() => {
  return [{ data: props.data, name: "Number of outages" }];
  // return xyToLabelSeries(props.data).series;
});

let labels = computed(() => {
  // return [{ data: props.data, name: "Number of outages" }];
  return xyToLabelSeries(props.data).labels;
});

let chartOptions: ApexOptions = reactive({
  chart: {
    type: "polarArea",
    // logarithmic: true,
  },
  labels: labels,
  dataLabels: {
    enabled: true,
  },
  tooltip: {
    style: {
      fontSize: "22px",
    },
  },
  legend: {

    labels: {
      colors: labelColor,
    },
  },
});
</script>
