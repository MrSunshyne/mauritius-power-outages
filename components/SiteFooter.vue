<script setup lang="ts">
import { ANALYTICS_EVENTS } from '~/constants/analytics'
</script>

<template>
  <div class="border-t border-white/10 pt-6">
    <div class="grid grid-cols-2 gap-4 text-sm text-white/70 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
      <NuxtLink to="/statistics" class="link" :data-umami-event="ANALYTICS_EVENTS.FOOTER_STATISTICS">
        <Icon name="carbon:chart-cluster-bar" class="w-4 h-4" />
        <span>Statistics</span>
      </NuxtLink>
      <a href="https://github.com/MrSunshyne/mauritius-dataset-electricity" class="link" :data-umami-event="ANALYTICS_EVENTS.FOOTER_DATA_SOURCE">
        <Icon name="carbon:data-base" class="w-4 h-4" />
        <span>Data Source</span>
      </a>
      <a href="https://sandeep.ramgolam.com" class="link" :data-umami-event="ANALYTICS_EVENTS.FOOTER_AUTHOR">
        <Icon name="carbon:paint-brush" class="w-4 h-4" />
        <span>Made by Sandeep</span>
      </a>
      <a href="https://github.com/MrSunshyne/mauritius-power-outages" class="link" :data-umami-event="ANALYTICS_EVENTS.FOOTER_SOURCE_CODE">
        <Icon name="carbon:logo-github" class="w-4 h-4" />
        <span>Source Code</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(255 255 255 / 0.6);
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.link:hover {
  color: white;
}

.link svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
