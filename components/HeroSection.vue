<template>
    <div class="relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[64rem] h-[32rem] rounded-full bg-blue-700/20 blur-3xl" />
            <div class="absolute top-48 right-[8%] w-[20rem] h-[20rem] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div class="relative z-10 flex flex-col items-center gap-12 px-4 py-20 sm:py-28 text-center">
            <div class="space-y-6 max-w-4xl">
                <h1 class="font-bold text-4xl sm:text-6xl">
                    Statistics of power outages in Mauritius
                </h1>
                <p class="text-xl sm:text-2xl text-white/60">
                    Every scheduled power cut on the island<span v-if="props.since"> since {{ props.since }}</span>
                </p>
            </div>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
                <div class="bg-white/5 rounded-xl px-4 py-5">
                    <div class="text-3xl sm:text-4xl font-black">
                        {{ (props.totalOutages ?? 0).toLocaleString('en-US') }}
                    </div>
                    <div class="uppercase font-medium text-white/50 text-xs tracking-wider mt-2">
                        outages recorded
                    </div>
                </div>

                <div class="bg-white/5 rounded-xl px-4 py-5">
                    <div class="text-3xl sm:text-4xl font-black">
                        {{ props.hoursWasted ?? 0 }}
                    </div>
                    <div class="uppercase font-medium text-white/50 text-xs tracking-wider mt-2">
                        dark hours
                    </div>
                </div>

                <div class="bg-white/5 rounded-xl px-4 py-5">
                    <div class="text-3xl sm:text-4xl font-black">
                        {{ props.avgDurationHours ?? 0 }}h
                    </div>
                    <div class="uppercase font-medium text-white/50 text-xs tracking-wider mt-2">
                        average cut
                    </div>
                </div>

                <div class="bg-white/5 rounded-xl px-4 py-5">
                    <div class="text-3xl sm:text-4xl font-black">
                        {{ props.outagesTodayCount ?? 0 }}
                    </div>
                    <div class="uppercase font-medium text-white/50 text-xs tracking-wider mt-2">
                        cuts today
                    </div>
                </div>
            </div>

            <NuxtLink to="/"
                class="bg-white/90 text-blue-700 font-bold hover:bg-white/80 px-10 py-4 rounded-md uppercase cursor-pointer text-lg"
                data-umami-event="hero-cta-click">
                View today's power cuts
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    totalOutages?: number
    outagesTodayCount?: number
    hoursWasted?: string
    avgDurationHours?: number
    since?: string
}>()
</script>
