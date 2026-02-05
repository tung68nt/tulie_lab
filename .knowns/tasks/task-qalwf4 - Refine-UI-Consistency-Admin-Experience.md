---
id: qalwf4
title: Refine UI Consistency & Admin Experience
status: done
priority: high
labels:
  - ui
  - lms
  - admin
createdAt: '2026-02-05T07:28:27.900Z'
updatedAt: '2026-02-05T12:14:08.799Z'
timeSpent: 627
assignee: '@me'
---
# Refine UI Consistency & Admin Experience

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
thêm task vào knowns cho tôi, thực hiện rồi kiểm tra, tránh trường hợp fix nhiều lần vẫn lỗi, nếu không hiển thị được như mẫu thì <https://cli.knowns.dev/docs> thì cứ loop check DOM, fix, push git rồi check DOM, fix, push git...:\
\
fix lại lề cho mục lục tài liệu (đang bị nhiều lề trái phải quá)\
\
fix lại icon thẳng với mục lục tài liệu, icon đang bị cao hơn mục lục tài liệu (nếu ko fix được thì bỏ icon đi) như ảnh mẫu\
\
box code block fix bỏ shadown, chỉ để lại viền border đơn giản thôi (như ảnh mẫu)\
\
code inline và code block chưa có màu text từng loại term code như ảnh mẫu\
\
nút kết thúc khóa học, bài học trước, bài học tiếp theo cho về như cũ, bị to, nhiều lề trái quá, bỏ uppercase đi, cho gọn nút lại\
\
nút đánh dấu hoàn thành bị cao hơn title bài học\
\
trong phần edit bài học,dòng Hướng dẫn & Lưu ý học tập (Prompts) Mở rộng dưới Video thì xoá tag "Mở rộng dưới Video đi"\
\
thêm bộ nút Hủy - Xem thực tế - Lưu thay đổi trang vào cuối sau danh sách bài học để tiện cho việc sửa xong bài học thì lưu luôn không cần lộn lên phần trên để bấm lưu
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 TOC horizontal margins are reduced
- [ ] #2 TOC icon is perfectly aligned with the title text
- [ ] #3 Code blocks have no shadow and a simple border
- [ ] #4 Syntax highlighting colors are applied correctly to both inline and block code
- [ ] #5 Next/Prev buttons are refined (no uppercase, better spacing)
- [ ] #6 Mark Complete button is aligned with lesson title
- [ ] #7 Admin: Guide header text is updated (Remove 'Mở rộng dưới Video')
- [ ] #8 Admin: Persistent action buttons (Cancel, View, Save) are added to the bottom of the lesson editor
- [ ] #9 giao diện hiển thị, khoảng cách, text code color như https://cli.knowns.dev/docs
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Final Fix: Resolved TypeScript compilation error in course editor. Clean local build verified.
<!-- SECTION:NOTES:END -->

