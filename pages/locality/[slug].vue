<script setup lang="ts">
import { format } from "date-fns";
import { API_URLS } from "~/utils/api";
import type { Record } from "~/types";
import LocalityCell from "~/components/LocalityCell.vue";
import { generateSlug } from "~/utils/slug";
import { formatDate } from "~/utils/helpers";

definePageMeta({
    layout: "default",
});

const route = useRoute();
const slug = route.params.slug as string;

interface LocalityResponse {
    name: string;
    slug: string;
    district: string;
    outageCount: number;
    outages: Record[];
    firstOutage: string;
}

const localityData = ref<LocalityResponse | null>(null);
const isLoading = ref(true);

const fetchLocality = async () => {
    try {
        const response = await $fetch<string>(API_URLS.locality(slug));
        const data =
            typeof response === "string" ? JSON.parse(response) : response;

        // Transform outages to add locality fields that Cell component expects
        const transformedOutages: Record[] = data.outages.map(
            (outage: any) => ({
                date: outage.date,
                locality: data.name,
                localitySlug: data.slug,
                streets: outage.streets,
                district: data.district,
                from: new Date(outage.from),
                to: new Date(outage.to),
                id: outage.id,
                firstOutage: data.firstOutage,
            }),
        );

        localityData.value = {
            name: data.name,
            slug: data.slug,
            district: data.district,
            outageCount: data.outageCount,
            outages: transformedOutages,
            firstOutage: data.firstOutage,
        };
    } catch (e) {
        console.error("Failed to fetch locality:", e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchLocality();
});

const districtLabel = computed(() => {
    if (!localityData.value) return "";
    return localityData.value.district
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/^./, (str) => str.toUpperCase());
});

const localityName = computed(() => {
    const name = localityData.value?.name || "";
    if (name) return name;
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
});

const title = computed(
    () => `Power Outages in ${localityName.value} - Mauritius`,
);
const description = computed(() => {
    const count = localityData.value?.outageCount || 0;
    return `View all ${count} scheduled power outages in ${localityName.value}, ${districtLabel.value} district.`;
});

// Breadcrumb
const breadcrumbItems = computed(() => [
    { label: "Localities" },
    { label: localityName.value },
]);

useSeoMeta({
    title: title,
    description: description,
    ogTitle: title,
    ogDescription: description,
});

defineOgImageComponent("Outage", {
    heading: localityName,
    title: "Power Outages in Mauritius",
    columnPercentClass: "max-w-[65%]",
    description: computed(
        () =>
            `${localityData.value?.outageCount || 0} outages recorded in this locality`,
    ),
    icon: "solar:lightbulb-bolt-broken",
    theme: "#FFD500",
    colorMode: "dark",
    tagline: "View more details",
    taglineRight: "A project by Sandeep Ramgolam",
});
</script>

<template>
    <PageContainer>
        <Breadcrumb :items="breadcrumbItems" />

        <header class="mb-6">
            <h1
                class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2"
            >
                {{ localityName }}
            </h1>
            <p class="text-white/70 capitalize">{{ districtLabel }} District</p>
            <p v-if="localityData" class="text-white/50 text-sm mt-1">
                {{ localityData.outageCount }} recorded outage{{
                    localityData.outageCount !== 1 ? "s" : ""
                }}
                since {{ formatDate(localityData.firstOutage) }}
            </p>
        </header>

        <div class="flex flex-col gap-6 sm:gap-8">
            <div
                v-if="isLoading"
                class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg"
            >
                Loading outage data...
            </div>

            <template v-else-if="localityData">
                <div
                    v-if="localityData.outages.length > 0"
                    class="grid gap-4 sm:gap-6"
                >
                    <LocalityCell
                        v-for="outage in localityData.outages"
                        :key="outage.id"
                        :data="outage"
                    />
                </div>
                <div
                    v-else
                    class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg"
                >
                    No historical outages recorded for this locality
                </div>
            </template>

            <template v-else>
                <div
                    class="py-12 sm:py-16 text-white/50 text-center text-base sm:text-lg"
                >
                    Locality not found
                </div>
            </template>
        </div>

        <footer class="mt-auto pt-8 pb-24 sm:pb-0">
            <SiteFooter />
        </footer>
    </PageContainer>
</template>
