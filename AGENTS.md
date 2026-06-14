# api-sdn-2-kalimati

## Stack

- **Runtime:** Node.js, CommonJS modules
- **Framework:** Express 5, Mongoose 9, TypeScript 6
- **Auth:** JWT (`Authorization: Bearer <token>`, 1h expiry) + token blacklist
- **Media:** Cloudinary (configured but route handlers commented out)
- **Deploy:** Vercel (`vercel.json` → `dist/index.js` via `@vercel/node`)

## Architecture (layered)

`src/router/` → `src/controllers/` → `src/services/` → `src/repositories/` → `src/models/schema/` (Mongoose)

Types split across three model layers:
- `schema/` — Mongoose schemas
- `entity/` — Mongoose Document interfaces
- `dto/` — plain request/response interfaces

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | `ts-node-dev --respawn --transpile-only ./src/index.ts` |
| `npm run build` | `tsc` (output to `dist/`) |
| `npm start` | `node dist/server.js` |

No test, lint, or typecheck scripts exist. No CI.

## Routes (base: `/api`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/user` | — | Register user |
| POST | `/login` | — | Login, returns JWT |
| POST | `/logout` | verifyToken | Logout, blacklists token |
| POST | `/registration` | — | PPDB registration |
| GET | `/registration` | verifyToken+isAdmin | List all registrations |
| GET | `/registration/count` | — | Total count |
| GET | `/registration/:id` | — | Get by Mongo ID |
| PATCH | `/registration/:id` | verifyToken+isAdmin | Update status (body: `{ status: "validated" | "unvalidated" }`) |

## Key details

- **Default port:** 8086 (source fallback), overridden by `.env` `PORT` (currently 5000)
- **CORS:** allows `https://sdn2kalimati.vercel.app` + `http://localhost:3000`, credentials: true
- **Registration number format:** `SPMB26-SD-{NNN}` (auto-increment, no reset)
- **Duplicate check for registration:** by `student.nik` (unique in schema too)
- **`build` → `dist/index.js`**, but `start` points at `dist/server.js` — likely a config bug
- **`dist/`** is committed; rebuild with `npm run build` before deploy
- **`.env`** is gitignored; see `.env.example` for the required vars
