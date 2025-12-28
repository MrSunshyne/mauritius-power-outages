<template>
  <div
    class="p-4 sm:p-5 rounded-xl glass flex flex-col gap-3 text-white relative cursor-pointer hover:brightness-110 transition-all duration-200"
    :class="{ 'bg-black dark': state === 'ongoing' }"
    @click="handleCellClick"
    :data-umami-event="ANALYTICS_EVENTS.OUTAGE_VIEW_DETAIL"
  >
    <div class="md:flex md:justify-between md:items-center">
      <div class="relative pr-14 sm:pr-16 md:pr-0">
        <div class="mb-1">
          <div class="text-xs uppercase text-white/70">{{ timeUntil }} <span class="text-white/40">{{ formatDate(props.data.from) }} - {{ formatDate(props.data.to) }}</span></div>
          <div class="font-bold text-base sm:text-lg">{{ props.data.locality }}</div>
        </div>
        <div class="text-sm max-w-xl text-blue-300 md:py-0 capitalize leading-relaxed">{{ props.data.streets }}</div>
      </div>
      <div class="md:flex text-sm items-center justify-end mt-3 pt-3 border-t border-white/10 md:mt-0 md:pt-0 md:border-0">
        <div class="md:flex flex-col md:items-end">
          <div class="inline md:block text-white/70">Power {{ state === 'ongoing' ? 'will resume in' : state === 'upcoming' ? 'will cut in' : 'resumed at' }}</div>
          <div class="inline md:block font-medium ml-1 md:ml-0">
            <ClientOnly>
              <!-- Show time for past outages, countdown for ongoing/upcoming -->
              <span v-if="state === 'past'">{{ formatDate(props.data.to) }}</span>
              <vue-countdown
                v-else
                v-slot="{ days, hours, minutes, seconds }"
                :time="timeDifference"
              >{{ days ? days + 'd ' : '' }}{{ hours ? hours + 'h ' : '' }}{{ minutes }}m {{ seconds }}s</vue-countdown>
              <template #fallback>
                <span>Loading...</span>
              </template>
            </ClientOnly>
          </div>
        </div>
        <div class="absolute top-3 right-3 sm:top-4 sm:right-4 md:relative md:top-0 md:right-0">
          <OutageIndicator :state="state" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueCountdown from '@chenfengyuan/vue-countdown'
import { useTimeAgo, useDateFormat } from '@vueuse/core'
import type { Record } from '~/types'
import { ANALYTICS_EVENTS } from '~/constants/analytics'

const props = defineProps<{
  data: Record
}>()

// VueUse time ago - reactive and auto-updates
const timeUntil = useTimeAgo(new Date(props.data.from))

const handleCellClick = () => {
  // Redirect directly to clean URL page for consistent experience
  const cleanUrl = `/outage/${props.data.id}`
  const router = useRouter()
  router.push(cleanUrl)
}

const state = computed(() => {
  let on = 'upcoming'
  const from = new Date(props.data.from)
  const to = new Date(props.data.to)
  const now = new Date()

  if (now.getTime() > from.getTime())
    on = 'ongoing'

  if (now.getTime() > to.getTime())
    on = 'past'

  return on
})

const timeDifference = computed(() => {
  let target

  if (state.value === 'ongoing')
    target = new Date(props.data.to)
  else if (state.value === 'upcoming')
    target = new Date(props.data.from)
  else
    target = new Date(props.data.to)

  const now = new Date()
  return Math.abs(target.getTime() - now.getTime())
})

// VueUse date formatting
function formatDate(date: Date | string) {
  const formatted = useDateFormat(date, 'HH:mm')
  return formatted.value
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
