<template>
    <div class="text-gray-700 min-h-screen flex flex-col">
        <!-- Static Header - Full Width - Never animates -->
        <div class="w-full px-4 sm:px-6 py-5 sm:py-6">
            <SiteHeader />
        </div>

        <!-- Animated Content Area -->
        <main class="flex-1 flex flex-col pt-6 sm:pt-8">
            <slot />
        </main>
    </div>
</template>
