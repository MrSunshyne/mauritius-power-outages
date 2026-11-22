<script setup lang="ts">
const { updateRequired, updateMessage } = useAppVersion()

// Every page names courant.ramgolam.com as its canonical URL (query string dropped),
// so search engines fold the old Netlify URLs and *.pages.dev into it.
const route = useRoute()
const siteConfig = useSiteConfig()
const canonicalUrl = computed(() => new URL(route.path, siteConfig.url).href)
useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] })
useSeoMeta({ ogUrl: canonicalUrl })
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
