<template>
  <div class="grid gap-4 sm:gap-6">
    <template v-for="(outage) in props.data" :key="outage.id">
      <Cell :data="outage" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Record } from '@/types'

const props = defineProps({
  data: {
    type: Object as PropType<Record[]>,
  },
})
</script>
