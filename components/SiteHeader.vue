<template>
    <header class="">
        <div class="flex flex-col gap-4">
            <!-- Top Row: Logo and Stats -->
            <div class="flex items-start justify-between gap-4">
                <!-- Left: Logo/Title Area -->
                <NuxtLink to="/" class="group flex-1 min-w-0" data-umami-event="header-home-click">
                    <div class="flex items-center gap-3">
                        <!-- Icon -->
                        <div class="relative flex-shrink-0">
                            <!-- Icon container -->
                            <div
                                class="relative p-2 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Icon name="mdi:lightning-bolt" class="text-xl sm:text-2xl  text-slate-900" />
                            </div>
                        </div>

                        <!-- Title -->
                        <div class="flex flex-col min-w-0">
                            <h1
                                class="text-xl sm:text-xl font-bold text-white leading-tight group-hover:text-yellow-50 transition-colors truncate">
                                Power Outages in Mauritius
                            </h1>

                        </div>
                    </div>
                </NuxtLink>

                <!-- Right: Stats -->
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <ClientOnly>
                        <ViewCounter />
                    </ClientOnly>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const route = useRoute()

// Get current date in YYYY-MM-DD format for Browse link
// Calculate once on server, will be the same on client during hydration
const currentDate = useState('header-current-date', () => {
    const now = new Date()
    return now.toISOString().split('T')[0]
})
</script>
