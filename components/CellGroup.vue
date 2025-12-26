<template>
  <div class="grid gap-4 sm:gap-6">
    <template v-for="outage in props.data" :key="outage.id">
      <Cell :data="outage" :selected-outage-id="props.selectedOutageId" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Record } from '~/types'

const props = defineProps<{
  data?: Record[]
  selectedOutageId?: string | null
}>()
</script>
