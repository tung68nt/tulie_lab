---
id: fix_hover_issues
title: Fix Section Hover State Issues
status: todo
priority: medium
labels: [ui, bug, hover]
createdAt: '2026-02-04T10:48:00.000Z'
updatedAt: '2026-02-04T10:48:00.000Z'
timeSpent: 0
---
# Fix Section Hover State Issues

## Description

User reported an issue where hovering over a section causes ALL icons in that section to trigger their hover state simultaneously. The expected behavior is that only the icon within the specific hovered card/box should trigger its hover state.

## Scope
- Identify the section component shown in the screenshot ("Tại sao Tulie Lab khác?", "AI-First Methodology").
- Fix the CSS/Tailwind classes to scope the hover effect to the individual card/item.
- Review other sections for similar `group-hover` misuse.

## Todo
- [ ] Identify the component code <!-- id: 0 -->
- [ ] Fix hover state in the identified component <!-- id: 1 -->
- [ ] Direct `group` class to the specific card container instead of the section container <!-- id: 2 -->
- [ ] Audit other components for similar issues <!-- id: 3 -->
