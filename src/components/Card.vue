<template>
  <div>
    <div class="card p-10 rounded-xl flex flex-col gap-4 text-white"
      :class="[props.enabledClasses]">
      <h2>
        <slot name="title" />
      </h2>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  enabledClasses: {
    type: String,
    default: "glass",
  },
});

</script>


<style scoped>
.shine {
  --size: 2px;
  --color: hsl(125, 100%, 50%);
  box-shadow: 0 0 calc(calc(var(--size) * 4) * 2) var(--size) var(--color),
    inset 0 0 calc(var(--size) * 2) var(--size) var(--color);
  transition: all 0.3s linear;
}


/* h2 {
  @apply text-xl font-medium;
} */
</style>
   