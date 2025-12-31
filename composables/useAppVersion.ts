interface VersionInfo {
  current: string
  min: string
  forceUpdate?: boolean
  message?: string
}

// App version - update this with each release
export const APP_VERSION = '1.0.0'

export function useAppVersion() {
  const { track } = useAnalytics()
  const isChecking = ref(false)
  const updateRequired = ref(false)
  const updateMessage = ref('')

  // Compare semantic versions: returns -1 if a < b, 0 if equal, 1 if a > b
  const compareVersions = (a: string, b: string): number => {
    const partsA = a.split('.').map(Number)
    const partsB = b.split('.').map(Number)
    
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const numA = partsA[i] || 0
      const numB = partsB[i] || 0
      if (numA < numB) return -1
      if (numA > numB) return 1
    }
    return 0
  }

  const checkForUpdates = async () => {
    if (import.meta.server) return
    
    isChecking.value = true
    
    try {
      // Fetch with cache-busting to always get fresh version info
      const response = await fetch(`/version.json?_=${Date.now()}`, {
        cache: 'no-store',
      })
      
      if (!response.ok) return
      
      const versionInfo: VersionInfo = await response.json()
      
      // Check if force update is required
      const needsUpdate = 
        versionInfo.forceUpdate || 
        compareVersions(APP_VERSION, versionInfo.min) < 0
      
      if (needsUpdate) {
        updateRequired.value = true
        updateMessage.value = versionInfo.message || 'A critical update is required.'
        track('pwa-force-update-triggered', { 
          currentVersion: APP_VERSION, 
          minVersion: versionInfo.min 
        })
        
        // Force the update
        await forceUpdate()
      }
    } catch (error) {
      // Silently fail - don't break the app if version check fails
      console.warn('Version check failed:', error)
    } finally {
      isChecking.value = false
    }
  }

  const forceUpdate = async () => {
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(r => r.unregister()))
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
    
    // Hard reload
    window.location.reload()
  }

  // Check on app mount
  onMounted(() => {
    // Initial check
    checkForUpdates()
    
    // Periodic check every hour
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000)
    onUnmounted(() => clearInterval(interval))
  })

  return {
    appVersion: APP_VERSION,
    isChecking,
    updateRequired,
    updateMessage,
    checkForUpdates,
    forceUpdate,
  }
}
