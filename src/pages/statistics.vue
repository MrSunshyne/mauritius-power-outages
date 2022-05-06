<template>
  <div class="text-white px-4 py-10 stats-bg ">

    <Head>
      <title>Power Outages - Mauritius</title>
    </Head>

    <h1>Statistics</h1>

    <div class="container mx-auto grid grid-cols-2 gap-24 py-10 text-left">

      <chart-count-per-date class="col-span-2"
        :data="countPerDate"
        :title="'Count Per Date'" />
      <chart-count-per-day :data="countPerDay"
        :title="'Count Per Day'" />
      <chart-count-per-month :data="countPerMonth"
        :title="'Count Per Month'" />
      <chart-count-per-week :data="countPerWeek"
        :title="'Count Per Week'"
        class="col-span-2" />

      <chart-count-per-hour :data="countPerHour"
        :title="'Count Per Hour'"
        class="col-span-2" />
      <chart-count-per-district class="col-span-2"
        :data="countPerDistrict"
        :title="'Outages Per District'" />

    </div>
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
    result.push({
      x: month,
      y: occurence[month],
      month,
      count: occurence[month],
    });
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

const countPerHour: ComputedRef<{ hour: string; count: number }[]> = computed(() => {
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

.stats-bg {
  background: rgb(2, 0, 36);
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgb(0, 44, 125) 100%);
  background-size: cover;
  background-attachment: fixed;
  ;
}
</style>
