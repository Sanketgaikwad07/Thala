# Thala Fitness API (Backend)

Node.js + Express + TypeScript REST API for the Thala Sports & Fitness Tracking app.

Data is served from a seeded **in-memory mock database** (`src/data/db.ts` + `src/data/seed.ts`) so the whole
project runs immediately with realistic data and no external database setup. Swap `src/data/db.ts` for a real
database layer (Mongo/Postgres) later without touching controllers, since every module only talks to `db.<collection>`.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:4000, Swagger at /docs
```

## Seeded demo accounts

| Role  | Email             | Password    |
|-------|-------------------|-------------|
| User  | demo@thala.app    | Demo@1234   |
| User  | priya@thala.app   | Demo@1234   |
| Admin | admin@thala.app   | Admin@1234  |

OTP login/verification always accepts code `123456` in non-production mode (logged to the console on request).

## Scripts

- `npm run dev` - start with ts-node + nodemon
- `npm run build` - compile to `dist/`
- `npm start` - run the compiled build
- `npm test` - run the Jest/Supertest test suite
- `npm run typecheck` - `tsc --noEmit`

## API documentation

Interactive Swagger UI: `GET /docs` — raw OpenAPI JSON: `GET /docs.json`.

## Folder structure

```
src/
  config/       env, swagger, cloudinary, firebase
  middlewares/  auth (JWT), validation, error handling
  utils/        jwt, BMI/BMR/calorie calculations, AI coach rules, pagination
  types/        shared domain models
  data/         in-memory db + seed data (mock data source of truth)
  modules/      one folder per domain (auth, users, activities, heartrate,
                history, workouts, sports, nutrition, analytics, achievements,
                challenges, community, notifications, reports, admin)
    <module>.routes.ts      Express router + Swagger annotations
    <module>.controller.ts  HTTP layer
    <module>.service.ts     Business logic
    <module>.validation.ts  express-validator rules
  tests/        Jest + Supertest integration tests
```

## Auth

JWT access tokens (15m) + refresh tokens (30d) with a `tokenVersion` on the user record so logout/password-reset
revokes all outstanding refresh tokens. Supports email/password, OTP (email or phone), and Google Sign-In
(verifies the ID token with `google-auth-library` when `GOOGLE_CLIENT_ID` is set; falls back to decoding the
token payload in demo mode so the flow is testable without live Google credentials).

## Docker

```bash
docker build -t thala-backend .
docker run -p 4000:4000 --env-file .env thala-backend
```
