# Thala Fitness (Mobile)

Expo (**SDK 54**) + React Native + TypeScript app for the Thala Sports & Fitness Tracking platform.
Compatible with the current Expo Go app (SDK 54).

## Stack

React 19 - React Native 0.81 (New Architecture) - React Navigation 7 (stack + bottom tabs) -
Redux Toolkit - React Query - Axios - React Native Paper - React Hook Form - Reanimated 4 -
react-native-maps - Victory Native (classic, SVG-based) - Lottie - expo-location -
expo-auth-session (Google Sign-In) - expo-secure-store (token storage).

## Quick start

```bash
npm install
cp .env.example .env   # point EXPO_PUBLIC_API_BASE_URL at your backend
npm start              # Expo dev server - scan the QR with Expo Go, or press a/i for emulators
```

The backend must be running (see `/backend`). On a physical device or emulator, `localhost` refers to the
device itself, so set `EXPO_PUBLIC_API_BASE_URL` in `.env` to your machine's LAN IP, e.g.
`http://192.168.1.20:4000/api/v1` (or `http://10.0.2.2:4000/api/v1` for the Android emulator).

Demo login: `demo@thala.app` / `Demo@1234` (see backend README for all seeded accounts).

## Scripts

- `npm start` / `npm run android` / `npm run ios` / `npm run web`
- `npm run typecheck` - `tsc --noEmit` (zero errors)
- `npx expo export --platform android` / `--platform ios` - verifies the whole app bundles with Metro

## Structure

```
src/
  api/          Axios calls per backend module (auth, users, activities, heartRate, workouts, sports,
                 nutrition, analytics, achievements, challenges, community, notifications, reports)
  api/client.ts  Axios instance with JWT access-token header + automatic refresh-token retry on 401
  app/           Redux store, typed hooks, React Query client
  features/      Redux slices (auth, ui) + auth action hooks (login/register/OTP/Google/logout)
  navigation/    Auth stack, bottom tabs, root stack wiring everything together
  screens/       One folder per feature area (auth, dashboard, profile, activity, heartrate, workouts,
                 sports, nutrition, analytics, achievements, challenges, community, notifications, settings)
  components/    Shared UI (ScreenContainer, Card, StatCard, FormTextInput, EmptyState, LoadingView...)
  theme/         Light/dark color tokens + React Native Paper theme bridge
  types/         Domain models mirroring the backend API
  utils/         Token storage (SecureStore), GPS/activity math (haversine distance, pace, calories)
```

## Notes on native features

- **New Architecture is enabled** (`"newArchEnabled": true` in `app.json`), required by
  `react-native-reanimated@4` (Reanimated 4 dropped legacy-architecture support entirely) and the
  default for SDK 54 projects. `react-native-worklets` is installed alongside Reanimated as its
  required peer for the worklets/Babel plugin.
- **GPS tracking** (`ActivityTrackerScreen`) uses `expo-location.watchPositionAsync` with a live
  `react-native-maps` polyline. Requires a physical device or emulator with location services -
  the iOS Simulator and most Android emulators support simulated GPS routes for testing.
- **Google Sign-In** uses `expo-auth-session`'s Google provider (works in Expo Go / dev builds without
  ejecting). Set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in `.env`.
- **Push notifications** are scaffolded via `expo-notifications` + the backend's FCM stub. A full native
  FCM integration (google-services.json) requires an EAS/dev-client build - see `app.json` plugins.
- **Charts** use `victory-native` (the classic SVG-based v36 API, not the Skia-based "XL" rewrite) for
  heart rate and analytics screens - it has no native code of its own and only needs `react-native-svg`,
  so it works unmodified under the New Architecture.
- **Styling** is plain `StyleSheet` + a small custom light/dark theme (`src/theme`) bridged into React
  Native Paper's theme - NativeWind/Tailwind was removed (see below).

## Why NativeWind was removed

The original build included NativeWind (Tailwind for React Native), but no screen ever actually used a
`className` prop - all styling went through `StyleSheet.create` + the theme system. NativeWind v2 also
required a brittle `postcss`/`tailwindcss` version pin to avoid a sync/async Babel-transform crash. When
upgrading to SDK 54 (React 19, RN 0.81, New Architecture), keeping an unused dependency that had already
caused one build break wasn't worth the added risk, so it was dropped entirely. If you want Tailwind-style
styling going forward, install `nativewind@^4` (its Metro-based v4 architecture is compatible with the New
Architecture) and wire up `metro.config.js` + a global CSS file per its current docs.

## Upgrade history

- **SDK 51 → 54**: bumped `expo`, `react` (18.2 → 19.1), `react-native` (0.74 → 0.81), and every
  `expo-*`/`react-native-*` package to the exact versions listed in SDK 54's
  `bundledNativeModules.json`; added `react-native-worklets` (required peer for Reanimated 4);
  moved React Navigation 6 → 7; removed NativeWind/Tailwind (unused, see above). Verified with a clean
  `tsc --noEmit`, `npx expo export` for both Android and iOS, and a running `expo start` dev server whose
  manifest reports `"runtimeVersion": "exposdk:54.0.0"` (what Expo Go checks against).
