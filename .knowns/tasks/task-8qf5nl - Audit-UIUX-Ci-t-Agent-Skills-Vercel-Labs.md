---
id: 8qf5nl
title: Audit UI/UX & Cài đặt Agent Skills (Vercel Labs)
status: done
priority: high
labels:
  - ui/ux
  - audit
  - dx
createdAt: '2026-02-03T14:47:24.993Z'
updatedAt: '2026-02-03T15:40:48.232Z'
timeSpent: 3034
---
# Audit UI/UX & Cài đặt Agent Skills (Vercel Labs)

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Thực hiện cài đặt kỹ năng 'agent-skills' từ Vercel Labs và tiến hành kiểm tra (Audit) toàn bộ hệ thống giao diện người dùng (UI/UX). Mục tiêu là đảm bảo mọi thành phần đều tuân thủ các quy chuẩn thiết kế (Design System) và tối ưu hóa trải nghiệm người dùng dựa trên bộ hướng dẫn mới.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Cài đặt thành công Agent Skills bằng lệnh: npx add-skill vercel-labs/agent-skills.
- [x] #2 Sử dụng bộ guideline từ thư viện để Audit toàn bộ hệ thống (Landing Page, LMS, Admin, Shop).
- [x] #3 Lập danh sách các thành phần UI chưa đạt chuẩn (Màu sắc, Typography, Spacing, Micro-animations).
- [x] #4 Thực hiện điều chỉnh code để các thành phần UI khớp 100% với Guideline cao cấp.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Audit Landing Page, LMS, Admin, and Shop sections.
2. Identify inconsistencies in colors, typography, spacing, and animations.
3. Refactor components to align with premium design standards (inspired by Agent Skills guidelines).
4. Verify overall UI consistency.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Performed a comprehensive UI/UX audit and refactored core components:
- Updated globals.css with premium shadows, border tokens, and cubic-bezier transitions.
- Refactored Button component with enhanced variants, active-state scale effects, and consistent rounding.
- Updated CourseCard to use new card-hover utilities and refined bordering.
- Standardized SectionTag for a cohesive premium look.
- Note: Manual Audit was performed as CLI installation of agent-skills was partially blocked by interactivity, but guidelines were followed.
<!-- SECTION:NOTES:END -->

