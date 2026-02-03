---
id: h5iamw
title: Nâng cấp giao diện Video Player với macOS Frame chuyên nghiệp
status: done
priority: low
labels:
  - ui/ux
  - lms
  - enhancement
createdAt: '2026-02-03T14:41:14.743Z'
updatedAt: '2026-02-03T15:39:39.502Z'
timeSpent: 20
---
# Nâng cấp giao diện Video Player với macOS Frame chuyên nghiệp

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Nâng cấp giao diện Video Player trong trang học tập (LMS) bằng cách thêm khung (frame) phong cách macOS. Thanh tiêu đề sẽ bao gồm 3 nút điều khiển (đỏ, vàng, xanh) và hiển thị tên bài học hiện tại, tạo cảm giác chuyên nghiệp và đồng bộ với hệ thống Docs vừa xây dựng.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Video trong trang Learn hiển thị bên trong một frame có bo góc và đổ bóng (Shadow).
- [x] #2 Thanh tiêu đề (Title Bar) hiển thị phía trên video với 3 nút màu (Đỏ, Vàng, Xanh) ở góc trái.
- [x] #3 Tên bài học hoặc tiêu đề video hiện ở giữa thanh tiêu đề.
- [x] #4 Đảm bảo giao diện responsive (ẩn title bar trên mobile nếu cần thiết).
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add macOS frame wrapper to VideoPlayer component.
2. Update LearnClient layout to support the new frame.
3. Verify responsiveness.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented macOS-style frame for VideoPlayer with:
- Red, Yellow, Green control buttons.
- Centered lesson title in the title bar.
- Rounded corners (rounded-2xl) and shadow (shadow-2xl).
- Responsive layout in LearnClient.tsx.
<!-- SECTION:NOTES:END -->

