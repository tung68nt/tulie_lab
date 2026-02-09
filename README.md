# Academy Tulie

> Nền tảng học trực tuyến hiện đại cho tương lai công nghệ.

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Backend** | NestJS, Prisma ORM |
| **Database** | PostgreSQL (Supabase) |
| **Storage** | Cloudflare R2 |
| **Realtime** | Socket.io |

## 📁 Project Structure

```
academy_tulie/
├── client/           # Next.js frontend
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/   # UI components
│   │   ├── features/     # Feature modules (api, hooks, types)
│   │   └── lib/      # Utilities & config
│   └── public/
├── server/           # NestJS backend
│   ├── src/
│   │   └── modules/  # Feature modules
│   └── prisma/       # Database schema
└── .env.example      # Environment template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- PostgreSQL database (Supabase)

### Installation

```bash
# Clone repository
git clone https://github.com/yourorg/academy_tulie.git
cd academy_tulie

# Install dependencies
cd client && bun install
cd ../server && bun install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Run database migrations
cd server && npx prisma migrate dev

# Start development servers
# Terminal 1 - Backend
cd server && bun run dev

# Terminal 2 - Frontend
cd client && bun run dev
```

### Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📚 Documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for coding guidelines.

## 📝 License

Proprietary - All rights reserved.
