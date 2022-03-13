<script setup lang="ts">
import menu from '@/logic/navigation'
import { isDark, toggleDark } from '@/logic'

const route = useRoute()
const currentPath = route.path

</script>

<template>
  <div class="flex justify-center">
    <nav class="text-xl mt-6 flex mx-auto">
      {{ currentPath }}
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.path"
        :class="[item.path === currentPath ? 'bg-gray-100 text-red-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']"
      >
        <div>i</div>
        {{ item.name }}
      </router-link>

      <button class="icon-btn mx-2 !outline-none" title="button.toggle_dark" @click="toggleDark()">
        <carbon-moon v-if="isDark" />
        <carbon-sun v-else />
      </button>
    </nav>
  </div>
</template>
