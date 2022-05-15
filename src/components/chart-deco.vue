<template>
  <div>
    <div v-if="!loading"
      class="chart-container flex flex-col text-blue-500">
      <VueApexCharts type="line"
        ref="chart"
        height="800px"
        :options="chartOptions"
        :series="series"></VueApexCharts>
    </div>
    <div v-else>Loading data...</div>
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
  chart: {
    toolbar: {
      show: false,
    }

  },
  tooltip: {
    enabled: false,
  },
  animations: {
    enabled: true,
    easing: 'linear',
    dynamicAnimation: {
      speed: 1000
    }
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 0.5,
      type: "vertical",
      colorStops: [
        {
          offset: 0,
          color: lineColor,
          opacity: 1
        },

        {
          offset: 100,
          color: "transparent",
          opacity: 0
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

    axisTicks: {
      show: false,
    },

    axisBorder: {
      color: axisColor,
      show: false,

    },
    labels: {
      show: false,
      style: {
        colors: labelColor
      }
    },
    show: false,
  },
  yaxis: {
    show: false,

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
