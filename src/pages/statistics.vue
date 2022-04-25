<template>
  <div class="text-white">
    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <h1>Statistics</h1>

    <div class="container mx-auto grid grid-cols-2 gap-10">
      <chart-count-per-date :data="countPerDate" :title="'Count Per Date'" class="col-span-2" />
      <chart-count-per-day :data="countPerDay" :title="'Count Per Day'" />
      <chart-count-per-week :data="countPerWeek" :title="'Count Per Week'" />
      <chart-count-per-district :data="countPerDistrict" :title="'Outages Per District'" />
      <chart-count-per-hour :data="mostAffectedTimeOfDay" :title="'Count Per Hour'" class="col-span-2" />
    </div>

    <!-- <div class="grid grid-cols-2">
      <div class="prose">
        <pre>
          {{ countPerDay }}
      </pre
        >
      </div>
      <div class="prose">
        <pre>
          {{ countPerWeek }}
      </pre
        >
      </div>
      <div class="prose">
        <pre>
          {{ countPerDate }}
      </pre
        >
      </div>
      <div class="prose">
        <pre>
          {{ countPerDistrict }}
      </pre
        >
      </div>
      <div class="prose">
        <pre>
        {{ countPerMonth }}
      </pre
        >
      </div>
      <div class="prose">
        <pre>
        {{ mostAffectedTimeOfDay }}
      </pre
        >
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { Head } from "@vueuse/head";
import { fetchJson } from "@/services/api";
import { useQuery } from "vue-query";
import { flat } from "@/logic";
import { ComputedRef } from "vue";
import { Record } from "@/types";

function getWeek(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = (date.getTime() - firstDay.getTime()) / 86400000 + 1;
  return Math.ceil(dayOfYear / 7);
}

const powerOutageQuery = reactive(useQuery("power-outage-data", () => fetchJson()));

const cFlat: ComputedRef<Record[]> = computed(() => {
  return flat(powerOutageQuery.data);
});

const sortByDate: ComputedRef<Record[]> = computed(() => {
  return cFlat.value.sort((a, b) => {
    return new Date(a.from).getTime() - new Date(b.from).getTime();
  });
});

const countPerWeek: ComputedRef<{ week: string; count: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let date = new Date(outage.from);
    let week = getWeek(date);
    if (occurence[week]) {
      occurence[week] += 1;
    } else {
      occurence[week] = 1;
    }
  }
  for (let week in occurence) {
    result.push({ x: week, y: occurence[week], week, count: occurence[week] });
  }
  return result;
});

const countPerDay: ComputedRef<{ x: string; y: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let date = new Date(outage.from);
    let day = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (occurence[day]) {
      occurence[day] += 1;
    } else {
      occurence[day] = 1;
    }
  }
  for (let day in occurence) {
    result.push({ day, count: occurence[day], x: day, y: occurence[day] });
  }
  return result;
});

const countPerDate: ComputedRef<{ day: string; count: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let date = new Date(outage.from);
    let day = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (occurence[day]) {
      occurence[day] += 1;
    } else {
      occurence[day] = 1;
    }
  }
  for (let day in occurence) {
    result.push({ x: day, y: occurence[day], day, count: occurence[day] });
  }
  return result;
});

const countPerMonth: ComputedRef<{ month: string; count: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let date = new Date(outage.from);
    let month = date.toLocaleDateString("en-US", {
      month: "long",
    });
    if (occurence[month]) {
      occurence[month] += 1;
    } else {
      occurence[month] = 1;
    }
  }
  for (let month in occurence) {
    result.push({ month, count: occurence[month] });
  }
  return result;
});

const countPerDistrict: ComputedRef<{ district: string; count: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let district = outage.district;
    if (occurence[district]) {
      occurence[district] += 1;
    } else {
      occurence[district] = 1;
    }
  }
  for (let district in occurence) {
    result.push({ x: district, y: occurence[district], district, count: occurence[district] });
  }
  return result;
});

const mostAffectedTimeOfDay: ComputedRef<{ hour: string; count: number }[]> = computed(() => {
  let occurence = {} as { [key: string]: number };
  let result = [];
  for (let outage of sortByDate.value) {
    let date = new Date(outage.from);
    let hour = date.getHours();
    if (occurence[hour]) {
      occurence[hour] += 1;
    } else {
      occurence[hour] = 1;
    }
  }
  for (let hour in occurence) {
    result.push({ hour, count: occurence[hour], x: hour, y: occurence[hour] });
  }
  return result;
});
</script>

<style lang="postcss" scoped>
h1 {
  @apply text-2xl font-bold;
}
</style>
