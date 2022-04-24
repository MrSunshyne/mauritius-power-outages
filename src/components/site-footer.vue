<template>
  <div
    class="flex flex-col justify-center gap-4 text-center text-sm text-white md:flex-row md:justify-between"
  >
    <a href="https://github.com/MrSunshyne/mauritius-dataset-electricity">
      <router-link :to="{ name: 'statistics' }">
        <carbon-chart-cluster-bar />Statistics
      </router-link>
      <carbon-data-base />Data Source
    </a>

    <a href="https://sandeep.ramgolam.com">
      <carbon-paint-brush />Made by Sandeep Ramgolam
    </a>
    <a href="https://github.com/MrSunshyne/mauritius-power-outages">
      <carbon-logo-github />Source Code
    </a>
  </div>
</template>

<style scoped>
a {
  @apply hover:underline;
}

a svg {
  @apply mr-2 inline-block;
}
</style>
