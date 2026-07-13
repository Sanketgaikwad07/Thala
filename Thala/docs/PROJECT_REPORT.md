# Thala Sports & Fitness Tracking App - Project Report

## Summary

Thala is a three-part project: a Node.js/Express REST API, an Expo/React Native mobile app, and a
React admin web dashboard, covering the full module list requested - authentication, profile, dashboard,
running/cycling/walking GPS trackers, heart rate, daily activity, workouts, sports, nutrition & AI coach,
progress analytics, achievements, challenges, community, notifications, settings, and an admin panel.

All data is served from a seeded, in-memory mock data store on the backend (28 days of activity history,
32 exercises, 24 workouts, 10 sports, sample community posts, challenges, achievements) so the entire
stack runs immediately after `npm install` with no external database or API keys required.

## What was verified

| Area | How it was verified |
|---|---|
| Backend TypeScript | `tsc --noEmit` - zero errors |
| Backend runtime | Started the server, hit 20+ endpoints with curl across every module (auth, users, activities, nutrition, analytics, achievements, admin) with real responses |
| Backend RBAC | Confirmed a regular user gets `403` on `/admin/*` and the admin account gets `200` |
| Backend tests | 16 Jest/Supertest integration tests covering auth, users, activities, nutrition/AI coach, and admin - all passing |
| Backend production build | `npm run build && node dist/server.js` - compiled bundle runs and serves traffic |
| Swagger | `/docs` and `/docs.json` serve a full OpenAPI 3.0 spec (55 documented paths) |
| Mobile TypeScript | `tsc --noEmit` - zero errors across the entire app |
| Mobile bundling | `npx expo export --platform android` and `--platform ios` both succeed on SDK 54 (2815/2946 modules bundled to Hermes bytecode) |
| Mobile Expo Go compatibility | Ran `npx expo start --offline` and fetched the manifest exactly as Expo Go does (`/index.exp` with `Expo-Platform` header) - confirmed `"runtimeVersion": "exposdk:54.0.0"` for both Android and iOS, matching current Expo Go's supported SDK |
| Admin web TypeScript | `tsc -b` - zero errors |
| Admin web build | `vite build` succeeds |
| Admin web end-to-end | Headless-browser (Playwright) test: logs in as admin, confirms live dashboard stats, and navigates all 9 pages with zero console errors |

## Known limitations (transparently disclosed)

- **GPS tracking cannot be visually demonstrated in this environment** - there is no physical device or
  running emulator available in the sandbox that generates real GPS movement. The tracker screen uses
  `expo-location.watchPositionAsync` correctly and was verified to compile/bundle; it needs a real device
  or simulator with simulated location to see the live route draw.
- **Firebase Cloud Messaging and Cloudinary** are wired with real SDKs but fall back to logging/mock URLs
  when credentials aren't provided (see `.env.example` in `/backend`) - this is intentional so the app
  runs without needing real third-party accounts, but a production deploy needs real keys.
- **Google Sign-In** verifies ID tokens with `google-auth-library` when `GOOGLE_CLIENT_ID` is set; without
  it, the backend decodes the token payload without cryptographic verification purely so the flow is
  testable end-to-end in demo mode. Set a real client ID before shipping.
- The admin web dashboard uses hand-rolled CSS rather than a component library, by design, to keep it
  dependency-light and avoid a second styling-framework version conflict (see the NativeWind note below).

## Notable engineering decisions

- **Expo SDK 54** (React 19.1 / RN 0.81, New Architecture) - the project originally shipped on SDK 51
  because SDK 54 didn't yet have a stable Expo Go release; it was upgraded once Expo Go added SDK 54
  support. Every `expo-*`/`react-native-*` package was bumped to the exact version listed in SDK 54's
  own `bundledNativeModules.json` rather than guessed, and `react-native-worklets` was added as
  Reanimated 4's required peer (Reanimated 4 dropped legacy-architecture support, so New Architecture
  is now mandatory - `app.json` sets `"newArchEnabled": true`). React Navigation moved 6 → 7 in the same
  pass since v6 doesn't support React 19 cleanly.
- **NativeWind/Tailwind removed from the mobile app.** It was installed and configured in the original
  build but no screen ever used a `className` prop - all styling went through `StyleSheet.create` plus a
  custom theme system - and NativeWind v2 required a brittle `postcss`/`tailwindcss` version pin to avoid
  a sync/async Babel-transform crash. Carrying an unused dependency with a known fragility into a major
  React 19 / New Architecture upgrade wasn't worth the risk, so it was dropped (see `mobile/README.md`
  for how to reintroduce NativeWind v4 if needed later).
- **TypeScript bumped to `5.5.4`** in the mobile app (from Expo's default `~5.3.3`) - `@tanstack/react-query`
  v5's type declarations use the `NoInfer` utility type introduced in TS 5.4, and without it every
  `useQuery`/`useMutation` call silently degraded to `any`, which is why an early typecheck showed ~20
  "implicit any" errors that had nothing to do with the actual application code.

## Demo credentials

| App | Role | Email | Password |
|---|---|---|---|
| Mobile / Backend | User | `demo@thala.app` | `Demo@1234` |
| Mobile / Backend | User | `priya@thala.app` | `Demo@1234` |
| Backend / Admin Web | Admin | `admin@thala.app` | `Admin@1234` |

OTP login always accepts code `123456` in non-production mode.

## Running the whole stack

```bash
# 1. Backend
cd backend && npm install && cp .env.example .env && npm run dev
# -> http://localhost:4000  (Swagger at /docs)

# 2. Mobile (in a new terminal)
cd mobile && npm install && cp .env.example .env && npm start
# -> scan the QR with Expo Go, or press a/i for an emulator

# 3. Admin web (in a new terminal)
cd admin-web && npm install && cp .env.example .env && npm run dev
# -> http://localhost:5173
```
