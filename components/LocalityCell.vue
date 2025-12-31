<template>
    <div
        class="group p-4 sm:p-5 rounded-xl glass text-white relative cursor-pointer hover:brightness-110 transition-all duration-200"
        @click="handleCellClick"
        :data-umami-event="ANALYTICS_EVENTS.OUTAGE_VIEW_DETAIL"
    >
        <div class="flex flex-col gap-3">
            <div class="flex flex-row justify-between items-start gap-2">
                <div class="text-base sm:text-lg leading-relaxed flex-1 min-w-0 pr-4">
                    {{ props.data.streets }}
                </div>
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <div class="text-[10px] sm:text-xs font-mono font-medium text-white/60">
                        {{ outrageDuration }}
                    </div>
                    <div class="text-lg sm:text-xl font-bold tracking-tight">
                        {{ formattedTime }}
                    </div>
                    <div class="text-[10px] sm:text-xs tracking-wide text-white/50 uppercase">
                        {{ formattedDate }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    format,
    differenceInMinutes,
    differenceInHours,
} from "date-fns";
import type { Record } from "~/types";
import { ANALYTICS_EVENTS } from "~/constants/analytics";
import { formatLocalTime } from "~/utils/datetime";

const props = defineProps<{
    data: Record;
}>();

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
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${hours} hr`;
    } else {
        return `${hours} hr ${minutes} min`;
    }
});

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
