<script setup lang="ts">
const { updateRequired, updateMessage } = useAppVersion()
</script>

<template>
  <!-- Force update overlay - cannot be dismissed -->
  <div 
    v-if="updateRequired" 
    class="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-4"
  >
    <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm text-center">
      <Icon name="carbon:update-now" class="w-12 h-12 mx-auto text-blue-500 mb-4" />
      <h2 class="text-lg font-semibold mb-2">Update Required</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {{ updateMessage }}
      </p>
      <p class="text-xs text-slate-500">
        The app will refresh automatically...
      </p>
    </div>
  </div>

  <!-- PWA Install and Update Prompts -->
  <PwaInstallPrompt />
  <PwaUpdatePrompt />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
