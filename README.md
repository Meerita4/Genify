# Genify — AI Content Generator SaaS

A full-stack SaaS platform that generates viral content for social media and businesses in seconds using OpenAI GPT-4o-mini.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 · TypeScript · Tailwind CSS |
| Backend | NestJS · TypeScript |
| Database | PostgreSQL · Prisma ORM |
| AI | OpenAI GPT-4o-mini (streaming) |
| Auth | JWT (JSON Web Tokens) |

## Project Structure

```
Genify/
├── frontend/          # Next.js app (port 3000)
├── backend/           # NestJS API (port 4000)
└── docker-compose.yml # PostgreSQL local dev DB
```

## Features

- **Content Generator** — Post, Ideas, Script, Caption, Thread for any platform
- **Streaming UI** — Real-time token streaming (like ChatGPT)
- **Credit System** — 10 free credits per user
- **Content History** — Search, view, copy, delete all generations
- **JWT Auth** — Secure register/login with Passport.js
- **Dashboard** — Stats, quick actions, recent history

## Getting Started

### 1. Start the database

Requires [Docker](https://docker.com).

```bash
docker-compose up -d
```

### 2. Configure the backend

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://genify_user:genify_pass@localhost:5432/genify_db"
JWT_SECRET="your-super-secret-key"
OPENAI_API_KEY="sk-..."   # <-- Add your OpenAI API key here
FRONTEND_URL="http://localhost:3000"
PORT=4000
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Start the backend

```bash
cd backend
npm run start:dev
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/users/stats` | ✅ | Get user stats |
| POST | `/api/generations` | ✅ | Generate content |
| POST | `/api/generations/stream` | ✅ | Generate with SSE streaming |
| GET | `/api/generations` | ✅ | Get history |
| DELETE | `/api/generations/:id` | ✅ | Delete generation |

## Content Types

| Type | Description |
|------|-------------|
| `post` | Social media post |
| `ideas` | 5 content ideas |
| `script` | Video script with hook + CTA |
| `caption` | Short caption |
| `thread` | Twitter/X thread (5 tweets) |

## Deploy

- **Frontend** → Vercel: connect the `/frontend` folder
- **Backend** → Railway or Render: connect the `/backend` folder
- **Database** → Railway PostgreSQL or Supabase
