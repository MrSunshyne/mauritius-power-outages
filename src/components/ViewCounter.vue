<template>
  <div v-if="count !== null" class="text-white/60 text-xs sm:text-sm whitespace-nowrap">
    {{ count }} views today
  </div>
</template>

<script setup lang="ts">
const count = ref<string | null>(null)

onMounted(async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    const response = await fetch(
      `https://power-outages-mauritius.goatcounter.com/counter/TOTAL.json?start=${today}`
    )
    if (response.ok) {
      const data = await response.json()
      count.value = data.count
    }
  } catch (error) {
    console.error('Failed to fetch view count:', error)
  }
})
</script>
