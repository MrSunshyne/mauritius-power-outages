<script setup lang="ts">
import { startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval, format, startOfMonth, parseISO, subMonths, isToday } from 'date-fns'
import type { Record as OutageRecord } from '~/types'
import { useAnalytics } from '~/composables/useAnalytics'

const { track } = useAnalytics()

export interface HeatmapDataPoint {
  date: string
  count: number
  records?: OutageRecord[]
}

interface Props {
  data: HeatmapDataPoint[]
  startDate?: Date | string
  endDate?: Date | string
  color?: string
  emptyColor?: string
  showMonthLabels?: boolean
  showWeekdayLabels?: boolean
  cellSize?: 'sm' | 'md' | 'lg'
  cellGap?: number
  tooltips?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'emerald',
  emptyColor: 'white/5',
  showMonthLabels: true,
  showWeekdayLabels: true,
  cellSize: 'md',
  cellGap: 2,
  tooltips: true,
})

const emit = defineEmits<{
  cellClick: [payload: { date: string; count: number; records?: OutageRecord[] }]
  cellHover: [payload: { date: string; count: number; records?: OutageRecord[] }]
}>()

// Parse dates
const parsedStartDate = computed(() => {
  if (props.startDate) {
    return typeof props.startDate === 'string' ? parseISO(props.startDate) : props.startDate
  }
  return subMonths(new Date(), 12)
})

const parsedEndDate = computed(() => {
  if (props.endDate) {
    return typeof props.endDate === 'string' ? parseISO(props.endDate) : props.endDate
  }
  return new Date()
})

// Create a lookup map for quick access to data by date
const dataMap = computed(() => {
  const map = new Map<string, HeatmapDataPoint>()
  props.data.forEach(point => {
    map.set(point.date, point)
  })
  return map
})

// Generate weeks and days
const weeks = computed(() => {
  const start = startOfWeek(parsedStartDate.value, { weekStartsOn: 0 }) // Sunday
  const end = endOfWeek(parsedEndDate.value, { weekStartsOn: 0 })
  
  return eachWeekOfInterval({ start, end }, { weekStartsOn: 0 }).map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  })
})

// Get year labels with positions (only show at start of each year)
const monthLabels = computed(() => {
  if (!props.showMonthLabels) return []
  
  const labels: { label: string; weekIndex: number; offset: number; isYear: boolean }[] = []
  let currentYear = ''
  
  weeks.value.forEach((week, weekIndex) => {
    const firstDay = week[0]
    const monthLabel = format(firstDay, 'MMM')
    const yearLabel = format(firstDay, 'yyyy')
    
    // Only add label when we encounter a new year
    const isNewYear = yearLabel !== currentYear
    
    if (isNewYear) {
      labels.push({ 
        label: `${monthLabel} ${yearLabel}`,
        weekIndex,
        offset: weekIndex * (cellSizePx.value + props.cellGap),
        isYear: true
      })
      currentYear = yearLabel
    }
  })
  
  return labels
})

// Weekday labels
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Get cell size in pixels
const cellSizeMap = {
  sm: 10,
  md: 12,
  lg: 14,
}

const cellSizePx = computed(() => cellSizeMap[props.cellSize])

// Calculate intensity level (0-4)
// Adjusted for typical outage patterns (most days have 0-2 outages per locality)
const getIntensityLevel = (count: number): number => {
  if (count === 0) return 0
  if (count === 1) return 2 // Show single outages clearly (medium intensity)
  if (count === 2) return 3 // Two outages is high
  return 4 // 3+ outages is maximum
}

// Get color class based on intensity
const getColorClass = (count: number): string => {
  const level = getIntensityLevel(count)
  
  if (level === 0) {
    // Handle empty color - default to white/5
    if (props.emptyColor === 'white/5') return 'bg-white/5'
    return `bg-${props.emptyColor}`
  }

  type ColorLevel = Record<string, string>
  type ColorMap = Record<number, ColorLevel>

  const colorMap: ColorMap = {
    1: {
      emerald: 'bg-emerald-800/60 border-emerald-700/50',
      blue: 'bg-blue-800/60 border-blue-700/50',
      amber: 'bg-amber-800/60 border-amber-700/50',
      red: 'bg-red-800/60 border-red-700/50',
      purple: 'bg-purple-800/60 border-purple-700/50',
      pink: 'bg-pink-800/60 border-pink-700/50',
    },
    2: {
      emerald: 'bg-emerald-600/70 border-emerald-500/60',
      blue: 'bg-blue-600/70 border-blue-500/60',
      amber: 'bg-amber-600/70 border-amber-500/60',
      red: 'bg-red-600/70 border-red-500/60',
      purple: 'bg-purple-600/70 border-purple-500/60',
      pink: 'bg-pink-600/70 border-pink-500/60',
    },
    3: {
      emerald: 'bg-emerald-500/80 border-emerald-400/70',
      blue: 'bg-blue-500/80 border-blue-400/70',
      amber: 'bg-amber-500/80 border-amber-400/70',
      red: 'bg-red-500/80 border-red-400/70',
      purple: 'bg-purple-500/80 border-purple-400/70',
      pink: 'bg-pink-500/80 border-pink-400/70',
    },
    4: {
      emerald: 'bg-emerald-400/90 border-emerald-300/80',
      blue: 'bg-blue-400/90 border-blue-300/80',
      amber: 'bg-amber-400/90 border-amber-300/80',
      red: 'bg-red-400/90 border-red-300/80',
      purple: 'bg-purple-400/90 border-purple-300/80',
      pink: 'bg-pink-400/90 border-pink-300/80',
    },
  }

  return colorMap[level][props.color] || colorMap[level].emerald
}

// Get data for a specific date
const getDataForDate = (date: Date): HeatmapDataPoint => {
  const dateStr = format(date, 'yyyy-MM-dd')
  return dataMap.value.get(dateStr) || { date: dateStr, count: 0 }
}

// Handle cell click
const handleCellClick = (date: Date) => {
  const data = getDataForDate(date)

  track('heatmap-cell-click', {
    date: format(date, 'yyyy-MM-dd'),
    count: data.count
  })

  emit('cellClick', data)
}

// Handle cell hover
const handleCellHover = (date: Date) => {
  const data = getDataForDate(date)
  emit('cellHover', data)
}

// Tooltip state
const hoveredCell = ref<{ date: string; count: number; records?: OutageRecord[] } | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })

const showTooltip = (event: MouseEvent, date: Date) => {
  if (!props.tooltips) return
  
  const data = getDataForDate(date)
  hoveredCell.value = data
  tooltipPosition.value = { x: event.clientX, y: event.clientY }
}

const hideTooltip = () => {
  hoveredCell.value = null
}

// Scroll to the most recent data on mount
const scrollContainerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (scrollContainerRef.value) {
    // Scroll to the right (most recent data)
    scrollContainerRef.value.scrollLeft = scrollContainerRef.value.scrollWidth
  }
})
</script>

<template>
  <div class="calendar-heatmap w-full overflow-hidden">
    <!-- Grid container with scrollable area -->
    <div class="heatmap-wrapper flex gap-2">
      <!-- Weekday labels (fixed) -->
      <div v-if="showWeekdayLabels" class="weekday-labels flex flex-col shrink-0 pt-6" :style="{ gap: `${cellGap}px` }">
        <div
          v-for="(label, index) in weekdayLabels"
          :key="label"
          class="weekday-label text-xs text-white/50 flex items-center justify-end pr-2 w-8"
          :style="{ height: `${cellSizePx}px` }"
        >
          <span v-if="index % 2 === 1">{{ label.slice(0, 1) }}</span>
        </div>
      </div>

      <!-- Scrollable content (labels + cells) -->
      <div ref="scrollContainerRef" class="scroll-container flex-1 overflow-x-auto pb-2">
        <!-- Year labels -->
        <div v-if="showMonthLabels" class="flex relative text-xs mb-2" :style="{ gap: `${cellGap}px`, minWidth: `${weeks.length * (cellSizePx + cellGap)}px`, height: '20px' }">
          <div
            v-for="label in monthLabels"
            :key="`${label.label}-${label.weekIndex}`"
            class="month-label absolute whitespace-nowrap transition-colors pointer-events-none text-white font-bold bg-white/10 px-2 py-0.5 rounded"
            :style="{ left: `${label.offset}px` }"
          >
            {{ label.label }}
          </div>
        </div>

        <!-- Calendar cells -->
        <div class="weeks-container flex" :style="{ gap: `${cellGap}px` }">
          <div
            v-for="(week, weekIndex) in weeks"
            :key="weekIndex"
            class="week flex flex-col shrink-0"
            :style="{ gap: `${cellGap}px` }"
          >
            <button
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="day-cell rounded-sm border transition-all duration-200 hover:ring-2 hover:ring-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
              :class="[
                getColorClass(getDataForDate(day).count),
                getDataForDate(day).count === 0 ? 'border-white/10' : '',
                isToday(day) ? 'ring-1 ring-white/40' : ''
              ]"
              :style="{
                width: `${cellSizePx}px`,
                height: `${cellSizePx}px`,
              }"
              :aria-label="`${format(day, 'MMM d, yyyy')}: ${getDataForDate(day).count} outages`"
              @click="handleCellClick(day)"
              @mouseenter="(event: MouseEvent) => { handleCellHover(day); showTooltip(event, day) }"
              @mouseleave="hideTooltip"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="hoveredCell && tooltips"
        class="heatmap-tooltip fixed z-50 px-3 py-2 bg-black/90 text-white text-xs rounded-lg shadow-lg pointer-events-none backdrop-blur-sm border border-white/10"
        :style="{
          left: `${tooltipPosition.x + 10}px`,
          top: `${tooltipPosition.y + 10}px`,
        }"
      >
        <div class="font-semibold">{{ format(parseISO(hoveredCell.date), 'MMM d, yyyy') }}</div>
        <div class="text-white/70 mt-1">
          {{ hoveredCell.count }} outage{{ hoveredCell.count !== 1 ? 's' : '' }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.scroll-container {
  /* Enable horizontal scroll */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.day-cell {
  cursor: pointer;
}

.day-cell:active {
  transform: scale(0.95);
}
</style>
