<template>
  <div class="border-t border-white/10 pt-6">
    <div class="grid grid-cols-2 gap-4 text-sm text-white/70 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
      <router-link :to="{ name: 'statistics' }" class="link">
        <carbon-chart-cluster-bar />
        <span>Statistics</span>
      </router-link>
      <a href="https://github.com/MrSunshyne/mauritius-dataset-electricity" class="link">
        <carbon-data-base />
        <span>Data Source</span>
      </a>
      <a href="https://sandeep.ramgolam.com" class="link">
        <carbon-paint-brush />
        <span>Made by Sandeep</span>
      </a>
      <a href="https://github.com/MrSunshyne/mauritius-power-outages" class="link">
        <carbon-logo-github />
        <span>Source Code</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.link {
  @apply flex items-center gap-2 text-white/60 hover:text-white transition-colors;
}

.link svg {
  @apply w-4 h-4 flex-shrink-0;
}
</style>
