<template>
  <div class="w-full max-w-3xl mx-auto px-4">
    <div class="text-center space-y-10 mb-12">
      <h2>
        {{ props.title }}
      </h2>
      <p>The localities with the most scheduled outages — click one for its full history</p>
    </div>
    <ol class="space-y-1">
      <li v-for="(item, index) in props.items" :key="item.slug">
        <NuxtLink
          :to="`/locality/${item.slug}`"
          class="flex items-center gap-4 rounded-lg px-3 py-2 group hover:bg-white/5 transition-colors"
          :data-umami-event="'stats-top-locality-click'"
        >
          <span class="w-6 text-right text-white/40 tabular-nums shrink-0">{{ index + 1 }}</span>
          <span class="w-36 sm:w-48 truncate text-white/90 group-hover:text-white group-hover:underline shrink-0">
            {{ item.name }}
          </span>
          <span class="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
            <span
              class="block h-full rounded-full bg-[#008FFB] group-hover:bg-[#3ba7ff] transition-colors"
              :style="{ width: `${(item.count / maxCount) * 100}%` }"
            />
          </span>
          <span class="w-12 text-right tabular-nums text-white/80 shrink-0">{{ item.count.toLocaleString('en-US') }}</span>
          <span class="hidden sm:block w-24 text-right tabular-nums text-white/40 text-sm shrink-0">{{ item.hours.toLocaleString('en-US') }}h lost</span>
        </NuxtLink>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
interface TopLocality {
  name: string
  slug: string
  count: number
  hours: number
}

const props = defineProps<{
  items: TopLocality[]
  title: string
}>()

const maxCount = computed(() => Math.max(...props.items.map(item => item.count), 1))
</script>
