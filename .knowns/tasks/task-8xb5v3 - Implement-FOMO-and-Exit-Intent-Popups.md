---
id: 8xb5v3
title: Implement FOMO and Exit Intent Popups
status: done
priority: high
labels: []
createdAt: '2026-03-10T02:43:15.320Z'
updatedAt: '2026-03-10T02:46:46.171Z'
timeSpent: 204
assignee: '@me'
---
# Implement FOMO and Exit Intent Popups

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement FOMO notifications and Exit Intent popups for the landing pages.
Follow the designs provided in the user's screenshots:
1. FOMO: Small floating notification with real/mock purchase/registration data.
2. Exit Intent: Modal with urgent messaging and CTAs (Talk to founder, free audit).
3. Bonus alignment: Fix "Quà tặng #1" alignment with title in BonusSection.

Reference docs for UI patterns: @doc/ui-guidelines (if exists)
Related to: @doc/landing-pages-arch
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Fix "Quà tặng #1" vertical alignment with Ebook title in BonusSection.tsx
- [x] #2 Implement FOMO Notification with real (if data exists) and mock (randomized) data modes. (Slide 3)
- [x] #3 Implement Exit Intent Modal with centered UI, urgent copy, and CTA buttons. (Slide 4)
- [x] #4 Integrate FOMO and Exit Intent popups into relevant landing pages.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
### Summary: FOMO & Exit Intent Implementation

1. **Alignment Fix**: Adjusted `BonusSection.tsx` to ensure the "Quà tặng #x" tag and the Ebook title are vertically centered using `items-center` and `leading-none`. Fixed a min-height for the header to maintain consistency.
2. **Gift Content**: Updated `defaultContent.ts` to include "Ebook 'Google Sheets Pro Guide'" as the first bonus item (Quà tặng #1) for the Vibe Coding course.
3. **FOMO Notification**: 
   - Created `FomoNotification.tsx` with a premium floating design (bottom-left).
   - **Mode 1 (Real)**: Fetches recent successful orders from the new `/api/payments/recent` endpoint.
   - **Mode 2 (Mock)**: Generates random realistic Vietnamese registrations if no real data is available.
   - Anonymizes real names (e.g., "Nguyễn Thanh Tùng" -> "N. T. Tùng").
4. **Exit Intent Modal**:
   - Created `ExitIntentModal.tsx` triggered when the mouse leaves the browser viewport (exit intent).
   - Features the "Khoan đã!" urgent messaging with two CTAs: "Máy dò ý tưởng" (Free Audit) and "Chat với Founder".
   - Uses `sessionStorage` to only show once per visit.
5. **Integration**: Added `LandingPageNotifications` wrapper to `MainLayout.tsx`, restricting it to the home page or dynamic landing pages (`/p/*`).

### Technical Changes:
- **Client**: `FomoNotification.tsx`, `ExitIntentModal.tsx`, `LandingPageNotifications.tsx`.
- **Server**: Added `getRecentPublicOrders` to `PaymentService` and exposed it via `PaymentController` at `GET /api/payments/recent`.
<!-- SECTION:NOTES:END -->

