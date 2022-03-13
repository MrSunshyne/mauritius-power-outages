<!-- <script lang="ts">
export default {
  props: {
    color: {
      type: String,
      default: '#27AE60'
    }
  }
}
</script> -->

<template>
  <div class="flex items-center gap-2">
    <Logo class="w-8 h-8" />
    <div class="font-medium">
      <slot />
    </div>
  </div>
</template>
