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
  <svg
    viewBox="0 0 800 800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="text-primary-500"
  >
    <path
      d="M0 102C0 45.667 45.667 0 102 0H698C754.333 0 800 45.667 800 102V698C800 754.333 754.333 800 698 800H102C45.667 800 0 754.333 0 698V102Z"
      fill="currentColor"
    />
    <mask
      id="mask0_2:3"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="800"
      height="800"
    >
      <rect width="800" height="800" rx="102" fill="currentColor" />
    </mask>
    <g mask="url(#mask0_2:3)">
      <rect x="400" width="400" height="400" fill="black" fill-opacity="0.35" />
      <rect
        x="400"
        y="400"
        width="400"
        height="400"
        fill="black"
        fill-opacity="0.47"
      />
      <rect y="400" width="400" height="400" fill="black" fill-opacity="0.28" />
      <rect width="400" height="400" fill="black" fill-opacity="0.17" />
    </g>
  </svg>
</template>
