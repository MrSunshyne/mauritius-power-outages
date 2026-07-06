<template>
  <div class="text-center space-y-4 pt-10 px-4">
    <p class="uppercase tracking-[0.35em] text-xs font-semibold text-[#008FFB]">
      {{ props.kicker }}
    </p>
    <h2 class="text-3xl md:text-5xl font-black">
      {{ props.title }}
    </h2>
    <p v-if="props.subtitle" class="text-white/50 max-w-xl mx-auto">
      {{ props.subtitle }}
    </p>
    <div class="w-16 h-px bg-white/20 mx-auto !mt-8" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  kicker: string
  title: string
  subtitle?: string
}>()
</script>
