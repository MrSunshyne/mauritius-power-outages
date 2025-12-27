<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    subtitle?: string
}>(), {
    title: 'Power Outages Mauritius',
    subtitle: 'Live Schedule & Updates',
})
</script>

<template>
    <div
        class="h-full w-full flex flex-col justify-between p-16 bg-gradient-to-br from-[#020024] via-[#020024] to-[#0a0a3a]">
        <!-- Top section with icon and branding -->
        <div class="flex items-center gap-6">
            <div class="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <svg class="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3L4 14h7v7l9-11h-7V3z" />
                </svg>
            </div>
            <div class="text-white/60 text-2xl font-medium">
                power-outages-mauritius.netlify.app
            </div>
        </div>

        <!-- Main content -->
        <div class="flex flex-col gap-6">
            <h1 class="text-7xl font-black text-white leading-tight">
                {{ title }}
            </h1>
            <p class="text-3xl text-white/70 font-medium">
                {{ subtitle }}
            </p>
        </div>

        <!-- Bottom section with features -->
        <div class="flex gap-8">
            <div class="flex items-center gap-3 text-white/50 text-xl">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Live Updates</span>
            </div>
            <div class="flex items-center gap-3 text-white/50 text-xl">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Countdown Timers</span>
            </div>
            <div class="flex items-center gap-3 text-white/50 text-xl">
                <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>All Districts</span>
            </div>
        </div>
    </div>
</template>
