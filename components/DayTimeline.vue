<template>
    <div class="day-timeline relative">
        <!-- Legend - top right -->
        <div class="absolute -top-14 right-8 flex items-center gap-3 text-[12px] text-white/50">
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500/50"></div>
                <span>No power</span>
            </div>
            <div v-if="showCurrentTime" class="flex items-center gap-1">
                <div class="w-2.5 h-0.5 bg-white"></div>
                <span>Now</span>
            </div>
        </div>

        <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            <defs>
                <!-- Gradient for the sky curve - day portion -->
                <linearGradient id="dayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.05" />
                </linearGradient>

                <!-- Gradient for night portions -->
                <linearGradient id="nightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="#1e3a5f" stop-opacity="0.1" />
                </linearGradient>

                <!-- Gradient for outage window -->
                <linearGradient id="outageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#ef4444" stop-opacity="0.1" />
                </linearGradient>
            </defs>

            <!-- Night background (full width, below curve) -->
            <!-- <rect :x="padding" :y="curveTop" :width="chartWidth" :height="curveHeight + 10" fill="url(#nightGradient)"
                class="opacity-50" /> -->

            <!-- Day arc fill (6am to 6pm) -->
            <path :d="dayArcFillPath" fill="url(#dayGradient)" />

            <!-- Sun curve path -->
            <path :d="sunCurvePath" fill="none" stroke="#fbbf24" stroke-width="0.5" stroke-linecap="round"
                class="opacity-60" />

            <!-- Outage window overlay -->
            <rect :x="outageStartX" :y="curveTop - 5" :width="outageWidth" :height="curveHeight + 15"
                fill="url(#outageGradient)" stroke="#ef4444" stroke-width="1" stroke-opacity="0.5" rx="2" />

            <!-- Outage pattern lines -->
            <g :clip-path="`url(#outageClip-${uniqueId})`">
                <defs>
                    <clipPath :id="`outageClip-${uniqueId}`">
                        <rect :x="outageStartX" :y="curveTop - 5" :width="outageWidth" :height="curveHeight + 15" />
                    </clipPath>
                </defs>
                <line v-for="i in outageLineCount" :key="i" :x1="outageStartX + (i - 1) * 8 - 20"
                    :y1="curveTop + curveHeight + 10" :x2="outageStartX + (i - 1) * 8 + 20" :y2="curveTop - 5"
                    stroke="#ef4444" stroke-width="1" stroke-opacity="0.2" />
            </g>

            <!-- Time axis line -->
            <line :x1="0" :y1="axisY" :x2="width" :y2="axisY" stroke="white" stroke-opacity="0.2" stroke-width="0.5" />

            <!-- Hour markers and labels -->
            <g v-for="hour in hourMarkers" :key="hour">
                <line :x1="getXForHour(hour)" :y1="axisY - 4" :x2="getXForHour(hour)" :y2="axisY + 4" stroke="white"
                    stroke-opacity="0.3" stroke-width="0.5" />
                <text :x="getXForHour(hour)" :y="axisY + 18"
                    :text-anchor="hour === 0 ? 'start' : hour === 24 ? 'end' : 'middle'" fill="white" fill-opacity="0.5"
                    class="timeline-text">{{ formatHour(hour) }}</text>
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
                        <circle cx="8.8" cy="8.8" r="3.9" fill="none" stroke="#fbbf24" stroke-miterlimit="10"
                            stroke-width="0.5" />
                        <path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10"
                            stroke-width="0.5"
                            d="M8.8 2.7V.4m0 16.9v-2.3m4.3-10.5l1.6-1.6M2.8 14.8l1.7-1.7m0-8.6L2.8 2.8m12 12l-1.7-1.7M2.7 8.8H.4m16.9 0h-2.3">
                            <animateTransform additive="sum" attributeName="transform" dur="60s"
                                repeatCount="indefinite" type="rotate" values="0 8.8 8.8; 45 8.8 8.8" />
                        </path>
                    </g>
                </g>
                <path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M6 15.6h4.1l1.9-1.7l1.9 1.7H18" opacity="0.6" />
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
                        <circle cx="8.8" cy="8.8" r="3.9" fill="none" stroke="#f97316" stroke-miterlimit="10"
                            stroke-width="0.5" />
                        <path fill="none" stroke="#ef4444" stroke-linecap="round" stroke-miterlimit="10"
                            stroke-width="0.5"
                            d="M8.8 2.7V.4m0 16.9v-2.3m4.3-10.5l1.6-1.6M2.8 14.8l1.7-1.7m0-8.6L2.8 2.8m12 12l-1.7-1.7M2.7 8.8H.4m16.9 0h-2.3">
                            <animateTransform additive="sum" attributeName="transform" dur="20s"
                                repeatCount="indefinite" type="rotate" values="0 8.8 8.8; 45 8.8 8.8" />
                        </path>
                    </g>
                </g>
                <path fill="none" stroke="#f97316" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M6 15.6h4.1l1.9-1.7l1.9 1.7H18" opacity="0.6" />
            </g>

            <!-- Current time indicator -->
            <g v-if="showCurrentTime" :transform="`translate(${currentTimeX}, 0)`">
                <line :y1="curveTop - 10" :y2="axisY + 5" stroke="#ffffff" stroke-width="1" stroke-dasharray="2,2" />
                <circle :cy="currentTimeY" r="2" fill="#ffffff" />
                <text :y="curveTop - 15" text-anchor="middle" fill="#ffffff" font-weight="300"
                    class="timeline-text">NOW</text>
            </g>

            <!-- Outage start/end labels -->
            <text :x="outageStartLabelX" :y="outageStartLabelY" :text-anchor="outageStartLabelAnchor" fill="#ef4444"
                font-weight="300" class="timeline-text-emphasis">{{ formatTime(outageStart) }}</text>
            <text :x="outageEndLabelX" :y="outageEndLabelY" :text-anchor="outageEndLabelAnchor" fill="#ef4444"
                font-weight="300" class="timeline-text-emphasis">{{ formatTime(outageEnd) }}</text>
        </svg>

    </div>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'

const props = withDefaults(defineProps<{
    outageStart: Date | string
    outageEnd: Date | string
    currentTime?: Date
    sunrise?: number  // Hour in decimal (e.g., 6.25 for 6:15 AM)
    sunset?: number   // Hour in decimal (e.g., 18.5 for 6:30 PM)
}>(), {
    sunrise: 6,
    sunset: 18,
})

// Generate unique ID for clip paths using useId for SSR compatibility
const uniqueId = useId()

// SVG dimensions
const width = 400
const height = 130
const padding = 0
const chartWidth = width - padding * 2
const curveTop = 35
const curveHeight = 50
const axisY = curveTop + curveHeight + 10

// Hour markers to display
const hourMarkers = [6, 12, 18]

// Convert time to hours (0-24)
function timeToHours(time: Date | string): number {
    const date = typeof time === 'string' ? new Date(time) : time
    return date.getHours() + date.getMinutes() / 60
}

// Get X position for a given hour
function getXForHour(hour: number): number {
    return padding + (hour / 24) * chartWidth
}

// Get Y position for sun curve at a given hour (parabola peaking at noon)
function getYForHour(hour: number): number {
    // Normalize hour to 0-1 where 0.5 is noon (peak)
    const normalized = hour / 24
    // Parabola: highest at noon (0.5), lowest at midnight (0 and 1)
    // y = -4 * (x - 0.5)^2 + 1  gives us 1 at noon, 0 at midnight
    const curveValue = -4 * Math.pow(normalized - 0.5, 2) + 1
    // Invert and scale to our coordinate system
    return curveTop + curveHeight * (1 - Math.max(0, curveValue))
}

// Sun curve path (smooth curve from midnight to midnight)
const sunCurvePath = computed(() => {
    const points: string[] = []
    for (let h = 0; h <= 24; h += 0.5) {
        const x = getXForHour(h)
        const y = getYForHour(h)
        points.push(`${h === 0 ? 'M' : 'L'}${x},${y}`)
    }
    return points.join(' ')
})

// Day arc fill path (sunrise to sunset, filled to axis)
const dayArcFillPath = computed(() => {
    const sunrise = props.sunrise
    const sunset = props.sunset
    const points: string[] = []
    // Start at sunrise on the axis
    points.push(`M${getXForHour(sunrise)},${axisY}`)
    // Draw up to sunrise on curve
    points.push(`L${getXForHour(sunrise)},${getYForHour(sunrise)}`)
    // Draw curve from sunrise to sunset (stop before sunset to avoid duplicates)
    for (let h = sunrise; h < sunset; h += 0.5) {
        const x = getXForHour(h)
        const y = getYForHour(h)
        points.push(`L${x},${y}`)
    }
    // Always add the exact sunset point on the curve to ensure vertical line down
    points.push(`L${getXForHour(sunset)},${getYForHour(sunset)}`)
    // Draw down to axis at sunset (now this will be perfectly vertical)
    points.push(`L${getXForHour(sunset)},${axisY}`)
    // Close path
    points.push('Z')
    return points.join(' ')
})

// Outage window calculations
const outageStartHours = computed(() => timeToHours(props.outageStart))
const outageEndHours = computed(() => timeToHours(props.outageEnd))
const outageStartX = computed(() => getXForHour(outageStartHours.value))
const outageEndX = computed(() => getXForHour(outageEndHours.value))
const outageWidth = computed(() => outageEndX.value - outageStartX.value)
const outageLineCount = computed(() => Math.ceil(outageWidth.value / 8) + 5)

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
        return curveTop - 18
    }
    return curveTop - 12
})

const outageEndLabelY = computed(() => {
    if (labelsOverlap.value) {
        // Offset end label lower
        return curveTop - 6
    }
    return curveTop - 12
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

// Current time
const now = useNow({ interval: 1000 })
const currentTimeHours = computed(() => {
    const time = props.currentTime || now.value
    return timeToHours(time)
})
const currentTimeX = computed(() => getXForHour(currentTimeHours.value))
const currentTimeY = computed(() => getYForHour(currentTimeHours.value))

// Only show current time indicator if it's the same day as the outage
const showCurrentTime = computed(() => {
    const outageDate = new Date(props.outageStart)
    const today = props.currentTime || now.value
    return outageDate.toDateString() === today.toDateString()
})

// Format hour for display
function formatHour(hour: number): string {
    if (hour === 0 || hour === 24) return '12am'
    if (hour === 12) return '12pm'
    if (hour < 12) return `${hour}am`
    return `${hour - 12}pm`
}

// Format time for outage labels
function formatTime(time: Date | string): string {
    const date = typeof time === 'string' ? new Date(time) : time
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return minutes > 0 ? `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}` : `${displayHours}${ampm}`
}
</script>

<style scoped>
.day-timeline {
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
