<template>
  <div
    class="p-4 rounded-xl glass flex flex-col gap-4 text-white relative"
    :class="{ 'bg-black dark': state === 'ongoing' }"
  >
    <div class="md:flex justify-between">
      <div class="relative">
        <div>
          <div class="text-xs uppercase">{{ timeUntil }} <span class="text-gray-400"> from {{ formatDate(props.data.from) }} to {{ formatDate(props.data.to) }}</span></div>
          <div class="font-bold">{{ props.data.locality }}</div>
        </div>
        <div class="text-sm max-w-xl text-blue-300 pr-10 py-2 md:py-0 capitalize">{{ props.data.streets }}</div>
      </div>
      <!-- <div>Currently during powercut {{ state }}</div> -->
      <div class="md:flex text-sm items-center justify-end">
        <div class="md:flex flex-col items-end">
          <div
            class="inline md:block"
          >Power {{ state === 'ongoing' ? 'will resume in' : state === 'upcoming' ? 'will cut in' : 'has resumed since' }}</div>
          <div class="inline md:block">
            <vue-countdown
              v-slot="{ days, hours, minutes, seconds }"
              :time="timeDifference"
            >{{ days ? days + 'd,' : '' }} {{ hours ? hours + 'h' : '' }} {{ minutes }}m {{ seconds }}s</vue-countdown>
          </div>
        </div>
        <div class="absolute top-0 right-0 md:relative w-16 h-16 grid place-items-center">
          <RomanticCandle
            v-if="state === 'ongoing'"
            class="absolute right-[-25px] top-[-40px] md:top-[-60px] scale-[0.2]"
          />

          <div
            v-else
            class="w-2 h-2 relative left-[4px] top-[4px] shine rounded-full bg-green-500"
          >&nbsp;</div>
          <!-- <RomanticBulb class="scale-[0.2] relative right-[-8px] top-[0px] md:top-[-4px]" v-else /> -->
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
// import RomanticBulb from "./RomanticBulb.vue";

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
