<template>
  <div
    class="p-4 rounded-xl glass flex flex-col gap-4 text-white"
    :class="{ 'bg-black dark': ongoing }"
  >
    <div class="md:flex justify-between">
      <div class="relative">
        <div>
          <div class="font-bold">{{ props.data.locality }}</div>
          <div>{{ timeUntil }}</div>
        </div>
        <div class="text-xs max-w-xl text-gray-400">{{ props.data.streets }}</div>
      </div>
      <!-- <div>Currently during powercut {{ ongoing }}</div> -->
      <div class="md:flex items-center justify-end">
        <div class="md:flex flex-col items-end">
          <div class="inline md:block">Power will {{ ongoing ? 'resume' : 'cut' }} in</div>
          <div class="inline md:block">
            <vue-countdown
              :time="timeDifference"
              v-slot="{ days, hours, minutes, seconds }"
            >{{ days ? days + 'd,' : '' }} {{ hours ? hours + 'h,' : '' }} {{ minutes }}m, {{ seconds }}s.</vue-countdown>
          </div>
        </div>
        <div class="absolute top-0 right-0 md:relative w-16 h-16 grid place-items-center">
          <RomanticCandle class="absolute right-[-25px] top-[-60px] scale-[0.2]" v-if="ongoing" />
          <div
            v-else
            class="w-2 h-2 relative left-[4px] top-[4px] shine rounded-full bg-green-500"
          >&nbsp;</div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script setup lang="ts">
import { Record } from "@/types";
import { PropType } from "vue";
import { useTimeAgo } from '@vueuse/core'
import VueCountdown from '@chenfengyuan/vue-countdown';

const props = defineProps({
  data: {
    type: Object as PropType<Record>,
    default: {
      date: "string",
      locality: "string",
      streets: "string",
      district: "District",
      from: "Date",
      to: "Date",
      id: "string"
    },
  },
})

const timeUntil = useTimeAgo(new Date(props.data.from))

const timeDifference = computed(() => {
  const target = new Date(props.data.from)
  const now = new Date()
  return Math.abs(target.getTime() - now.getTime())
})

const ongoing = computed(() => {
  let on = false
  const from = new Date(props.data.from)
  const to = new Date(props.data.to)
  const now = new Date()

  if (now.getTime() > from.getTime()) {
    on = true
  }

  if (now.getTime() > to.getTime()) {
    on = false
  }

  return on
})

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
  --theme-bg-color: rgba(16 18 27 / 40%);

  background-color: var(--theme-bg-color);

  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.glass.dark {
  --theme-bg-color: rgba(16 18 27 / 80%);
}
</style>
   