<template>
  <div class="grid gap-10">
    <template v-for="(outage) in props.data">
      <Cell :data="outage" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Record } from "@/types";

const props = defineProps({
  data: {
    type: Object as PropType<Record[]>,
  }
})
</script>  