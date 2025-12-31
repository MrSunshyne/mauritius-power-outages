<script setup lang="ts">
const { $pwa } = useNuxtApp()
const { track } = useAnalytics()

const showUpdate = computed(() => {
  return $pwa?.needRefresh
})

// Track when update is available
watch(showUpdate, (newValue) => {
  if (newValue) {
    track('pwa-update-available')
  }
})

const update = () => {
  track('pwa-update-accepted')
  $pwa?.updateServiceWorker()
}

const dismiss = () => {
  track('pwa-update-dismissed')
  // Close the prompt but don't update
  $pwa?.close?.()
}
</script>

<template>
  <Transition name="slide-up">
    <div 
      v-if="showUpdate"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-emerald-600 text-white rounded-lg shadow-xl p-4"
    >
      <div class="flex items-center gap-3">
        <Icon name="carbon:update-now" class="w-6 h-6 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-medium text-sm">Update available</p>
          <p class="text-xs text-emerald-100 mt-0.5">Refresh to get the latest version</p>
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <button 
          @click="dismiss"
          class="flex-1 px-3 py-2 text-sm text-emerald-100 hover:text-white transition-colors"
        >
          Later
        </button>
        <button 
          @click="update"
          class="flex-1 px-3 py-2 text-sm bg-white text-emerald-700 hover:bg-emerald-50 rounded-md font-medium transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
