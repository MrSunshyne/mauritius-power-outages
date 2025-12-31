<template>
    <div
        class="group p-5 sm:p-6 rounded-xl glass text-white relative cursor-pointer hover:brightness-110 transition-all duration-200"
        @click="handleCellClick"
        :data-umami-event="ANALYTICS_EVENTS.OUTAGE_VIEW_DETAIL"
    >
        <!-- Main content -->
        <div class="space-y-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <!-- Location details -->
            <div class="text-lg leading-relaxed col-span-3">
                {{ props.data.streets }}
            </div>

            <!-- Time - most important -->
            <div class="text-right flex flex-col gap-2">
                <div class="text-xs font-mono font-medium">
                    lasted for {{ outrageDuration }}
                </div>
                <div class="text-xl font-bold tracking-tight text-right">
                    {{ formattedTime }}
                </div>
                <div class="text-xs tracking-wide text-white/50 uppercase">
                    {{ formattedDate }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    format,
    formatDistanceToNow,
    differenceInMinutes,
    differenceInHours,
} from "date-fns";
import type { Record } from "~/types";
import { ANALYTICS_EVENTS } from "~/constants/analytics";

const props = defineProps<{
    data: Record;
}>();

// Format time in Mauritius local time (UTC+4)
function formatLocalTime(utcTimeStr: string): string {
    const utcDate = new Date(utcTimeStr);
    // Mauritius is UTC+4
    const mauritiusTime = new Date(utcDate.getTime() + 4 * 60 * 60 * 1000);
    return mauritiusTime.toISOString().slice(11, 16);
}

const formattedDate = computed(() => {
    const date = new Date(props.data.from);
    return format(date, "EEE, MMM d, yyyy");
});

const formattedTime = computed(() => {
    const fromTime = formatLocalTime(props.data.from);
    const toTime = formatLocalTime(props.data.to);
    return `${fromTime} – ${toTime}`;
});

const outrageDuration = computed(() => {
    const from = new Date(props.data.from);
    const to = new Date(props.data.to);
    const hours = differenceInHours(to, from);
    const minutes = differenceInMinutes(to, from) % 60;

    if (hours === 0) {
        return `${minutes}min`;
    } else if (minutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${minutes}min`;
    }
});

function formatDate(date: Date | string) {
    return formatLocalTime(
        typeof date === "string" ? date : date.toISOString(),
    );
}

const handleCellClick = () => {
    const cleanUrl = `/outage/${props.data.id}`;
    const router = useRouter();
    router.push(cleanUrl);
};
</script>

<style scoped>
.glass {
    --theme-bg-color: rgba(16 18 27 / 90%);
    background-color: var(--theme-bg-color);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}

.glass.dark {
    --theme-bg-color: rgba(16 18 27 / 80%);
}
</style>
