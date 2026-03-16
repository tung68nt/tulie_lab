# Hướng Dẫn Cấu Hình DNS cho betathelab.tulie.vn

## Tổng Quan
Hiện tại `betathelab.tulie.vn` đang point đến Vercel. Chúng ta cần map domain này sang Cloud Run service `academy-web-beta`.

## Bước 1: Map Domain trong Google Cloud Run

Chạy lệnh sau để map domain với Cloud Run service:

```bash
gcloud run domain-mappings create \
  --service academy-web-beta \
  --domain betathelab.tulie.vn \
  --region asia-southeast1
```

Sau khi chạy xong, Google Cloud sẽ yêu cầu bạn verify ownership và cung cấp DNS records cần cấu hình.

## Bước 2: Lấy DNS Records

Chạy lệnh này để xem DNS records cần cấu hình:

```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1 \
  --format="table(status.resourceRecords.name,status.resourceRecords.type,status.resourceRecords.rrdata)"
```

Bạn sẽ nhận được kết quả tương tự như:

```
NAME                    TYPE    RRDATA
betathelab.tulie.vn    A       216.239.32.21
betathelab.tulie.vn    A       216.239.34.21
betathelab.tulie.vn    A       216.239.36.21
betathelab.tulie.vn    A       216.239.38.21
betathelab.tulie.vn    AAAA    2001:4860:4802:32::15
betathelab.tulie.vn    AAAA    2001:4860:4802:34::15
betathelab.tulie.vn    AAAA    2001:4860:4802:36::15
betathelab.tulie.vn    AAAA    2001:4860:4802:38::15
```

## Bước 3: Cấu Hình DNS

Vào DNS provider của bạn (nơi quản lý domain `thelab.tulie.vn`) và:

### 3.1. Xóa DNS Records Cũ

Xóa các records hiện tại của `betathelab.tulie.vn` đang point đến Vercel:
- Xóa CNAME: `beta` → `vercel-dns-017.com`
- Hoặc xóa A records: `64.29.17.65`, `216.198.79.65`

### 3.2. Thêm DNS Records Mới

Thêm các A records từ output của Bước 2 (4 IPv4 addresses):
```
Type: A
Name: beta
Value: 216.239.32.21
TTL: 3600
```

Lặp lại cho 3 IP còn lại:
- 216.239.34.21
- 216.239.36.21
- 216.239.38.21

### 3.3. (Optional) Thêm AAAA Records cho IPv6

Nếu DNS provider hỗ trợ IPv6, thêm 4 AAAA records:
```
Type: AAAA
Name: beta
Value: 2001:4860:4802:32::15
```

Lặp lại cho 3 IPv6 còn lại.

## Bước 4: Verify Ownership (Nếu Cần)

Nếu Google yêu cầu verify ownership, chạy:

```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1
```

Tìm section `status.conditions` để xem status và hướng dẫn verify.

## Bước 5: Kiểm Tra DNS Propagation

Sau khi cấu hình DNS, chờ 5-15 phút để DNS propagate. Kiểm tra bằng:

```bash
dig betathelab.tulie.vn +short
```

Bạn sẽ thấy 4 IP addresses của Google Cloud thay vì Vercel IPs.

## Bước 6: Test SSL Certificate

Cloud Run tự động provision SSL certificate. Kiểm tra bằng:

```bash
curl -I https://betathelab.tulie.vn
```

Nếu thấy `HTTP/2 200` và `server: Google Frontend` là thành công!

## Bước 7: Xóa Vercel Deployment (Optional)

Sau khi DNS đã chuyển sang Cloud Run, bạn có thể:

1. Vào Vercel Dashboard
2. Xóa domain `betathelab.tulie.vn` khỏi Vercel project
3. Hoặc xóa toàn bộ Vercel deployment nếu không cần nữa

## Troubleshooting

### Lỗi "Domain already exists"
Nếu domain đã được map trước đó, xóa mapping cũ:
```bash
gcloud run domain-mappings delete betathelab.tulie.vn --region asia-southeast1
```

### Lỗi SSL Certificate Pending
SSL certificate có thể mất 15-60 phút để provision. Kiểm tra status:
```bash
gcloud run domain-mappings describe betathelab.tulie.vn \
  --region asia-southeast1 \
  --format="get(status.conditions)"
```

### DNS Không Propagate
- Giảm TTL xuống 300 giây trước khi thay đổi DNS
- Xóa cache DNS local: `sudo dscacheutil -flushcache` (macOS)
- Kiểm tra trên nhiều DNS server: `dig @8.8.8.8 betathelab.tulie.vn`

## Tương Tự Cho Production Domain

Để map `thelab.tulie.vn` (production) sang `academy-web` service:

```bash
gcloud run domain-mappings create \
  --service academy-web \
  --domain thelab.tulie.vn \
  --region asia-southeast1
```

Lặp lại các bước tương tự.

## Liên Hệ

Nếu gặp vấn đề, kiểm tra:
- GitHub Actions logs: Xem deployment có thành công không
- Cloud Run logs: `gcloud run logs read --service academy-web-beta --region asia-southeast1`
- DNS propagation: https://dnschecker.org (nhập `betathelab.tulie.vn`)
