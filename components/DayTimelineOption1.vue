<template>
    <div class="day-timeline-option1 relative">
        <!-- Legend - top right -->
        <div class="absolute -top-14 right-8 flex items-center gap-3 text-[12px] text-white/50">
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-sm bg-[#034c96]/40 border border-[#0369a1]/50"></div>
                <span>Night</span>
            </div>
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-sm bg-[#FFD500]/30 border border-[#FFD500]/60"></div>
                <span>Day</span>
            </div>
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-sm bg-[#FF4444]/30 border border-[#FF4444]/60"></div>
                <span>No power</span>
            </div>
            <div v-if="showCurrentTime" class="flex items-center gap-1">
                <div class="w-2.5 h-0.5 bg-white"></div>
                <span>Now</span>
            </div>
        </div>

        <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            <defs>
                <!-- Gold/Yellow gradient for day - matches website theme (#FFD500) -->
                <linearGradient id="dayBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFD500" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#FFA500" stop-opacity="0.08" />
                </linearGradient>
                
                <!-- Deep blue gradient for night - matches website background -->
                <linearGradient id="nightBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#034c96" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#011458" stop-opacity="0.15" />
                </linearGradient>
                
                <!-- Professional red gradient for outage -->
                <linearGradient id="outageBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FF4444" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="#CC0000" stop-opacity="0.15" />
                </linearGradient>
            </defs>

            <!-- Night section 1 (midnight to sunrise) -->
            <rect :x="padding" :y="barY" :width="getXForHour(props.sunrise) - padding" :height="barHeight"
                fill="url(#nightBarGradient)" stroke="#0369a1" stroke-width="0.5" stroke-opacity="0.4" rx="3" />

            <!-- Day section (sunrise to sunset) -->
            <rect :x="getXForHour(props.sunrise)" :y="barY" 
                :width="getXForHour(props.sunset) - getXForHour(props.sunrise)" :height="barHeight"
                fill="url(#dayBarGradient)" stroke="#FFD500" stroke-width="0.5" stroke-opacity="0.6" rx="3" />

            <!-- Night section 2 (sunset to midnight) -->
            <rect :x="getXForHour(props.sunset)" :y="barY" 
                :width="width - padding - getXForHour(props.sunset)" :height="barHeight"
                fill="url(#nightBarGradient)" stroke="#0369a1" stroke-width="0.5" stroke-opacity="0.4" rx="3" />

            <!-- Outage overlay -->
            <rect :x="outageStartX" :y="barY - 5" :width="outageWidth" :height="barHeight + 10"
                fill="url(#outageBarGradient)" stroke="#FF4444" stroke-width="1" stroke-opacity="0.65" rx="3" />

            <!-- Time axis line -->
            <line :x1="0" :y1="axisY" :x2="width" :y2="axisY" stroke="white" stroke-opacity="0.2" stroke-width="0.5" />

            <!-- Hour markers and labels -->
            <g v-for="hour in hourMarkers" :key="hour">
                <line :x1="getXForHour(hour)" :y1="axisY - 4" :x2="getXForHour(hour)" :y2="axisY + 4" 
                    stroke="white" stroke-opacity="0.3" stroke-width="0.5" />
                <text :x="getXForHour(hour)" :y="axisY + 18"
                    :text-anchor="hour === 0 ? 'start' : hour === 24 ? 'end' : 'middle'" 
                    fill="white" fill-opacity="0.5" class="timeline-text">{{ formatHour(hour) }}</text>
            </g>

            <!-- Sunrise icon -->
            <g :transform="`translate(${getXForHour(props.sunrise) - 12}, ${axisY - 16})`">
                <defs>
                    <clipPath :id="`sunriseClip-${uniqueId}`">
                        <path d="M24 14.4H14.4l-1.7-1.5a0.9 0.9 0 0 0-1.1 0L10 14.4H0V0h24Z" />
                    </clipPath>
                </defs>
                <g :clip-path="`url(#sunriseClip-${uniqueId})`">
                    <g transform="translate(3.3 4.9)">
                        <circle cx="8.8" cy="8.8" r="3.9" fill="none" stroke="#FFD500" stroke-miterlimit="10"
                            stroke-width="0.5" />
                        <path fill="none" stroke="#FFD500" stroke-linecap="round" stroke-miterlimit="10"
                            stroke-width="0.5"
                            d="M8.8 2.7V.4m0 16.9v-2.3m4.3-10.5l1.6-1.6M2.8 14.8l1.7-1.7m0-8.6L2.8 2.8m12 12l-1.7-1.7M2.7 8.8H.4m16.9 0h-2.3">
                            <animateTransform additive="sum" attributeName="transform" dur="60s"
                                repeatCount="indefinite" type="rotate" values="0 8.8 8.8; 45 8.8 8.8" />
                        </path>
                    </g>
                </g>
                <path fill="none" stroke="#FFD500" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M6 15.6h4.1l1.9-1.7l1.9 1.7H18" opacity="0.7" />
            </g>

            <!-- Sunset icon -->
            <g :transform="`translate(${getXForHour(props.sunset) - 12}, ${axisY - 16})`">
                <defs>
                    <clipPath :id="`sunsetClip-${uniqueId}`">
                        <path d="M24 14.4H14.4l-1.7-1.5a0.9 0.9 0 0 0-1.1 0L10 14.4H0V0h24Z" />
                    </clipPath>
                </defs>
                <g :clip-path="`url(#sunsetClip-${uniqueId})`">
                    <g transform="translate(3.3 4.9)">
                        <circle cx="8.8" cy="8.8" r="3.9" fill="none" stroke="#FFA500" stroke-miterlimit="10"
                            stroke-width="0.5" />
                        <path fill="none" stroke="#FF8C00" stroke-linecap="round" stroke-miterlimit="10"
                            stroke-width="0.5"
                            d="M8.8 2.7V.4m0 16.9v-2.3m4.3-10.5l1.6-1.6M2.8 14.8l1.7-1.7m0-8.6L2.8 2.8m12 12l-1.7-1.7M2.7 8.8H.4m16.9 0h-2.3">
                            <animateTransform additive="sum" attributeName="transform" dur="20s"
                                repeatCount="indefinite" type="rotate" values="0 8.8 8.8; 45 8.8 8.8" />
                        </path>
                    </g>
                </g>
                <path fill="none" stroke="#FFA500" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M6 15.6h4.1l1.9-1.7l1.9 1.7H18" opacity="0.7" />
            </g>

            <!-- Current time indicator -->
            <g v-if="showCurrentTime" :transform="`translate(${currentTimeX}, 0)`">
                <line :y1="barY - 10" :y2="axisY + 5" stroke="#ffffff" stroke-width="1" stroke-dasharray="2,2" />
                <circle :cy="barY + barHeight / 2" r="2" fill="#ffffff" />
                <text :y="barY - 15" text-anchor="middle" fill="#ffffff" font-weight="300"
                    class="timeline-text">NOW</text>
            </g>

            <!-- Outage start/end labels -->
            <text :x="outageStartLabelX" :y="outageStartLabelY" :text-anchor="outageStartLabelAnchor" fill="#FF4444"
                font-weight="300" class="timeline-text-emphasis">{{ formatTime(outageStart) }}</text>
            <text :x="outageEndLabelX" :y="outageEndLabelY" :text-anchor="outageEndLabelAnchor" fill="#FF4444"
                font-weight="300" class="timeline-text-emphasis">{{ formatTime(outageEnd) }}</text>
        </svg>
    </div>
</template>

<style scoped>
.day-timeline-option1 {
    width: 100%;
}

/* Base font sizes for desktop */
.timeline-text {
    font-size: 6px;
}

.timeline-text-emphasis {
    font-size: 6px;
}

/* Larger font sizes for mobile (smaller screens = larger relative text) */
@media (max-width: 640px) {
    .timeline-text {
        font-size: 14px;
    }

    .timeline-text-emphasis {
        font-size: 14px;
    }
}
</style>

<script setup lang="ts">
import { useNow } from '@vueuse/core'

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

// Generate unique ID for clip paths using useId for SSR compatibility
const uniqueId = useId()

const width = 400
const height = 130
const padding = 0
const barY = 45
const barHeight = 30
const axisY = barY + barHeight + 10

// Hour markers to display
const hourMarkers = [6, 12, 18]

function timeToHours(time: Date | string): number {
    const date = typeof time === 'string' ? new Date(time) : time
    return date.getHours() + date.getMinutes() / 60
}

function getXForHour(hour: number): number {
    return padding + (hour / 24) * (width - padding * 2)
}

const outageStartHours = computed(() => timeToHours(props.outageStart))
const outageEndHours = computed(() => timeToHours(props.outageEnd))
const outageStartX = computed(() => getXForHour(outageStartHours.value))
const outageEndX = computed(() => getXForHour(outageEndHours.value))
const outageWidth = computed(() => outageEndX.value - outageStartX.value)

// Detect if outage labels would overlap (threshold ~40px for text width)
const labelsOverlap = computed(() => outageWidth.value < 45)

// Calculate label positions to avoid overlap
const outageStartLabelX = computed(() => {
    if (labelsOverlap.value) {
        // Move start label slightly left
        return outageStartX.value - 5
    }
    return outageStartX.value
})

const outageEndLabelX = computed(() => {
    if (labelsOverlap.value) {
        // Move end label slightly right
        return outageEndX.value + 5
    }
    return outageEndX.value
})

const outageStartLabelY = computed(() => {
    if (labelsOverlap.value) {
        // Offset start label higher
        return barY - 18
    }
    return barY - 12
})

const outageEndLabelY = computed(() => {
    if (labelsOverlap.value) {
        // Offset end label lower
        return barY - 6
    }
    return barY - 12
})

const outageStartLabelAnchor = computed(() => {
    if (labelsOverlap.value) {
        return 'end'
    }
    return 'middle'
})

const outageEndLabelAnchor = computed(() => {
    if (labelsOverlap.value) {
        return 'start'
    }
    return 'middle'
})

const now = useNow({ interval: 1000 })
const currentTimeHours = computed(() => {
    const time = props.currentTime || now.value
    return timeToHours(time)
})
const currentTimeX = computed(() => getXForHour(currentTimeHours.value))

const showCurrentTime = computed(() => {
    const outageDate = new Date(props.outageStart)
    const today = props.currentTime || now.value
    return outageDate.toDateString() === today.toDateString()
})

function formatHour(hour: number): string {
    if (hour === 0 || hour === 24) return '12am'
    if (hour === 12) return '12pm'
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
}

function formatTime(time: Date | string): string {
    const date = typeof time === 'string' ? new Date(time) : time
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return minutes > 0 ? `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}` : `${displayHours}${ampm}`
}
</script>
