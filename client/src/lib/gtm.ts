type WindowWithDataLayer = Window & {
    dataLayer: Record<string, unknown>[];
};

declare const window: WindowWithDataLayer;

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const pageview = (url: string) => {
    if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
            event: 'pageview',
            page: url,
        });
    }
};

export const sendGTMEvent = (eventName: string, data: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...data,
        });
    } else {
        console.warn(`GTM Event [${eventName}] missed - dataLayer not found`);
    }
};
