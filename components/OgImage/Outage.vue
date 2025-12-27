<script setup lang="ts">
withDefaults(defineProps<{
  locality?: string
  district?: string
  date?: string
  time?: string
  streets?: string
}>(), {
  locality: 'Location',
  district: 'District',
  date: 'Date',
  time: '00:00 - 00:00',
  streets: 'Affected areas',
})
</script>

<template>
  <div class="h-full w-full flex flex-col justify-between p-16 bg-gradient-to-br from-[#020024] via-[#020024] to-[#0a0a3a]">
    <!-- Top section with badge -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center">
          <svg class="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3L4 14h7v7l9-11h-7V3z"/>
          </svg>
        </div>
        <div class="px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-xl font-semibold">
          Scheduled Power Outage
        </div>
      </div>
    </div>

    <!-- Main content - locality -->
    <div class="flex flex-col gap-4">
      <h1 class="text-6xl font-black text-white leading-tight">
        {{ locality }}
      </h1>
      <p class="text-2xl text-white/60 max-w-[800px] line-clamp-2">
        {{ streets }}
      </p>
    </div>

    <!-- Bottom section with details -->
    <div class="flex items-end justify-between">
      <div class="flex gap-12">
        <!-- Date -->
        <div class="flex flex-col gap-1">
          <span class="text-white/40 text-lg uppercase tracking-wide">Date</span>
          <span class="text-white text-2xl font-semibold">{{ date }}</span>
        </div>
        <!-- Time -->
        <div class="flex flex-col gap-1">
          <span class="text-white/40 text-lg uppercase tracking-wide">Time</span>
          <span class="text-white text-2xl font-semibold">{{ time }}</span>
        </div>
        <!-- District -->
        <div class="flex flex-col gap-1">
          <span class="text-white/40 text-lg uppercase tracking-wide">District</span>
          <span class="text-white text-2xl font-semibold">{{ district }}</span>
        </div>
      </div>

      <!-- Branding -->
      <div class="text-white/40 text-xl">
        Power Outages Mauritius
      </div>
    </div>
  </div>
</template>
