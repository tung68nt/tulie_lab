---
id: cixy55
title: Xây dựng hệ thống Docs hướng dẫn sử dụng cho LMS
status: done
priority: medium
labels: []
createdAt: '2026-02-03T11:36:52.457Z'
updatedAt: '2026-02-03T14:39:27.090Z'
timeSpent: 10558
assignee: '@me'
---
# Xây dựng hệ thống Docs hướng dẫn sử dụng cho LMS

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
# Kế hoạch xây dựng hệ thống Documentation (Docs) và nhúng hệ thống Docs vào từng bài học để học viên có thể view code, view hướng dẫn cho từng phần, từng bài học để thực hành theo

## 1. Kiến trúc & Khởi tạo (Architecture & Setup)

* [ ] **Lựa chọn Framework**: Quyết định sử dụng bộ thư viện hỗ trợ (như `Fumadocs`, `Nextra`) hoặc tự xây dựng dựa trên `Next.js + MDX`.
* [ ] **Cấu hình MDX**: Thiết lập Content Layer hoặc giải pháp xử lý file `.mdx` để biến các file markdown thành các trang web động.
* [ ] **Thiết lập thư mục nội dung**: Tạo cấu trúc thư mục `/docs` rõ ràng (Beginner, Guides, API Reference, v.v.)

## 2. Giao diện & Thành phần (UI & Components)

* [ ] **Main Layout**: Xây dựng Layout tổng thể bao gồm Header (Logo, Search, Links) và Sidebar.
* [ ] **Sidebar Điều hướng**: Tự động tạo cây thư mục dựa trên cấu trúc file hoặc file cấu hình `meta.json`.
* [ ] **Thành phần Markdown tùy chỉnh**:
* [ ] **Callouts/Alerts**: Các ô ghi chú (Note, Warning, Tip) như mẫu.
* [ ] **Code Blocks**: Hỗ trợ syntax highlighting, nút "Copy", và hiển thị tên file.
* [ ] **Tabs/Accordions**: Các thành phần tương tác trong tài liệu.\
* [ ] **Table of Contents (TOC)**: Sidebar bên phải hiển thị các tiêu đề (Heading) của trang hiện tại.

## 3. Chức năng Tìm kiếm & Điều hướng (Search & DX)

* [ ] **Tích hợp Tìm kiếm**: Sử dụng local search (FlexSearch) hoặc Algolia để tìm kiếm nhanh trong tài liệu.
* [ ] **Next/Previous Navigation**: Tự động hiển thị link chuyển trang ở cuối mỗi bài viết.
* [ ] **Breadcrumbs**: Đường dẫn phân cấp trang.
* [ ] **Light/Dark Mode**: Đồng bộ với giao diện chính của dự án.

## 4. Nội dung & SEO (Content & SEO)

* [ ] **Viết tài liệu mẫu**: Tạo các trang "Giới thiệu", "Bắt đầu nhanh" để kiểm tra giao diện.
* [ ] **Tối ưu SEO**: Tự động sinh Meta tags (Title, Description) cho từng trang dựa trên content.
* [ ] **Image Optimization**: Xử lý ảnh trong markdown để load nhanh và responsive.

## 5. Triển khai & Kiểm thử (Verification)

* [ ] **Kiểm tra responsive**: Đảm bảo sidebar và content hiển thị tốt trên Mobile.
* [ ] **Verify Link**: Kiểm tra các link nội bộ không bị broken.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Hệ thống Docs hoạt động mượt mà, ổn định
- [x] #2 Giao diện hiện đại, đồng bộ style với hệ thống
- [x] #3 Hiển thị rõ ràng trong tài liệu từng bài học để học viên có thể vừa xem video vừa thực hành
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Summary of Implementation
Completed building the documentation system for the LMS:
- **MarkdownRenderer**: Custom component supporting GFM, code syntax highlighting with copy buttons, and callouts (Note, Warning, Tip).
- **TableOfContents**: Extracts headings and provides smooth scroll navigation.
- **LearnClient Integration**: Embedded documentation section below the video player with a sticky TOC on desktop.
- **Admin Docs**: Connected the administrative documentation management to the Settings API for persistence.

All acceptance criteria have been met.
<!-- SECTION:NOTES:END -->

