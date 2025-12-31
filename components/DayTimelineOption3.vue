<template>
    <div class="day-timeline-option3 relative">
        <!-- Legend - top right -->
        <div class="absolute -top-14 right-8 flex items-center gap-3 text-[12px] text-white/50">
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-full bg-[#034c96]/40 border border-[#0369a1]/50"></div>
                <span>Night</span>
            </div>
            <div class="flex items-center gap-1">
                <div class="w-2.5 h-2.5 rounded-full bg-[#FFD500]/30 border border-[#FFD500]/60"></div>
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
                <!-- Gold/Yellow radial gradient for day - matches website theme -->
                <radialGradient id="dayGradientClock">
                    <stop offset="60%" stop-color="#FFD500" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#FFA500" stop-opacity="0.1" />
                </radialGradient>
                
                <!-- Deep blue radial gradient for night - matches website background -->
                <radialGradient id="nightGradientClock">
                    <stop offset="60%" stop-color="#034c96" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#011458" stop-opacity="0.12" />
                </radialGradient>
            </defs>

            <g :transform="`translate(${centerX}, ${centerY})`">
                <!-- Outer clock circle background -->
                <circle r="80" fill="none" stroke="white" stroke-width="0.5" stroke-opacity="0.2" />

                <!-- Night arc (midnight to sunrise) -->
                <path :d="getNightArc1Path()" :fill="nightArcFill" stroke="#0369a1" stroke-width="0.5" stroke-opacity="0.4" />

                <!-- Day arc (sunrise to sunset) -->
                <path :d="getDayArcPath()" :fill="dayArcFill" stroke="#FFD500" stroke-width="0.5" stroke-opacity="0.6" />

                <!-- Night arc (sunset to midnight) -->
                <path :d="getNightArc2Path()" :fill="nightArcFill" stroke="#0369a1" stroke-width="0.5" stroke-opacity="0.4" />

                <!-- Outage arc -->
                <path :d="getOutageArcPath()" fill="#FF4444" fill-opacity="0.35" stroke="#FF4444" stroke-width="1" stroke-opacity="0.65" />

                <!-- Clock center -->
                <circle r="3" fill="white" fill-opacity="0.3" />

                <!-- Hour markers and labels -->
                <g v-for="hour in 24" :key="hour">
                    <g :transform="`rotate(${getAngleForHour(hour)})`">
                        <!-- Hour tick -->
                        <line :y1="-80" :y2="hour % 6 === 0 ? -70 : -75" 
                            stroke="white" :stroke-width="hour % 6 === 0 ? 1 : 0.5" stroke-opacity="0.4" />
                        
                        <!-- Hour labels (every 6 hours) -->
                        <text v-if="hour % 6 === 0" :transform="`rotate(${-getAngleForHour(hour)})`" 
                            y="-85" text-anchor="middle" fill="white" fill-opacity="0.5" 
                            class="timeline-text">{{ formatHourShort(hour) }}</text>
                    </g>
                </g>

                <!-- Sunrise icon on clock edge -->
                <g :transform="`rotate(${getAngleForHour(props.sunrise)}) translate(0, -65)`">
                    <circle r="6" fill="#FFD500" opacity="0.35" />
                    <circle r="3.5" fill="#FFD500" />
                </g>

                <!-- Sunset icon on clock edge -->
                <g :transform="`rotate(${getAngleForHour(props.sunset)}) translate(0, -65)`">
                    <circle r="6" fill="#FFA500" opacity="0.35" />
                    <circle r="3.5" fill="#FFA500" />
                </g>

                <!-- Current time hand -->
                <g v-if="showCurrentTime" :transform="`rotate(${currentTimeAngle})`">
                    <!-- Hand -->
                    <line y1="5" y2="-55" stroke="white" stroke-width="1" stroke-linecap="round" />
                    <circle cy="-55" r="2" fill="white" />
                    <!-- Time label -->
                    <text :transform="`rotate(${-currentTimeAngle})`" y="-62" text-anchor="middle" 
                        fill="white" font-weight="300" class="timeline-text">NOW</text>
                </g>

                <!-- Outage time labels on arc -->
                <g :transform="`rotate(${getAngleForHour(outageStartHours)}) translate(0, -90)`">
                    <text :transform="`rotate(${-getAngleForHour(outageStartHours)})`" 
                        text-anchor="middle" fill="#FF4444" font-weight="300" class="timeline-text-emphasis">
                        {{ formatTime(outageStart) }}
                    </text>
                </g>
                <g :transform="`rotate(${getAngleForHour(outageEndHours)}) translate(0, -90)`">
                    <text :transform="`rotate(${-getAngleForHour(outageEndHours)})`" 
                        text-anchor="middle" fill="#FF4444" font-weight="300" class="timeline-text-emphasis">
                        {{ formatTime(outageEnd) }}
                    </text>
                </g>
            </g>

            <!-- Legend labels outside clock -->
            <text :x="centerX" :y="15" text-anchor="middle" fill="white" fill-opacity="0.4" class="timeline-text">12am</text>
            <text :x="centerX + 90" :y="centerY + 5" text-anchor="start" fill="white" fill-opacity="0.4" class="timeline-text">6am</text>
            <text :x="centerX" :y="height - 10" text-anchor="middle" fill="white" fill-opacity="0.4" class="timeline-text">12pm</text>
            <text :x="centerX - 90" :y="centerY + 5" text-anchor="end" fill="white" fill-opacity="0.4" class="timeline-text">6pm</text>
        </svg>
    </div>
</template>

<style scoped>
.day-timeline-option3 {
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

const width = 300
const height = 300
const centerX = width / 2
const centerY = height / 2
const radius = 80
const innerRadius = 55

const dayArcFill = 'url(#dayGradientClock)'
const nightArcFill = 'url(#nightGradientClock)'

function timeToHours(time: Date | string): number {
    const date = typeof time === 'string' ? new Date(time) : time
    return date.getHours() + date.getMinutes() / 60
}

// Convert hour to angle (0 = top/midnight, clockwise)
function getAngleForHour(hour: number): number {
    // 0 hour = -90 degrees (top), rotate clockwise
    return (hour / 24) * 360 - 90
}

// Get point on circle for given angle and radius
function polarToCartesian(angle: number, r: number): { x: number, y: number } {
    const rad = (angle * Math.PI) / 180
    return {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad)
    }
}

// Create arc path for clock face
function createArcPath(startHour: number, endHour: number): string {
    const startAngle = getAngleForHour(startHour)
    const endAngle = getAngleForHour(endHour)
    
    const startOuter = polarToCartesian(startAngle, radius)
    const endOuter = polarToCartesian(endAngle, radius)
    const startInner = polarToCartesian(startAngle, innerRadius)
    const endInner = polarToCartesian(endAngle, innerRadius)
    
    const largeArcFlag = endHour - startHour > 12 ? 1 : 0
    
    return [
        `M ${startOuter.x} ${startOuter.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
        `L ${endInner.x} ${endInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
        'Z'
    ].join(' ')
}

function getDayArcPath(): string {
    return createArcPath(props.sunrise, props.sunset)
}

function getNightArc1Path(): string {
    return createArcPath(0, props.sunrise)
}

function getNightArc2Path(): string {
    return createArcPath(props.sunset, 24)
}

const outageStartHours = computed(() => timeToHours(props.outageStart))
const outageEndHours = computed(() => timeToHours(props.outageEnd))

function getOutageArcPath(): string {
    return createArcPath(outageStartHours.value, outageEndHours.value)
}

const now = useNow({ interval: 1000 })
const currentTimeHours = computed(() => {
    const time = props.currentTime || now.value
    return timeToHours(time)
})
const currentTimeAngle = computed(() => getAngleForHour(currentTimeHours.value))

const showCurrentTime = computed(() => {
    const outageDate = new Date(props.outageStart)
    const today = props.currentTime || now.value
    return outageDate.toDateString() === today.toDateString()
})

function formatHourShort(hour: number): string {
    if (hour === 0 || hour === 24) return '0'
    return `${hour}`
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
