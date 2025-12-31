<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#011458] to-[#034c96]">
    <div class="text-center text-white">
      <h1 class="text-6xl font-bold mb-4">{{ error.statusCode }}</h1>
      <p class="text-xl mb-8">{{ error.message || 'Page not found' }}</p>
      <button
        class="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        data-umami-event="error-go-home"
        @click="handleError"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
