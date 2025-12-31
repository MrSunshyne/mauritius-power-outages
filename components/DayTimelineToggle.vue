<template>
    <div class="day-timeline-toggle">
        <!-- Toggle Control - Hidden for now -->
        <div v-if="false" class="flex items-center justify-center gap-3 mb-6">
            <button
                @click="viewMode = 'linear'"
                :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'linear'
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-transparent'
                ]"
            >
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="10" width="18" height="4" rx="1" stroke-width="2" />
                    </svg>
                    <span>Linear</span>
                </div>
            </button>
            <button
                @click="viewMode = 'clock'"
                :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    viewMode === 'clock'
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 border border-transparent'
                ]"
            >
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" stroke-width="2" />
                        <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <span>Clock</span>
                </div>
            </button>
        </div>

        <!-- Timeline Display -->
        <div class="timeline-container">
            <Transition name="fade" mode="out-in">
                <DayTimelineOption1
                    v-if="viewMode === 'linear'"
                    key="linear"
                    :outage-start="outageStart"
                    :outage-end="outageEnd"
                    :sunrise="sunrise"
                    :sunset="sunset"
                    :current-time="currentTime"
                />
                <DayTimelineOption3
                    v-else
                    key="clock"
                    :outage-start="outageStart"
                    :outage-end="outageEnd"
                    :sunrise="sunrise"
                    :sunset="sunset"
                    :current-time="currentTime"
                />
            </Transition>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    outageStart: Date | string
    outageEnd: Date | string
    currentTime?: Date
    sunrise?: number
    sunset?: number
}>(), {
    sunrise: 6,
    sunset: 18,
})

// Toggle between linear and clock view
const viewMode = ref<'linear' | 'clock'>('linear')
</script>

<style scoped>
.day-timeline-toggle {
    width: 100%;
}

.timeline-container {
    position: relative;
    min-height: 130px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
