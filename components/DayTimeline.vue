<template>
    <div class="day-timeline relative">
        <!-- Legend - top right -->
        <div class="absolute top-0 right-0 flex items-center gap-3 text-[10px] text-white/50">
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500/50"></div>
                <span>No power</span>
            </div>
            <div v-if="showCurrentTime" class="flex items-center gap-1">
                <div class="w-2.5 h-0.5 bg-green-500"></div>
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
                    stroke-opacity="0.3" stroke-width="1" />
                <text :x="getXForHour(hour)" :y="axisY + 18"
                    :text-anchor="hour === 0 ? 'start' : hour === 24 ? 'end' : 'middle'" fill="white" fill-opacity="0.5"
                    font-size="6">{{ formatHour(hour) }}</text>
            </g>

            <!-- Sunrise icon at 6am -->
            <g :transform="`translate(${getXForHour(6)}, ${getYForHour(6) - 12})`">
                <circle r="6" fill="#fbbf24" fill-opacity="0.8" />
                <path d="M0,-10 L0,-14 M7,-7 L10,-10 M-7,-7 L-10,-10 M10,0 L14,0 M-10,0 L-14,0" stroke="#fbbf24"
                    stroke-width="1" stroke-linecap="square" fill="none" transform="translate(0, 0)" />
            </g>


            <!-- Sunset icon at 6pm -->
            <g :transform="`translate(${getXForHour(18)}, ${getYForHour(18) - 12})`">
                <circle r="6" fill="#f97316" fill-opacity="0.8" />
                <path d="M7,-7 L10,-10 M-7,-7 L-10,-10 M10,0 L14,0 M-10,0 L-14,0" stroke="#f97316" stroke-width="1"
                    stroke-linecap="round" fill="none" transform="translate(0, -1)" />
            </g>

            <!-- Current time indicator -->
            <g v-if="showCurrentTime" :transform="`translate(${currentTimeX}, 0)`">
                <line :y1="curveTop - 10" :y2="axisY + 5" stroke="#22c55e" stroke-width="1" stroke-dasharray="2,2" />
                <circle :cy="currentTimeY" r="2" fill="#22c55e" />
                <text :y="curveTop - 15" text-anchor="middle" fill="#22c55e" font-size="6" font-weight="300">NOW</text>
            </g>

            <!-- Outage start/end labels -->
            <text :x="outageStartX" :y="curveTop - 12" text-anchor="middle" fill="#ef4444" font-size="6"
                font-weight="500">{{ formatTime(outageStart) }}</text>
            <text :x="outageStartX + outageWidth" :y="curveTop - 12" text-anchor="middle" fill="#ef4444" font-size="6"
                font-weight="500">{{ formatTime(outageEnd) }}</text>
        </svg>

    </div>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'

const props = defineProps<{
    outageStart: Date | string
    outageEnd: Date | string
    currentTime?: Date
}>()

// Generate unique ID for clip paths using useId for SSR compatibility
const uniqueId = useId()

// SVG dimensions
const width = 400
const height = 120
const padding = 0
const chartWidth = width - padding * 2
const curveTop = 25
const curveHeight = 50
const axisY = curveTop + curveHeight + 10

// Hour markers to display
const hourMarkers = [0, 6, 12, 18, 24]

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

// Day arc fill path (6am to 6pm, filled to axis)
const dayArcFillPath = computed(() => {
    const points: string[] = []
    // Start at 6am on the axis
    points.push(`M${getXForHour(6)},${axisY}`)
    // Draw up to 6am on curve
    points.push(`L${getXForHour(6)},${getYForHour(6)}`)
    // Draw curve from 6am to 6pm
    for (let h = 6; h <= 18; h += 0.5) {
        const x = getXForHour(h)
        const y = getYForHour(h)
        points.push(`L${x},${y}`)
    }
    // Draw down to axis at 6pm
    points.push(`L${getXForHour(18)},${axisY}`)
    // Close path
    points.push('Z')
    return points.join(' ')
})

// Outage window calculations
const outageStartHours = computed(() => timeToHours(props.outageStart))
const outageEndHours = computed(() => timeToHours(props.outageEnd))
const outageStartX = computed(() => getXForHour(outageStartHours.value))
const outageWidth = computed(() => getXForHour(outageEndHours.value) - outageStartX.value)
const outageLineCount = computed(() => Math.ceil(outageWidth.value / 8) + 5)

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
</style>
