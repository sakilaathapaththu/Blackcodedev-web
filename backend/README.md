# BlackCode Devs — Backend API

Node.js + Express 5 API for the BlackCode website. It handles **careers** (jobs and applications with CV
upload) and the **contact form** (email). It replaces the old `careers-api/` and `api/send-contact.js`, and
keeps their URLs working.

## Quick start

```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # http://localhost:4000 (auto-restarts on change)
```

| Script         | What it does                             |
| -------------- | ---------------------------------------- |
| `npm run dev`  | Dev server with `--watch`, loads `.env`  |
| `npm start`    | Production server                        |
| `npm run lint` | ESLint                                   |

Requires Node.js 20+.

## Environment variables

All variables are checked at startup (`src/config/env.js`). The app refuses to start if a required one is
missing or invalid.

| Variable                | Required | Description                                                                 |
| ----------------------- | -------- | --------------------------------------------------------------------------- |
| `MONGO_URI`             | yes      | MongoDB connection string                                                   |
| `ADMIN_API_KEY`         | yes      | Admin key, at least 16 characters (use a random 64-character hex string)    |
| `BLOB_READ_WRITE_TOKEN` | yes      | Vercel Blob token for CV uploads                                            |
| `CORS_ORIGINS`          | prod     | Comma-separated frontend origins, e.g. `https://blackcodedev.com`           |
| `BLOB_ACCESS`           | no       | `public` (default) or `private` (needs a private Blob store)                |
| `GMAIL_USER`            | contact  | Gmail address used to send contact emails                                   |
| `GMAIL_APP_PASSWORD`    | contact  | Gmail App Password                                                          |
| `CONTACT_TO_EMAIL`      | no       | Inbox that receives enquiries (default `helloblackcodedev@gmail.com`)       |
| `PORT`                  | no       | Local port (default 4000)                                                   |

If the Gmail variables are not set, `POST /api/contact` returns `503 Contact form is not configured`.

## Endpoints

Admin routes need the header `x-api-key: <ADMIN_API_KEY>`.

| Method | Path                         | Access | Description                                     |
| ------ | ---------------------------- | ------ | ----------------------------------------------- |
| GET    | `/api/health`                | public | Health check                                    |
| GET    | `/api/jobs`                  | public | Active jobs (CDN-cached for 60 s)               |
| GET    | `/api/jobs/all`              | admin  | All jobs                                        |
| GET    | `/api/jobs/:id`              | admin  | One job                                         |
| POST   | `/api/jobs`                  | admin  | Create job (`/api/jobs/add` also works)         |
| PATCH  | `/api/jobs/:id`              | admin  | Update job (partial)                            |
| PATCH  | `/api/jobs/:id/active`       | admin  | `{ "active": boolean }`                         |
| POST   | `/api/applications`          | public | Multipart: `jobId, fullName, email, phone, description, cv` |
| GET    | `/api/applications`          | admin  | All applications                                |
| GET    | `/api/applications/:id/cv`   | admin  | Download the CV file                            |
| POST   | `/api/contact`               | public | Contact form (`/api/send-contact` also works)   |

Errors are always JSON: `{ "error": "message", "details"?: [{ "field", "message" }] }`.

## Project structure

```
api/index.js            Vercel serverless entry (exports the Express app)
src/
  app.js                Builds the app: security middleware, CORS, routes, error handling
  server.js             Local/long-running server entry
  config/               env.js (validated env), db.js (cached Mongo connection)
  routes/index.js       All routes in one place: path -> middleware -> controller
  controllers/          Request handlers (jobs, applications, contact)
  services/             External integrations: Vercel Blob (CVs), Nodemailer (email)
  models/               Mongoose models (Job, Application)
  middleware/           Admin auth, validation, rate limits, CV upload, error handler
  validators/schemas.js zod request schemas
  utils/                HttpError, escapeHtml
```

Each layer has one job. Routes wire things together, controllers handle HTTP, services talk to outside
systems, and validation and auth live in middleware. Express 5 forwards errors from async handlers to
`errorHandler` automatically, so controllers just `throw`.

## Security

- **Admin auth:** the API key is compared in constant time. Admin routes are rate-limited.
- **Validation:** every request body is checked with zod. Unknown fields are dropped, and bad ids return 404
  instead of 500.
- **CV uploads:** only PDF/DOC/DOCX up to 10 MB are accepted. The extension, MIME type **and** the file's
  first bytes are checked. Files are stored under random UUID paths. Use `BLOB_ACCESS=private` so CVs can only
  be downloaded through the admin endpoint.
- **Contact form:** all input is HTML-escaped in the email, newlines are stripped from header fields, a
  honeypot field catches bots, and a strict rate limit applies (5 per 15 minutes per IP).
- **HTTP:** `helmet` security headers, a CORS allow-list, a 100 KB JSON body limit, and `x-powered-by`
  turned off.
- **Errors:** internal details are logged on the server only. Clients get a generic message.
- `.env` is git-ignored. Never commit secrets.

> Rate limits are kept in memory per server instance. On serverless this is a first line of defence. For
> strict global limits, use a shared store such as Upstash Redis.

## Deploying on Vercel

1. In the existing careers API Vercel project (`blackcodedev-web-wz5p`), change **Root Directory** to
   `backend`. Or create a new project with that root.
2. Add the environment variables above. Set `CORS_ORIGINS` to the frontend domain(s).
3. Deploy. `vercel.json` routes every request to `api/index.js`.
4. In the frontend project, set `NEXT_PUBLIC_API_URL` to this deployment's URL.
