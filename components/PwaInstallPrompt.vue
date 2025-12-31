<script setup lang="ts">
const { $pwa } = useNuxtApp()
const { track } = useAnalytics()

const DISMISS_KEY = 'pwa-install-dismissed'
const INSTALL_KEY = 'pwa-installed'

// Track if user has already installed or dismissed
const wasDismissed = ref(false)
const wasInstalled = ref(false)

// Track engagement
const pageViews = ref(0)
const timeOnSite = ref(0)
const isReturningVisitor = ref(false)

// Check if we should show the prompt
const canShow = computed(() => {
  if (import.meta.server) return false
  if (!$pwa?.showInstallPrompt) return false
  if (wasDismissed.value || wasInstalled.value) return false
  return true
})

const shouldShow = computed(() => {
  if (!canShow.value) return false
  // Show after engagement criteria met
  return pageViews.value >= 3 || timeOnSite.value >= 60 || isReturningVisitor.value
})

// Initialize on client
onMounted(() => {
  wasDismissed.value = !!localStorage.getItem(DISMISS_KEY)
  wasInstalled.value = !!localStorage.getItem(INSTALL_KEY)
  isReturningVisitor.value = !!localStorage.getItem('has-visited')
  localStorage.setItem('has-visited', 'true')
  
  // Track time on site
  const interval = setInterval(() => {
    timeOnSite.value++
  }, 1000)
  
  onUnmounted(() => clearInterval(interval))
})

// Track page views
const route = useRoute()
watch(() => route.fullPath, () => {
  pageViews.value++
}, { immediate: true })

// Track when prompt is shown
watch(shouldShow, (newValue) => {
  if (newValue) {
    track('pwa-install-prompt-shown')
  }
})

// Install action
const install = async () => {
  track('pwa-install-click')
  const installed = await $pwa?.install()
  if (installed) {
    track('pwa-installed')
    localStorage.setItem(INSTALL_KEY, Date.now().toString())
    wasInstalled.value = true
  }
}

// Dismiss action
const dismiss = () => {
  track('pwa-install-dismissed')
  localStorage.setItem(DISMISS_KEY, Date.now().toString())
  wasDismissed.value = true
}
</script>

<template>
  <Transition name="slide-up">
    <div 
      v-if="shouldShow"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-40 bg-slate-800 text-white rounded-lg shadow-xl p-4 border border-slate-700"
    >
      <div class="flex items-start gap-3">
        <img src="/AppImages/android/android-launchericon-192-192.png" alt="" class="w-12 h-12 rounded-lg" />
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm">Install Power Outages</p>
          <p class="text-xs text-slate-400 mt-0.5">Quick access to outage updates</p>
        </div>
        <button 
          @click="dismiss" 
          class="text-slate-400 hover:text-white p-1 -m-1"
          aria-label="Dismiss"
        >
          <Icon name="carbon:close" class="w-5 h-5" />
        </button>
      </div>
      <div class="flex gap-2 mt-3">
        <button 
          @click="dismiss"
          class="flex-1 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Not now
        </button>
        <button 
          @click="install"
          class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-md font-medium transition-colors"
        >
          Install
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
