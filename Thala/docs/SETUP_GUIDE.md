# Thala - Fresh Setup Guide

Step-by-step instructions to go from a clean machine to a running backend, mobile app, and admin
dashboard. No real database is required - the backend seeds realistic mock data into memory on startup.

---

## 1. Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Node.js** | 18.x or 20.x LTS | Required by all three apps. Avoid Node 22+ with old Expo/RN native tooling if you hit odd native-module errors - 18/20 LTS is the safest choice for React Native. |
| **npm** | 9+ (ships with Node) | Package manager used throughout (no yarn/pnpm lockfiles are provided). |
| **Git** | any recent version | To clone/extract the project and manage your own changes. |
| **VS Code** | latest | Recommended IDE (see extensions below). Any editor works, but the project's TS path aliases (`@/*`) and formatting assume VS Code + the TypeScript workspace version. |
| **Java JDK** | 17 | Required by Android Studio / Gradle to build and run the Android emulator. |
| **Android Studio** | latest | Provides the Android SDK, AVD Manager (emulator), and platform tools (`adb`). Needed only if you want to test on an Android emulator - a physical device via Expo Go does not need Android Studio. |
| **Expo Go app** | latest (from Play Store / App Store) | Fastest way to run the mobile app on a physical phone without building a native binary. |
| **Xcode** (macOS only) | latest | Only needed for the iOS Simulator. Not required on Windows/Linux - use Expo Go on a physical iPhone instead. |

You do **not** need MongoDB, PostgreSQL, Docker, or any cloud account (Cloudinary/Firebase/Google OAuth) to
run the project - every external service has a working mock fallback for local development.

### Recommended VS Code extensions

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **React Native Tools** (`msjsdiag.vscode-react-native`) - debugging support for the Expo app
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - autocomplete for NativeWind class names in `/mobile`
- **Thunder Client** or **REST Client** - to manually poke backend endpoints outside of Swagger

---

## 2. Get the code into VS Code

```bash
# unzip the delivered archive, or clone your fork of the branch
unzip Thala-fitness-app.zip
cd Thala
code .            # opens the whole monorepo (backend/, mobile/, admin-web/, docs/) in VS Code
```

Open three integrated terminals in VS Code (``Ctrl+` `` / `` Cmd+` ``, then the "+" icon three times) -
one for the backend, one for the mobile app, one for the admin dashboard. You'll run all three
side-by-side.

---

## 3. Database setup

**There is nothing to install.** `backend/src/data/db.ts` is an in-memory store that
`backend/src/data/seed.ts` populates on every server start with:

- 3 users (2 regular, 1 admin) with full profiles
- 28 days of daily activity, 14 GPS-style activity sessions, a week of heart-rate readings
- 32 exercises, 24 workouts, 10 sports, a diet plan, achievements, challenges, community posts

Restarting the backend resets the data back to this seed state - handy for repeatable testing, but
remember nothing you create through the app (new posts, updated profile, etc.) survives a restart.

---

## 4. Environment variables

Each app has a `.env.example` - copy it to `.env` in each folder before running.

### `backend/.env`

```bash
cd backend
cp .env.example .env
```

Defaults work out of the box. The only thing you may want to change locally is nothing - `PORT=4000`
and demo JWT secrets are fine for local development. For a real deployment, replace
`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` and the Cloudinary/Firebase/Google keys.

### `mobile/.env`

```bash
cd mobile
cp .env.example .env
```

You **must** edit `EXPO_PUBLIC_API_BASE_URL` here depending on how you run the app - see section 6
below for the exact value to use for the emulator vs. a physical device (this is the #1 thing people
get wrong: "localhost" on a phone/emulator means the phone/emulator itself, not your computer).

### `admin-web/.env`

```bash
cd admin-web
cp .env.example .env
```

Default `VITE_API_BASE_URL=http://localhost:4000/api/v1` is correct as-is, since the admin dashboard
runs in a browser on the same machine as the backend.

---

## 5. Install & start, in order

Always start the **backend first** - both the mobile app and the admin dashboard call it immediately on
launch (login screen, dashboard data, etc.) and will show network errors if it isn't up yet.

### Step 1 - Backend

```bash
cd backend
npm install
npm run dev
```

Wait for:
```
Thala API listening on http://localhost:4000
Swagger docs: http://localhost:4000/docs
```

Sanity check in a browser: open `http://localhost:4000/health` (should show `{"success":true,...}`) and
`http://localhost:4000/docs` (interactive Swagger UI).

### Step 2 - Admin web dashboard

```bash
cd admin-web
npm install
npm run dev
```

Open `http://localhost:5173`, log in with `admin@thala.app` / `Admin@1234`.

### Step 3 - Mobile app

```bash
cd mobile
npm install
npm start
```

This opens the Expo developer tools in your terminal (and a QR code). Keep it running - see section 6
for how to actually open the app on an emulator or phone.

---

## 6. Running on an Android emulator

1. Open **Android Studio → More Actions → Virtual Device Manager**, create a device (e.g. Pixel 7,
   API 34), and start it. Confirm it's running with `adb devices` in a terminal.
2. **Edit `mobile/.env`**: an Android emulator reaches your host machine at the special address
   `10.0.2.2`, not `localhost`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000/api/v1
   ```
3. With the emulator already running and the backend already started, go to the terminal running
   `npm start` (from step 3 above) and press **`a`**. Expo builds and installs the app into the
   emulator automatically (this uses Expo Go under the hood - no native build required).
4. The app should open on the Onboarding screen. Tap through, then log in with
   `demo@thala.app` / `Demo@1234`.
5. **Location permissions**: to test the Running/Cycling/Walking tracker, the emulator needs simulated
   GPS. In Android Studio's emulator toolbar, open **"..." (Extended controls) → Location**, set a
   starting point, then use the "route" tab to play back a path or manually change coordinates while
   the tracker screen is open - the app's `expo-location.watchPositionAsync` subscription will pick up
   each new point and draw the live polyline on the map.

If you change `.env` while Metro is already running, stop it (`Ctrl+C`) and restart `npm start` -
`EXPO_PUBLIC_*` variables are inlined at bundle time and won't hot-reload.

---

## 7. Running on a physical device

1. Install **Expo Go** from the Play Store (Android) or App Store (iOS) on your phone.
2. Make sure your phone and your computer are on the **same Wi-Fi network**.
3. Find your computer's LAN IP:
   - macOS/Linux: `ipconfig getifaddr en0` (or `hostname -I`)
   - Windows: `ipconfig` → look for "IPv4 Address" under your active adapter
4. **Edit `mobile/.env`**:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://<your-computer-LAN-IP>:4000/api/v1
   ```
   Example: `http://192.168.1.42:4000/api/v1`
5. Restart `npm start` in `mobile/` after saving `.env`.
6. Scan the QR code shown in the terminal (or at `http://localhost:8081` in your browser) with:
   - **Android**: the Expo Go app's built-in scanner
   - **iOS**: the Camera app (it will prompt to open in Expo Go)
7. The app loads over your LAN. Log in with the demo account and test normally - GPS tracking now uses
   your phone's **real location**, so the Running/Cycling/Walking tracker will draw your actual route if
   you walk/drive around with the tracker screen open (grant the location permission when prompted).

If your firewall blocks the connection, temporarily allow inbound connections on port `4000` (backend)
and `8081`/`19000` (Expo) on your computer, or use `npx expo start --tunnel` instead of LAN mode (slower,
but works across networks/firewalls without any port changes).

---

## 8. Testing checklist (golden path)

Once everything is running, a good end-to-end smoke test:

1. **Onboarding → Register** a brand-new account (or use the demo login).
2. **Dashboard**: confirm the stat cards, weekly summary, and AI Coach preview load.
3. **Activity tab → Start a Run**: grant location permission, tap start, wait a few seconds (or move
   around on a physical device / play back a route on the emulator), tap stop, confirm the summary
   screen shows a route on the map and saved stats.
4. **Workouts tab**: browse a category, open a workout, open an exercise detail.
5. **Nutrition tab**: check the diet plan, log some water, open AI Coach.
6. **Profile → Edit Profile**: update weight/height, confirm BMI updates.
7. **Profile → Achievements / Challenges / Community**: confirm each screen loads and basic actions
   (join a challenge, like a post) work.
8. **Settings**: toggle dark mode, confirm the whole app re-themes.
9. **Admin dashboard**: log in as `admin@thala.app`, confirm the new user you registered in step 1
   shows up under **Users**.

## 9. Troubleshooting

- **"Network request failed" on the phone/emulator**: almost always the `EXPO_PUBLIC_API_BASE_URL`
  value - re-check sections 6/7 above and make sure the backend terminal is still running.
- **Metro bundler acting stale after changing `.env` or native config**: stop it and run
  `npx expo start -c` to clear the cache.
- **`postcss`/`nativewind` build errors** if you change dependency versions: see the note at the bottom
  of `mobile/README.md` - `postcss` is intentionally pinned to `8.4.23` and `tailwindcss` to `3.3.2`.
- **Port 4000 already in use**: another process is bound to it - stop it, or change `PORT` in
  `backend/.env` and update `EXPO_PUBLIC_API_BASE_URL` / `VITE_API_BASE_URL` to match.
