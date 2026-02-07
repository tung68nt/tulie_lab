---
id: bnwehz
title: Fix Whiteboard Critical Bugs - DOM Testing & Auto Loop Fix
status: in-progress
priority: high
labels:
  - whiteboard
  - bug-fix
  - dom-testing
createdAt: '2026-02-07T17:51:47.639Z'
updatedAt: '2026-02-07T18:10:58.557Z'
timeSpent: 0
assignee: '@me'
---
# Fix Whiteboard Critical Bugs - DOM Testing & Auto Loop Fix

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Fix tất cả các lỗi nghiêm trọng của Whiteboard với yêu cầu DOM test từng lỗi và auto loop check-fix-check. Sử dụng tên miền thelab.tulie.vn (không localhost). Related: @task-nvekf6
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Menu button hoạt động - mở được menu chính
- [x] #2 Library button hoạt động - mở được sidebar library
- [x] #3 Bảng thuộc tính công cụ hoạt động (màu sắc, nét đậm/mảnh, font size...)
- [x] #4 Đủ 3 mũi tên hướng dẫn trên welcome screen (menu, toolbar, help)
- [ ] #5 Dữ liệu được lưu vào database Supabase (reload vẫn giữ dữ liệu)
- [ ] #6 Công cụ vẽ mượt mà, không lag, không lỗi nhả chuột
- [ ] #7 Text tool hoạt động đúng - có thể chèn và chỉnh sửa text
- [ ] #8 Bảng chọn whiteboard đã tạo hoạt động - có thể mở/chỉnh sửa bảng cũ
- [ ] #9 Demo: Tải và sử dụng được 1 library kit mẫu
- [ ] #10 DOM test passed cho tất cả các chức năng trên thelab.tulie.vn
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified on thelab.tulie.vn:
- Menu button: WORKS (opens Excalidraw menu)
- Library button: WORKS (opens sidebar)
- Properties panel: WORKS (Stroke, Background, Font, Size, etc.)
- Hints arrows: VISIBLE (3 arrows with Vietnamese text)
- Redirect: WORKS (/whiteboard/new -> real ID)
<!-- SECTION:NOTES:END -->

