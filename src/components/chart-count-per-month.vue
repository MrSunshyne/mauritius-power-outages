<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-2 gap-24">
      <div class="flex flex-col justify-center items-end gap-10 text-right ">
        <h2>
          {{ props.title }}
        </h2>
        <p>
          The total amount of outages each month
        </p>
      </div>
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
    </div>
  </div>

</template> 

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ApexOptions } from "apexcharts";
import { labelColor, genericConfigs, lineColor } from "@/logic";

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
    }
  },
  plotOptions: {
    bar: {
      colors: {
        backgroundBarColors: [lineColor],
        backgroundBarOpacity: 0.2,
      },
    }
  }

});
</script>
