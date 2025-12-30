<template>
    <div class="group p-5 sm:p-6 rounded-xl glass text-white relative cursor-pointer hover:brightness-110 transition-all duration-200 border-l-2 border-l-green-500/40"
        @click="handleCellClick" :data-umami-event="ANALYTICS_EVENTS.OUTAGE_VIEW_DETAIL">
        
        <!-- Header row -->
        <div class="flex items-baseline justify-between mb-4 pb-3 border-b border-white/5">
            <div class="text-xs tracking-wide text-white/50 uppercase">
                {{ formattedDate }}
            </div>
            <div class="text-xs text-green-400/70 font-medium">
                {{ outrageDuration }}
            </div>
        </div>

        <!-- Main content -->
        <div class="space-y-3">
            <!-- Time - most important -->
            <div class="text-xl sm:text-2xl font-bold tracking-tight">
                {{ formattedTime }}
            </div>

            <!-- Location details -->
            <div class="text-sm text-blue-300 capitalize leading-relaxed max-w-2xl">
                {{ props.data.streets }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { format, formatDistanceToNow, differenceInMinutes, differenceInHours } from 'date-fns'
import type { Record } from '~/types'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

const props = defineProps<{
    data: Record
}>()

// Format time in Mauritius local time (UTC+4)
function formatLocalTime(utcTimeStr: string): string {
    const utcDate = new Date(utcTimeStr)
    // Mauritius is UTC+4
    const mauritiusTime = new Date(utcDate.getTime() + (4 * 60 * 60 * 1000))
    return mauritiusTime.toISOString().slice(11, 16)
}

const formattedDate = computed(() => {
    const date = new Date(props.data.from)
    return format(date, 'EEE, MMM d, yyyy')
})

const formattedTime = computed(() => {
    const fromTime = formatLocalTime(props.data.from)
    const toTime = formatLocalTime(props.data.to)
    return `${fromTime} – ${toTime}`
})

const outrageDuration = computed(() => {
    const from = new Date(props.data.from)
    const to = new Date(props.data.to)
    const hours = differenceInHours(to, from)
    const minutes = differenceInMinutes(to, from) % 60
    
    if (hours === 0) {
        return `${minutes}min`
    } else if (minutes === 0) {
        return `${hours}h`
    } else {
        return `${hours}h ${minutes}min`
    }
})

function formatDate(date: Date | string) {
    return formatLocalTime(typeof date === 'string' ? date : date.toISOString())
}

const handleCellClick = () => {
    const cleanUrl = `/outage/${props.data.id}`
    const router = useRouter()
    router.push(cleanUrl)
}
</script>

<style scoped>
.glass {
    --theme-bg-color: rgba(16 18 27 / 90%);
    background-color: var(--theme-bg-color);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.glass.dark {
    --theme-bg-color: rgba(16 18 27 / 80%);
}
</style>
