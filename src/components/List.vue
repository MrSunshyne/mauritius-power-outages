<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class>
    <ul role="list" class="divide-y divide-gray-200">
      <template v-for="(district, name) in props.data">
        <li v-for="(outage, index) in (district as any)" :key="index">
          <div class="block hover:bg-gray-50">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="min-w-0 flex-1 flex items-center">
                <div class="flex-shrink-0"></div>
                <div class="min-w-0 flex-1 px-4 md:flex justify-between md:gap-4">
                  <div>
                    <p class="mt-2 flex gap-2 items-center text-sm text-gray-500">
                      <carbon-map />
                      <span class="text-sm font-medium text-sky-600 truncate">{{ name }}</span>
                      <span class="truncate">{{ outage.locality }}</span>
                    </p>
                    <p class="mt-2 gap-2 text-sm text-gray-500">
                      <span class="block break-words">{{ outage.streets }}</span>
                    </p>
                  </div>
                  <div class="block">
                    <p class="text-sm text-gray-900">
                      from
                      <time datetime="2020-01-07">{{ new Date(outage.from).toLocaleString() }}</time>
                    </p>
                    <p class="text-sm text-gray-900">
                      to
                      <time datetime="2020-01-07">{{ new Date(outage.to).toLocaleString() }}</time>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
  },
})
</script>
