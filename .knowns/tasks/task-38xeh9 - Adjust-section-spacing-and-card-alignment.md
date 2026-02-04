---
id: 38xeh9
title: Adjust section spacing and card alignment
status: done
priority: medium
labels: []
createdAt: '2026-02-04T02:49:39.339Z'
updatedAt: '2026-02-04T02:52:31.264Z'
timeSpent: 164
---
# Adjust section spacing and card alignment

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Reduce vertical spacing between sections and align titles/descriptions across cards in sections like Benefits and Process Sections.
    
    Related: @doc/guides/docs-system-roadmap (maybe)
    
    1. Reduce section padding (py-16/py-24 -> py-12/py-16).
    2. Fix min-heights for card titles and descriptions to ensure horizontal alignment across rows.
    3. Tweak StandardSectionHeader padding.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Reduce vertical padding in sections (Process, Benefits, etc) to decrease overall page length.
- [x] #2 Align titles horizontally across cards in Process section using min-height.
- [x] #3 Align descriptions horizontally across cards in Process section using min-height.
- [x] #4 Refine min-heights in Benefits section to ensure titles and descriptions align even with longer content.
- [x] #5 Reduce top padding in StandardSectionHeader.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Summary
- Reduced vertical spacing across all major landing page sections.
- Aligned card titles and descriptions horizontally using min-height.
- Top-aligned curriculum titles with thumbnails.
- Shows full instructor bios and removed social buttons.
<!-- SECTION:NOTES:END -->

