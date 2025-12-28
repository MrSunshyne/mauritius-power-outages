<template>
  <div class="outage-indicator" :class="[`outage-indicator--${size}`]">
    <RomanticCandle
      v-if="state === 'ongoing'"
      class="candle"
      :class="[`candle--${size}`]"
    />
    <div
      v-else-if="state === 'upcoming'"
      class="dot shine shine-upcoming"
      :class="[`dot--${size}`]"
    ></div>
    <div
      v-else
      class="dot shine shine-past"
      :class="[`dot--${size}`]"
    ></div>
  </div>
</template>

<script setup lang="ts">
type OutageState = 'ongoing' | 'upcoming' | 'past'
type IndicatorSize = 'sm' | 'md' | 'lg'

withDefaults(defineProps<{
  state: OutageState
  size?: IndicatorSize
}>(), {
  size: 'sm'
})
</script>

<style scoped>
.outage-indicator {
  display: grid;
  place-items: center;
  position: relative;
}

.outage-indicator--sm {
  width: 3rem;
  height: 3rem;
}

.outage-indicator--md {
  width: 4rem;
  height: 4rem;
}

.outage-indicator--lg {
  width: 6rem;
  height: 6rem;
}

/* Candle positioning */
.candle {
  position: absolute;
}

.candle--sm {
  right: -35px;
  top: -65px;
  transform: scale(0.2);
}

.candle--md {
  right: -20px;
  top: -50px;
  transform: scale(0.25);
}

.candle--lg {
  right: -10px;
  top: -60px;
  transform: scale(0.35);
}

/* Dot sizes */
.dot {
  border-radius: 9999px;
}

.dot--sm {
  width: 0.625rem;
  height: 0.625rem;
}

.dot--md {
  width: 0.875rem;
  height: 0.875rem;
}

.dot--lg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Shine effect */
.shine {
  --size: 2px;
  box-shadow: 0 0 calc(calc(var(--size) * 4) * 2) var(--size) var(--color),
    inset 0 0 calc(var(--size) * 2) var(--size) var(--color);
  transition: all 0.3s linear;
}

.shine-upcoming {
  --color: hsl(50, 100%, 50%);
  background-color: rgb(234 179 8); /* bg-yellow-500 */
}

.shine-past {
  --color: hsl(125, 100%, 50%);
  background-color: rgb(34 197 94); /* bg-green-500 */
}
</style>
