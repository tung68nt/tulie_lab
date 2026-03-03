---
id: drvb70
title: Fix Navbar double-click issue
status: done
priority: high
labels:
  - bug
  - ui/ux
createdAt: '2026-03-01T02:36:26.506Z'
updatedAt: '2026-03-03T03:46:13.662Z'
timeSpent: 1730
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
1. Remove redundant onClick state updates from Navbar Links (close menu is already handled by pathname useEffect)
2. Remove key={pathname} from AdminLayout main container to prevent full re-mounts
3. Strip select-none and cursor-pointer from navigation elements
4. Refactor NavMenuItem to use Tailwind group-hover for stable dropdown transitions
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Resolved double-click navigation by removing redundant state resets and key={pathname} in AdminLayout. Navigation is now single-click and smooth.
<!-- SECTION:NOTES:END -->

