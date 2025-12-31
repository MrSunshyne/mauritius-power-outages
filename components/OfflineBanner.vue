<script setup lang="ts">
const online = useOnline()
</script>

<template>
  <Transition name="slide-down">
    <div 
      v-if="!online" 
      class="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-3 text-center text-sm font-medium shadow-lg"
    >
      <Icon name="carbon:wifi-off" class="inline-block mr-2 -mt-0.5" />
      You're offline. Please check your connection to see the latest outages.
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
