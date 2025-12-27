<script setup>
import { useOgImageRuntimeConfig } from "#og-image/app/utils"

import { useSiteConfig } from "#site-config/app/composables"

import { computed, defineComponent, h, resolveComponent } from "vue"

const props = defineProps({
    heading: { type: String, required: false },
    colorMode: { type: String, required: false },
    columnPercentClass: { type: Number, required: false },
    title: { type: String, required: false, default: "title" },
    descriptionHeading: { type: String, required: false },
    description: { type: String, required: false },
    icon: { type: [String, Boolean], required: false },
    tagline: { type: String, required: false },
    taglineRight: { type: String, required: false },
    theme: { type: String, required: false, default: "#00dc82" },
    date: { type: String, required: false },
    time: { type: String, required: false }
})

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const runtimeConfig = useOgImageRuntimeConfig()

const colorMode = computed(() => {
    return props.colorMode || runtimeConfig.colorPreference || "light"

})

const columnPercentClass = computed(() => {
    return props.columnPercentClass || 'max-w-[65%]'

})

const themeHex = computed(() => {
    if (HexRegex.test(props.theme))
        return props.theme

    if (HexRegex.test(`#${props.theme}`))
        return `#${props.theme}`

    if (props.theme.startsWith("rgb")) {
        const rgb = props.theme.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",").map((v) => Number.parseInt(v.trim(), 10))

        const hex = rgb.map((v) => {
            const hex2 = v.toString(16)

            return hex2.length === 1 ? `0${hex2}` : hex2

        }).join("")

        return `#${hex}`

    }
    return "#FFFFFF"

})

const themeRgb = computed(() => {
    return themeHex.value.replace("#", "").match(/.{1,2}/g)?.map((v) => Number.parseInt(v, 16)).join(", ")

})

const siteConfig = useSiteConfig()

const tagline = computed(() => {
    return props.tagline || siteConfig.name
})

const heading = computed(() => {
    return props.heading || null
})

const siteLogo = computed(() => {
    return props.siteLogo || siteConfig.logo

})

const IconComponent = runtimeConfig.hasNuxtIcon ? resolveComponent("Icon") : defineComponent({
    render() {
        return h("div", "missing @nuxt/icon")

    }
})

if (typeof props.icon === "string" && !runtimeConfig.hasNuxtIcon && process.dev) {
    console.warn("Please install `@nuxt/icon` to use icons with the fallback OG Image component.")

    console.log("\nnpx nuxi module add icon\n")

}
</script>

<template>
    <div class="w-full h-full flex justify-between relative p-[60px]" :class="[
        colorMode === 'light' ? ['bg-white', 'text-gray-900'] : ['bg-gray-900', 'text-white']
    ]">
        <div class="flex absolute top-0 right-[-100%]" :style="{
            width: '200%',
            height: '200%',
            backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.5) 0%,  ${colorMode === 'dark' ? 'rgba(5, 5, 5,0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${props.colorMode === 'dark' ? 'rgba(5, 5, 5,0)' : 'rgba(255, 255, 255, 0)'} 70%)`
        }" />
        <div class="h-full w-full justify-between relative">
            <div class="flex flex-row justify-between items-start">
                <div class="flex flex-col w-full gap-4" :class=[columnPercentClass]>
                    <div class="text-[20px] uppercase font-bold" v-if="heading">
                        {{ heading }}
                    </div>
                    <h1 class="m-0 font-bold text-[60px]" style="display: block; text-overflow: ellipsis;"
                        :style="{ lineClamp: description ? 2 : 3 }">
                        {{ title }}
                    </h1>
                    <p v-if="description" class="text-[30px] leading-10" :class="[
                        colorMode === 'light' ? ['text-gray-700'] : ['text-gray-300']
                    ]" style="display: inline; line-clamp: 3; text-overflow: ellipsis;">

                        <span v-if="descriptionHeading">{{ descriptionHeading }}</span><span class="lowercase">{{
                            description }}</span>
                    </p>

                    <!-- Date and Time -->
                    <div class="text-[35px] leading-10 font-bold" style="display: inline; line-clamp: 3; text-overflow:
                        ellipsis;">
                        <div>
                            {{ date }}
                        </div>
                        <div>
                            {{ time }}
                        </div>
                    </div>
                </div>
                <div v-if="Boolean(icon)" style="width: 30%;" class="flex justify-end">
                    <IconComponent :name="icon" mode="svg" class="mt-[100px] w-[250px] h-[250px]" />
                </div>
            </div>
            <div class="flex flex-row justify-between w-full">
                <p v-if="tagline" style="font-size: 25px;" class="font-bold">
                    {{ tagline }}
                </p>
                <p v-if="taglineRight" style="font-size: 25px;" class="font-bold">
                    {{ taglineRight }}
                </p>
            </div>
        </div>
    </div>
</template>
