<template>
    <div>
        <!-- Desktop Navigation -->
        <div class="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white flex-shrink min-w-0">
                <slot name="title">{{ dateLabel }}</slot>
            </h2>
            <div class="flex gap-2 flex-shrink-0">
                <button class="btn btn-nav" :disabled="disabled" @click="$emit('prev')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span>Previous</span>
                </button>
                <button v-if="showToday" class="btn btn-today" :disabled="disabled" @click="$emit('today')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
                    </svg>
                    <span>Today</span>
                </button>
                <button class="btn btn-nav" :disabled="disabled" @click="$emit('next')">
                    <span>Next</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
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
        <nav class="fixed bottom-0 left-0 right-0 sm:hidden mobile-nav z-50">
            <div class="max-w-4xl mx-auto px-4 py-3 flex gap-2">
                <button @click="$emit('prev')" class="btn-mobile group" :disabled="disabled">
                    <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span class="font-medium">Prev</span>
                </button>
                <button v-if="showToday" @click="$emit('today')" class="btn-mobile btn-mobile-today group" :disabled="disabled">
                    <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/>
                    </svg>
                    <span class="font-medium">Today</span>
                </button>
                <button @click="$emit('next')" class="btn-mobile group" :disabled="disabled">
                    <span class="font-medium">Next</span>
                    <svg class="w-5 h-5 transition-transform group-active:scale-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    dateLabel?: string
    showToday?: boolean
    disabled?: boolean
}>()

defineEmits<{
    prev: []
    next: []
    today: []
}>()
</script>

<style scoped>
/* Desktop buttons */
.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    border-radius: 0.75rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgb(255 255 255 / 0.15), rgb(255 255 255 / 0.05));
    opacity: 0;
    transition: opacity 0.2s;
}

.btn:hover::before {
    opacity: 1;
}

.btn-nav {
    background-color: rgb(255 255 255 / 0.08);
    border: 1px solid rgb(255 255 255 / 0.12);
}

.btn-nav:hover {
    background-color: rgb(255 255 255 / 0.12);
    border-color: rgb(255 255 255 / 0.18);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
}

.btn-nav:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
}

.btn-today {
    background: linear-gradient(135deg, rgb(59 130 246 / 0.25), rgb(37 99 235 / 0.15));
    border: 1px solid rgb(59 130 246 / 0.3);
}

.btn-today:hover {
    background: linear-gradient(135deg, rgb(59 130 246 / 0.35), rgb(37 99 235 / 0.25));
    border-color: rgb(59 130 246 / 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgb(59 130 246 / 0.25);
}

.btn-today:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgb(59 130 246 / 0.2);
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

.btn:disabled:hover::before {
    opacity: 0;
}

/* Mobile navigation */
.mobile-nav {
    background: linear-gradient(to top, rgb(0 0 0 / 0.95), rgb(0 0 0 / 0.85));
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-top: 1px solid rgb(255 255 255 / 0.08);
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -4px 24px rgb(0 0 0 / 0.4);
}

.btn-mobile {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    font-size: 0.875rem;
    color: white;
    border-radius: 0.875rem;
    background: linear-gradient(135deg, rgb(255 255 255 / 0.12), rgb(255 255 255 / 0.06));
    border: 1px solid rgb(255 255 255 / 0.15);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}

.btn-mobile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgb(255 255 255 / 0.2), transparent 70%);
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-mobile:active::before {
    opacity: 1;
    transform: scale(2);
}

.btn-mobile:active {
    background: linear-gradient(135deg, rgb(255 255 255 / 0.18), rgb(255 255 255 / 0.12));
    border-color: rgb(255 255 255 / 0.25);
    transform: scale(0.97);
}

.btn-mobile-today {
    background: linear-gradient(135deg, rgb(59 130 246 / 0.3), rgb(37 99 235 / 0.2));
    border: 1px solid rgb(59 130 246 / 0.35);
    box-shadow: 0 0 20px rgb(59 130 246 / 0.15);
}

.btn-mobile-today:active {
    background: linear-gradient(135deg, rgb(59 130 246 / 0.4), rgb(37 99 235 / 0.3));
    border-color: rgb(59 130 246 / 0.45);
    box-shadow: 0 0 24px rgb(59 130 246 / 0.25);
}

.btn-mobile:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
}

.btn-mobile:disabled:active {
    background: linear-gradient(135deg, rgb(255 255 255 / 0.12), rgb(255 255 255 / 0.06));
    border-color: rgb(255 255 255 / 0.15);
}

.btn-mobile:disabled::before {
    display: none;
}

/* Ensure icons don't get squished */
.btn-mobile svg,
.btn svg {
    flex-shrink: 0;
}
</style>
