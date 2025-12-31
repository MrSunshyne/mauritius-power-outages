<template>
    <nav v-if="items.length > 0" class="flex items-center gap-2 text-white/50 text-xs mb-4 uppercase">
        <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
        <template v-for="(item, index) in items" :key="index">
            <span class="text-white/30">/</span>
            <NuxtLink v-if="item.to" :to="item.to" class="hover:text-white transition-colors">
                {{ item.label }}
            </NuxtLink>
            <span v-else class="text-white/70">{{ item.label }}</span>
        </template>
    </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
    label: string
    to?: string
}

defineProps<{
    items: BreadcrumbItem[]
}>()
</script>
