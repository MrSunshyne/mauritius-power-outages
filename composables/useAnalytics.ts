interface Umami {
    track(event: string, props?: Record<string, unknown>): void;
}

declare global {
    interface Window {
        umami?: Umami;
    }
}

export function useAnalytics() {
    const isDevelopment = import.meta.dev

    const track = (event: string, props?: Record<string, unknown>) => {
        if (isDevelopment) {
            return
        }
        if (typeof window !== "undefined" && window.umami) {
            window.umami.track(event, props);
        }
    };

    return { track };
}
