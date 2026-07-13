# Thala - Sports & Fitness Tracking Platform

A production-ready Sports & Fitness Tracking platform: a React Native mobile app, a Node.js/Express
REST API, and a React admin web dashboard.

- **`/backend`** - Node.js + Express + TypeScript REST API (JWT auth, OTP, Google Sign-In, running/
  cycling/walking tracking, heart rate, workouts, sports, nutrition + AI coach, analytics, achievements,
  challenges, community, notifications, reports, admin endpoints). Seeded in-memory mock data, Swagger
  docs, Jest tests.
- **`/mobile`** - Expo (SDK 54) + React Native + TypeScript app covering every module: onboarding, auth,
  dashboard, GPS-tracked activity trackers with live maps, heart rate, workouts/sports/nutrition/AI coach,
  progress analytics, achievements, challenges, community feed, notifications and settings.
- **`/admin-web`** - React + Vite admin dashboard for managing users, workouts, sports, diet plans,
  achievements, platform analytics, reports and notification broadcasts.
- **`/docs`** - architecture diagrams, folder structure and the full project report (what was built, how
  it was tested, and known limitations).

## Quick start

```bash
# Backend API
cd backend && npm install && cp .env.example .env && npm run dev

# Mobile app (new terminal)
cd mobile && npm install && cp .env.example .env && npm start

# Admin dashboard (new terminal)
cd admin-web && npm install && cp .env.example .env && npm run dev
```

Demo accounts: `demo@thala.app` / `Demo@1234` (user), `admin@thala.app` / `Admin@1234` (admin).

See **[docs/PROJECT_REPORT.md](docs/PROJECT_REPORT.md)** for the full report, **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**
for diagrams, and **[docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)** for the complete file layout.
