<template>
    <header class="">
        <div class="flex flex-col gap-4">
            <!-- Logo and Title -->
            <NuxtLink to="/" class="group" data-umami-event="header-home-click">
                <div class="flex items-center gap-3">
                    <!-- Icon -->
                    <div class="relative flex-shrink-0">
                        <!-- Icon container -->
                        <div
                            class="relative p-2 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
                        >
                            <Icon
                                name="mdi:lightning-bolt"
                                class="text-xl sm:text-2xl text-slate-900"
                            />
                        </div>
                    </div>

                    <!-- Title and Subtitle -->
                    <div class="flex flex-col gap-1 min-w-0 flex-1">
                        <h1
                            class="text-lg sm:text-xl font-bold text-white leading-tight group-hover:text-yellow-50 transition-colors"
                        >
                            Power Outages in Mauritius
                        </h1>
                        <ClientOnly>
                            <ViewCounter />
                        </ClientOnly>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </header>
</template>

<script setup lang="ts">
const route = useRoute();

// Get current date in YYYY-MM-DD format for Browse link
// Calculate once on server, will be the same on client during hydration
const currentDate = useState("header-current-date", () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
});
</script>
