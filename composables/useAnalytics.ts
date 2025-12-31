interface Umami {
    track(event: string, props?: Record<string, unknown>): void;
}

declare global {
    interface Window {
        umami?: Umami;
    }
}

export function useAnalytics() {
    const track = (event: string, props?: Record<string, unknown>) => {
        if (typeof window !== "undefined" && window.umami) {
            window.umami.track(event, props);
        }
    };

    return { track };
}
