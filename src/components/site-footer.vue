<template>
  <div
    class="text-sm flex gap-4 flex-col md:flex-row justify-center md:justify-between text-center text-white"
  >
    <a href="https://github.com/MrSunshyne/mauritius-dataset-electricity">
      <carbon-data-base />Data Source
    </a>

    <a href="https://sandeep.ramgolam.com">
      <carbon-paint-brush />Made by Sandeep Ramgolam
    </a>
    <a href="https://github.com/MrSunshyne/mauritius-power-outages">
      <carbon-logo-github />Source Code
    </a>
  </div>
</template>


<style scoped>
a {
  @apply hover:underline;
}

a svg {
  @apply mr-2 inline-block;
}
</style>