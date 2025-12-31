<template>
    <div>
        <!-- Desktop Navigation -->
        <div class="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
            <h2
                class="text-xl sm:text-2xl md:text-3xl font-bold text-white flex-shrink min-w-0"
            >
                <slot name="title">{{ dateLabel }}</slot>
            </h2>
            <div class="flex gap-2 flex-shrink-0">
                <button
                    class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 ease-out bg-gradient-to-br from-white/12 to-white/6 border border-white/12 hover:from-white/15 hover:to-white/10 hover:border-white/20 hover:shadow-[0_4px_12px_rgb(0_0_0/0.15)] active:from-white/18 active:to-white/12 active:border-white/25 active:scale-[0.97] active:shadow-[0_2px_4px_rgb(0_0_0/0.1)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-white/12 disabled:hover:to-white/6 disabled:hover:border-white/12 disabled:hover:shadow-none disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('prev')"
                >
                    <svg
                        class="w-4 h-4 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span>Previous</span>
                </button>
                <button
                    v-if="showToday"
                    class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 ease-out bg-gradient-to-br from-blue-500/25 to-blue-600/15 border border-blue-500/30 hover:from-blue-500/35 hover:to-blue-600/25 hover:border-blue-500/40 hover:shadow-[0_4px_16px_rgb(59_130_246/0.25)] active:from-blue-500/40 active:to-blue-600/30 active:border-blue-500/45 active:scale-[0.97] active:shadow-[0_2px_8px_rgb(59_130_246/0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-blue-500/25 disabled:hover:to-blue-600/15 disabled:hover:border-blue-500/30 disabled:hover:shadow-none disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('today')"
                >
                    <svg
                        class="w-4 h-4 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                            stroke-width="2"
                        />
                        <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
                    </svg>
                    <span>Today</span>
                </button>
                <button
                    class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 ease-out bg-gradient-to-br from-white/12 to-white/6 border border-white/12 hover:from-white/15 hover:to-white/10 hover:border-white/20 hover:shadow-[0_4px_12px_rgb(0_0_0/0.15)] active:from-white/18 active:to-white/12 active:border-white/25 active:scale-[0.97] active:shadow-[0_2px_4px_rgb(0_0_0/0.1)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-white/12 disabled:hover:to-white/6 disabled:hover:border-white/12 disabled:hover:shadow-none disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('next')"
                >
                    <span>Next</span>
                    <svg
                        class="w-4 h-4 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Date Header -->
        <div class="sm:hidden">
            <h2 class="text-xl font-bold text-white">
                <slot name="title">{{ dateLabel }}</slot>
            </h2>
        </div>

        <!-- Mobile Navigation -->
        <nav
            class="mobile-nav fixed bottom-0 left-0 right-0 sm:hidden z-50 border-t border-white/8"
        >
            <div class="max-w-4xl mx-auto px-4 py-3 flex gap-2">
                <button
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-4 text-sm text-white rounded-[14px] bg-gradient-to-br from-white/12 to-white/6 border border-white/15 transition-all duration-200 ease-out touch-manipulation [-webkit-tap-highlight-color:transparent] active:from-white/18 active:to-white/12 active:border-white/25 active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:active:from-white/12 disabled:active:to-white/6 disabled:active:border-white/15 disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('prev')"
                >
                    <svg
                        class="w-5 h-5 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span class="font-medium">Prev</span>
                </button>
                <button
                    v-if="showToday"
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-4 text-sm text-white rounded-[14px] bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/35 shadow-[0_0_20px_rgb(59_130_246/0.15)] transition-all duration-200 ease-out touch-manipulation [-webkit-tap-highlight-color:transparent] active:from-blue-500/40 active:to-blue-600/30 active:border-blue-500/45 active:shadow-[0_0_24px_rgb(59_130_246/0.25)] active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:active:from-blue-500/30 disabled:active:to-blue-600/20 disabled:active:border-blue-500/35 disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('today')"
                >
                    <svg
                        class="w-5 h-5 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                            stroke-width="2"
                        />
                        <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
                    </svg>
                    <span class="font-medium">Today</span>
                </button>
                <button
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-4 text-sm text-white rounded-[14px] bg-gradient-to-br from-white/12 to-white/6 border border-white/15 transition-all duration-200 ease-out touch-manipulation [-webkit-tap-highlight-color:transparent] active:from-white/18 active:to-white/12 active:border-white/25 active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:active:from-white/12 disabled:active:to-white/6 disabled:active:border-white/15 disabled:active:scale-100"
                    :disabled="disabled"
                    @click="$emit('next')"
                >
                    <span class="font-medium">Next</span>
                    <svg
                        class="w-5 h-5 shrink-0 transition-transform active:scale-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    dateLabel?: string;
    showToday?: boolean;
    disabled?: boolean;
}>();

defineEmits<{
    prev: [];
    next: [];
    today: [];
}>();
</script>

<style scoped>
/* Mobile navigation - custom background gradient and safe area */
.mobile-nav {
    background: linear-gradient(to top, rgb(0 0 0 / 0.95), rgb(0 0 0 / 0.85));
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -4px 24px rgb(0 0 0 / 0.4);
}
</style>
