<template>
  <div
    class="p-4 sm:p-5 rounded-xl glass flex flex-col gap-3 text-white relative"
    :class="{ 'bg-black dark': state === 'ongoing' }"
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
          <div class="inline md:block text-white/70">Power {{ state === 'ongoing' ? 'will resume in' : state === 'upcoming' ? 'will cut in' : 'has resumed since' }}</div>
          <div class="inline md:block font-medium ml-1 md:ml-0">
            <vue-countdown
              v-slot="{ days, hours, minutes, seconds }"
              :time="timeDifference"
            >{{ days ? days + 'd ' : '' }}{{ hours ? hours + 'h ' : '' }}{{ minutes }}m {{ seconds }}s</vue-countdown>
          </div>
        </div>
        <div class="absolute top-3 right-3 sm:top-4 sm:right-4 md:relative md:top-0 md:right-0 w-12 h-12 sm:w-16 sm:h-16 grid place-items-center">
          <RomanticCandle
            v-if="state === 'ongoing'"
            class="absolute right-[-25px] top-[-40px] md:top-[-60px] scale-[0.2]"
          />
          <div
            v-else
            class="w-2.5 h-2.5 shine rounded-full bg-green-500"
          >&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useTimeAgo, useDateFormat } from '@vueuse/core'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { Record } from '@/types'

const props = defineProps({
  data: {
    type: Object as PropType<Record>,
    default: () => ({
      date: 'string',
      locality: 'string',
      streets: 'string',
      district: 'District',
      from: 'Date',
      to: 'Date',
      id: 'string',
    }),
  },
})

const timeUntil = useTimeAgo(new Date(props.data.from))

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

function formatDate (date: Date) {
  let formatted =  useDateFormat(date, 'HH:mm')
  return formatted.value.replaceAll('""', '')
}

</script>

<style scoped>
.shine {
  --size: 2px;
  --color: hsl(125, 100%, 50%);
  box-shadow: 0 0 calc(calc(var(--size) * 4) * 2) var(--size) var(--color),
    inset 0 0 calc(var(--size) * 2) var(--size) var(--color);
  transition: all 0.3s linear;
}

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
