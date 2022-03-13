<script setup lang="ts">
import { useQueryProvider } from 'vue-query'

useQueryProvider()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
