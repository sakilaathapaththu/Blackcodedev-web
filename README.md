# Blackcodedev-web

Website and API for [BlackCode Devs](https://blackcodedev.com).

| Folder      | What it is                                                                              |
| ----------- | --------------------------------------------------------------------------------------- |
| `frontend/` | Website: Next.js 16 + TypeScript. See [frontend/README.md](frontend/README.md).          |
| `backend/`  | API: Node.js + Express (careers and contact form). See [backend/README.md](backend/README.md). |

## Run locally

```bash
# terminal 1
cd backend && cp .env.example .env && npm install && npm run dev     # http://localhost:4000

# terminal 2
cd frontend && cp .env.example .env.local && npm install && npm run dev   # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `frontend/.env.local`, and include
`http://localhost:3000` in `CORS_ORIGINS` in `backend/.env`.

Each folder deploys as its own Vercel project (Root Directory = `frontend` or `backend`).
