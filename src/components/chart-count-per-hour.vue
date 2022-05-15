<template>
  <div class="">
    <div class="max-w-[90vw] mx-auto md:grid grid-cols-2 items-center gap-24 h-[50vh]">
      <div class="">
        <div v-if="!loading"
          class=" flex flex-col text-blue-500">
          <VueApexCharts type="radar"
            :options="chartOptions"
            :series="series"></VueApexCharts>
        </div>
        <div v-else>Loading data...</div>
      </div>


      <div class="flex flex-col justify-center gap-10 ">
        <h2>
          {{ props.title }}
        </h2>
        <p>
          The worst hour of the day
        </p>
        <blockquote>You might want to postpone standups if they're between 8-9 in the morning !</blockquote>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { labelColor, lineColor } from "@/logic";

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
      return (parseInt(item.x)).toString() + "h";
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
  labels: labels.value,
  dataLabels: {
    enabled: true,
    distributed: true,
    formatter: function (val: any) {
      return val.toString() + " hours";
    },
    style: {
      fontSize: "16px",
      colors: [lineColor],
    }
  },

  tooltip: {
    theme: 'dark',
    style: {
      fontSize: "18px",
    },
  },
  legend: {
    labels: {
      colors: labelColor,
    },
  },
});
</script>
