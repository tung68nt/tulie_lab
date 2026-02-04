---
id: y11dhx
title: 'Fix UI/UX Issues - Responsive, Icons, Buttons'
status: done
priority: high
labels:
  - bug
  - ui
  - responsive
createdAt: '2026-02-04T15:44:49.271Z'
updatedAt: '2026-02-04T15:59:15.299Z'
timeSpent: 0
assignee: '@me'
---
# Fix UI/UX Issues - Responsive, Icons, Buttons

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Sửa các lỗi UI/UX được phát hiện trên hệ thống:

1. **Hero Section Responsive (Mobile)**: Section hero bị lỗi responsive trên màn hình mobile
2. **Pagination Buttons**: Nút mũi tên <> phân trang bị nhỏ quá, cần đồng bộ kích thước với các nút khác
3. **Expand/Collapse Arrow**: Mũi tên mở rộng/thu gọn nội dung chi tiết khóa học đang dùng icon tam giác, cần đổi sang mũi tên chữ V hiện đại
4. **Course Info Icons**: Các icon 'Giảng viên Chuyên nghiệp', 'Truy cập trọn đời', 'Bài học' bị bé và lỗi contrast - cần đổi sang màu trắng
5. **Course Edit Missing Fields**: Chưa có field để edit các thông tin icon trên trong trang sửa khóa học
6. **Edit Button Border**: Nút sửa trang/section có viền tím - cần bỏ viền

Xem ảnh đính kèm để tham khảo.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Hero section hiển thị đúng trên màn hình mobile
- [x] #2 Nút phân trang <> có kích thước cân đối với các nút khác
- [x] #3 Icon mở rộng/thu gọn dùng mũi tên chữ V thay vì tam giác
- [x] #4 Icon course info (giảng viên, truy cập, bài học) có màu trắng, kích thước phù hợp
- [x] #5 Có field edit thông tin course info trong trang sửa khóa học
- [x] #6 Nút sửa trang/section không có viền tím
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Fixed: Pagination buttons (h-10, size=22, stronger border), CourseChapter chevron icons (triangle→ChevronDown), QuickEdit border removed

Completed all UI/UX fixes including responsive hero, custom course info fields, and icon improvements.
<!-- SECTION:NOTES:END -->

