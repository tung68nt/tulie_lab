# 🚀 Hướng dẫn Deploy LMS Academy Tulie

## Bước 1: Setup Supabase (Database)

1. Truy cập [supabase.com](https://supabase.com) → Create new project
2. Chọn region: **Singapore (ap-southeast-1)** để gần Việt Nam
3. Đặt database password và lưu lại
4. Sau khi project tạo xong, vào **Settings → Database**
5. Copy connection strings:

```bash
# Connection pooling (dùng cho app)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (dùng cho migrations)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

6. Chạy migration:
```bash
cd server
npx prisma migrate deploy
```

---

## Bước 2: Setup Redis (Upstash) - Cho Caching

1. Truy cập [console.upstash.com](https://console.upstash.com/redis) (như hình bạn gửi).
2. Bấm nút xanh **Create Database**.
3. Điền thông tin:
   - **Name**: `academy-redis`
   - **Region**: Chọn **Singapore (ap-southeast-1)** (để gần Database và Server).
   - **Type**: Regional (thường là mặc định).
   - **Eviction**: **Bật (Enable)** (Quan trọng: để khi đầy bộ nhớ nó tự xóa cache cũ đi, không bị lỗi).
4. Bấm **Create**.
5. Sau khi tạo xong, cuộn xuống phần **Connect**.
6. Chọn tab **Node.js (ioredis)** hoặc copy dòng `REDIS_URL`.
   - Nó sẽ có dạng: `redis://default:******@gw-xxxx.upstash.io:6379`
7. Copy chuỗi này để dùng cho GitHub Secrets.

---

## Bước 3: Setup Cloudflare R2 (Video Storage)

1. Truy cập [dash.cloudflare.com](https://dash.cloudflare.com) → R2
2. Create bucket: `academy-videos`
3. Vào **Manage R2 API Tokens** → Create token
4. Lưu các thông tin:
   - Account ID
   - Access Key ID
   - Secret Access Key

---

## Bước 3: Setup Google Cloud

### 3.1 Tạo Project
```bash
# Install gcloud CLI nếu chưa có
brew install --cask google-cloud-sdk

# Login
gcloud auth login

# Tạo project
gcloud projects create academy-tulie-prod
gcloud config set project academy-tulie-prod

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3.2 Tạo Service Account cho GitHub Actions
```bash
# Tạo service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Gán quyền
gcloud projects add-iam-policy-binding academy-tulie-prod \
  --member="serviceAccount:github-actions@academy-tulie-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding academy-tulie-prod \
  --member="serviceAccount:github-actions@academy-tulie-prod.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding academy-tulie-prod \
  --member="serviceAccount:github-actions@academy-tulie-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Tạo key JSON
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=github-actions@academy-tulie-prod.iam.gserviceaccount.com
```

### 3.3 Thêm GitHub Secrets
Vào GitHub repo → Settings → Secrets and variables → Actions:

| Secret Name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | `academy-tulie-prod` |
| `GCP_SA_KEY` | Nội dung file `~/gcp-key.json` |
| `DATABASE_URL` | Connection string từ Supabase |
| `DIRECT_URL` | Direct connection từ Supabase |

---

## Bước 4: Deploy Backend (Cloud Run)

### Deploy thủ công lần đầu:
```bash
cd server

# Build image
docker build -t gcr.io/academy-tulie-prod/academy-api .

# Push to GCR
docker push gcr.io/academy-tulie-prod/academy-api

# Deploy to Cloud Run
gcloud run deploy academy-api \
  --image gcr.io/academy-tulie-prod/academy-api \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,DATABASE_URL=...,JWT_SECRET=...,CLIENT_URL=..."
```

### Sau đó: Auto-deploy qua GitHub Actions
Mỗi khi push code lên `main`, tự động deploy!

---

## Bước 5: Deploy Frontend (Vercel)

1. Truy cập [vercel.com](https://vercel.com) → Import Git Repository
2. Chọn repo `academy_tulie`
3. Configure:
   - Root Directory: `client`
   - Framework: Next.js
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL của Cloud Run (ví dụ: `https://academy-api-xxx.run.app`)
5. Deploy!

---

## Bước 6: Custom Domain (Optional)

### Backend (Cloud Run):
```bash
gcloud run domain-mappings create \
  --service academy-api \
  --domain api.academy-tulie.com \
  --region asia-southeast1
```

### Frontend (Vercel):
- Vào Project Settings → Domains → Add `academy-tulie.com`

### DNS (Cloudflare):
| Type | Name | Content |
|------|------|---------|
| A | @ | Vercel IP |
| CNAME | api | Cloud Run domain |

---

## ✅ Checklist sau khi deploy

- [ ] Health check: `curl https://api.academy-tulie.com/api/health`
- [ ] Test login/register
- [ ] Test xem khóa học
- [ ] Test xem video
- [ ] Test thanh toán (nếu có)

---

## 🔧 Troubleshooting

### Cloud Run không start được
```bash
gcloud run services logs read academy-api --region asia-southeast1
```

### Prisma connection error
- Kiểm tra `DATABASE_URL` có `?pgbouncer=true`
- Đảm bảo IP của Cloud Run được whitelist trong Supabase

### CORS error
- Cập nhật `CLIENT_URL` trong Cloud Run environment variables
