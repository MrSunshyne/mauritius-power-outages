<template>
  <div>
    <div class="p-10 rounded-xl glass flex flex-col gap-4 text-white">
      <h2>
        <slot name="title" />
      </h2>
      <slot />
    </div>
  </div>
</template>


<style scoped>
.glass {
  --theme-bg-color: rgba(16 18 27 / 80%);

  /* background-color: var(--theme-bg-color); */
  background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgb(1, 1, 50) 35%, rgb(0, 13, 37) 50%);


  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(20px);
}

.shine {
  --size: 2px;
  --color: hsl(125, 100%, 50%);
  box-shadow: 0 0 calc(calc(var(--size) * 4) * 2) var(--size) var(--color),
    inset 0 0 calc(var(--size) * 2) var(--size) var(--color);
  transition: all 0.3s linear;
}


h2 {
  @apply text-xl font-medium;
}
</style>
   