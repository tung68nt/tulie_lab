---
id: drvb70
title: Fix Navbar double-click issue
status: done
priority: high
labels:
  - bug
  - ui/ux
createdAt: '2026-03-01T02:36:26.506Z'
updatedAt: '2026-03-01T02:39:26.365Z'
timeSpent: 172
assignee: '@me'
---
# Fix Navbar double-click issue

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Users are required to click twice on Navbar links to navigate. This is likely caused by re-renders triggered by onMouseEnter events in the Navbar component.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Navbar links navigate on first click
- [x] #2 Hover dropdowns still function correctly
- [x] #3 Remove unnecessary re-renders during hover
- [x] #4 Remove select-none from navigation links
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Extract navigation items into a sub-component NavMenuItem to localize state updates and prevent full Navbar re-renders on hover.
2. Remove 'select-none' and 'cursor-pointer' from all Link components.
3. Replace JS-driven hover state with Tailwind CSS 'group-hover' for simple dropdowns if possible, or use local state in sub-components.
4. Adjust the 'invisible bridge' positioning to ensure it doesn't overlap link click areas.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Refactored Navbar.tsx to use local state in NavMenuItem sub-component. This prevents the entire Navbar from re-rendering when hovering over links, which was causing click events to be swallowed or requiring a double-click on some devices. Also removed 'select-none' from navigation links and added a useEffect to close dropdowns on pathname change.
<!-- SECTION:NOTES:END -->

