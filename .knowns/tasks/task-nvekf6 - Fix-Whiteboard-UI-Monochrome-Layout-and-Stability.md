---
id: nvekf6
title: 'Fix Whiteboard UI: Monochrome, Layout, and Stability'
status: todo
priority: high
labels: []
createdAt: '2026-02-06T08:06:58.498Z'
updatedAt: '2026-02-06T13:36:42.361Z'
timeSpent: 19752
---
# Fix Whiteboard UI: Monochrome, Layout, and Stability

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Fix overlapping toolbar, enforce black & white theme, and resolve the 2s disappearing bug.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Toolbar does not overlap logo/share buttons
- [x] #2 Theme is strictly black and white (monochrome)
- [ ] #3 Whiteboard does not disappear after loading
- [ ] #4 Stability and collaboration verified
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Hidden PageMenu and MainMenu. Added .tl-theme__light CSS overrides for strict monochrome theme.
<!-- SECTION:NOTES:END -->

