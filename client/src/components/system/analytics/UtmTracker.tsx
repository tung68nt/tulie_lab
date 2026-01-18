'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UtmTrackerContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!searchParams) return;

        // List of keys to track
        const trackingKeys = [
            'utm_source',
            'utm_medium',
            'utm_campaign',
            'utm_term',
            'utm_content',
            'gclid', // Google Click ID
            'fbc',   // Facebook Click ID
            'fbclid' // Facebook Click ID (url param)
        ];

        const marketingData: Record<string, string> = {};
        let hasData = false;

        trackingKeys.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                marketingData[key] = value;
                hasData = true;
            }
        });

        // Special handling for fbclid -> fbc (if not present)
        // Note: Actual FBC generation usually requires more logic (cookie logic), 
        // but saving fbclid is a good start. 
        // Standard FBC format: fb.1.{timestamp}.{fbclid}
        if (marketingData.fbclid && !marketingData.fbc) {
            marketingData.fbc = marketingData.fbclid;
        }

        if (hasData) {
            // Merge with existing session data to avoid overwriting with empty new page loads
            // Optional: Decide if new UTMs overwrite old ones (usually yes for "last touch")
            try {
                const stored = sessionStorage.getItem('marketing_leads');
                const existingup = stored ? JSON.parse(stored) : {};

                const merged = { ...existingup, ...marketingData };
                sessionStorage.setItem('marketing_leads', JSON.stringify(merged));
                console.log('Marketing data tracked:', merged);
            } catch (e) {
                console.error('Failed to save tracking data', e);
            }
        }
    }, [searchParams]);

    return null;
}

export function UtmTracker() {
    return (
        <Suspense fallback={null}>
            <UtmTrackerContent />
        </Suspense>
    );
}
