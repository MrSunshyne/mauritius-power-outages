<script setup lang="ts">
import { useQueryProvider } from 'vue-query'

useQueryProvider({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
</script>


<template>
  <router-view v-slot="{ Component }">
    <transition name="slide"
      mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
