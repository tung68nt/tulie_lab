---
id: 16jqwq
title: Khắc phục lỗi Deployment VPS & Cấu hình SSL/Nginx
status: in-progress
priority: high
labels:
  - deploy
  - vps
  - ssl
  - nginx
createdAt: '2026-02-20T11:36:14.329Z'
updatedAt: '2026-02-20T12:52:28.288Z'
timeSpent: 0
assignee: '@me'
---
# Khắc phục lỗi Deployment VPS & Cấu hình SSL/Nginx

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Rà soát lại toàn bộ hệ thống, xử lý lỗi 502 Bad Gateway trên Nginx (aaPanel) và cài đặt SSL để đảm bảo website thelab.tulie.vn truy cập thành công.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 VPS Nginx proxy đúng về port 3001 (client) và 5001 (api)
- [x] #2 SSL Let's Encrypt được cài đặt và tự động renew
- [x] #3 Truy cập https://thelab.tulie.vn thành công, không bị lỗi 502 hay SSL
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Provided aaPanel instructions to user. Waiting for them to perform the manual steps.

Đã truy cập aaPanel cấu hình SSL, cài Docker và khởi chạy thành công container client & server. Website thelab.tulie.vn đã hoạt động có HTTPS.

Reopened: User reported 'public.User does not exist' error and missing loading bar.
<!-- SECTION:NOTES:END -->

