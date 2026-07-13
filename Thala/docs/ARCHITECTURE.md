# Thala - Architecture

## System Overview

```mermaid
flowchart TB
    subgraph Clients
        MOBILE["Mobile App<br/>Expo / React Native / TypeScript"]
        ADMIN["Admin Dashboard<br/>React + Vite"]
    end

    subgraph Backend["Backend API (Node.js + Express + TypeScript)"]
        AUTH["Auth Module<br/>JWT + Refresh, OTP, Google"]
        USERS["Users / Profile"]
        ACTIVITIES["Activities<br/>Running / Cycling / Walking"]
        HR["Heart Rate"]
        WORKOUTS["Workouts & Exercises"]
        SPORTS["Sports"]
        NUTRITION["Nutrition<br/>BMI/BMR/Diet/AI Coach"]
        ANALYTICS["Analytics"]
        ACH["Achievements"]
        CHAL["Challenges & Leaderboards"]
        COMM["Community"]
        NOTIF["Notifications"]
        REPORTS["Reports"]
        ADMINAPI["Admin API"]
        SWAGGER["Swagger / OpenAPI docs"]
    end

    subgraph Data["In-Memory Seeded Data Store"]
        DB[("db.ts collections:<br/>users, activitySessions, heartRateEntries,<br/>dailyActivities, exercises, workouts, sports,<br/>dietPlans, achievements, challenges, posts,<br/>notifications")]
    end

    subgraph External["External Services (mocked in dev)"]
        CLOUD["Cloudinary<br/>(image uploads)"]
        FCM["Firebase Cloud Messaging<br/>(push notifications)"]
        GOOGLE["Google OAuth<br/>(Sign-In verification)"]
    end

    MOBILE -- "REST + JWT" --> Backend
    ADMIN -- "REST + JWT (admin role)" --> Backend
    Backend --> DB
    AUTH -.-> GOOGLE
    USERS -.-> CLOUD
    NOTIF -.-> FCM
```

## Request flow (example: completing a run)

```mermaid
sequenceDiagram
    participant U as Mobile App
    participant API as Express API
    participant DB as In-memory store

    U->>U: expo-location watchPositionAsync (live GPS points)
    U->>U: Start / Pause / Resume / Stop controls
    U->>API: POST /api/v1/activities (Bearer access token)
    API->>API: authenticate() middleware verifies JWT
    API->>API: activities.service computes pace/speed
    API->>DB: push ActivitySession, upsert DailyActivity
    API-->>U: 201 { session }
    U->>API: GET /api/v1/activities/:id
    API-->>U: session with full GPS route
    U->>U: Render map polyline + stats on ActivitySummaryScreen
```

## Auth flow (JWT access + refresh)

```mermaid
sequenceDiagram
    participant U as Mobile/Admin Client
    participant API as Auth Module

    U->>API: POST /auth/login (email, password)
    API-->>U: { accessToken (15m), refreshToken (30d), user }
    U->>U: Store tokens in SecureStore / localStorage
    Note over U: Every request sends Authorization: Bearer <accessToken>
    U->>API: Any request with expired accessToken
    API-->>U: 401 Unauthorized
    U->>API: POST /auth/refresh { refreshToken }
    API-->>U: New access/refresh token pair
    U->>API: Retry original request
```

## Why an in-memory seeded store instead of a real database

The spec asked for the project to "run without modification" and be delivered with seed/mock data.
Using a small typed in-memory store (`backend/src/data/db.ts` + `seed.ts`) means:

- Zero external setup (no MongoDB/Postgres instance, no connection strings) - `npm install && npm run dev` works immediately.
- Deterministic demo data (fixed seeded users, 28 days of activity history, exercises, sports, etc.)
- Each module only touches `db.<collection>`, so swapping in a real database later means replacing
  `db.ts` with a repository backed by Mongoose/Prisma - controller and route code does not change.

## Frontend architecture (mobile)

- **Navigation**: `AuthNavigator` (onboarding/login/register/OTP) vs `MainTabNavigator` (5 tabs) + a
  `RootNavigator` stack for every detail screen, switched by Redux auth status.
- **State**: Redux Toolkit for auth/session + UI preferences (theme, language, notifications toggle);
  React Query for all server state (caching, refetch, pagination).
- **API layer**: one file per backend module in `src/api/`, all going through a single axios instance
  with a request interceptor (attaches the access token) and a response interceptor (silently retries
  once via `/auth/refresh` on 401, then logs the user out if that also fails).
