# Thala - Folder Structure

```
Thala/
├── backend/                     Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/              env, swagger, cloudinary, firebase
│   │   ├── middlewares/         auth (JWT), validation, error handling
│   │   ├── utils/                jwt, BMI/BMR/calorie math, AI coach rules, pagination
│   │   ├── types/                shared domain models
│   │   ├── data/                  in-memory db.ts + seed.ts (mock data source of truth)
│   │   ├── modules/
│   │   │   ├── auth/              register, login, OTP, Google sign-in, refresh, forgot/reset password
│   │   │   ├── users/             profile, avatar upload, export data, delete account
│   │   │   ├── activities/        running/cycling/walking sessions, daily activity, weekly/monthly summary
│   │   │   ├── heartrate/         manual + device heart rate entries, daily/weekly/monthly stats
│   │   │   ├── history/           combined activity + heart-rate history feed
│   │   │   ├── workouts/          exercises + workout routines (categories, levels)
│   │   │   ├── sports/            10 sports with training plans, tips, injury prevention
│   │   │   ├── nutrition/         diet planner (BMI/BMR/calories), AI fitness coach
│   │   │   ├── analytics/         running/calories/heart-rate/weight/BMI/distance/workout-time series
│   │   │   ├── achievements/       badges + unlock evaluation
│   │   │   ├── challenges/         daily/weekly/monthly challenges + leaderboards
│   │   │   ├── community/          posts feed, like/comment/share/follow
│   │   │   ├── notifications/      in-app notifications + FCM push (mocked)
│   │   │   ├── reports/            personal weekly/monthly reports
│   │   │   ├── admin/               dashboard stats, user mgmt, content CRUD, platform analytics
│   │   │   └── router.ts           mounts every module under /api/v1
│   │   ├── app.ts / server.ts
│   │   └── tests/                  Jest + Supertest integration tests
│   ├── Dockerfile, .env.example, README.md
│
├── mobile/                       Expo (SDK 54) + React Native + TypeScript app
│   ├── src/
│   │   ├── api/                    axios calls per backend module + refresh-token interceptor
│   │   ├── app/                    Redux store, typed hooks, React Query client
│   │   ├── features/               auth slice + actions, ui slice (theme/notifications/language)
│   │   ├── navigation/             Auth stack, bottom tabs, root stack
│   │   ├── screens/
│   │   │   ├── auth/                Onboarding (Lottie), Login, Register, ForgotPassword, OtpVerify
│   │   │   ├── dashboard/            animated stat cards, weekly summary, AI coach preview
│   │   │   ├── profile/              profile view + edit (BMI, goals, medical conditions)
│   │   │   ├── activity/             GPS tracker (start/pause/resume/stop + live map), summary, history
│   │   │   ├── heartrate/             manual entry + daily/weekly/monthly chart
│   │   │   ├── workouts/              categories, list, detail, exercise detail
│   │   │   ├── sports/                list, detail (plans/tips/injury prevention)
│   │   │   ├── nutrition/             diet planner, AI coach, water reminder
│   │   │   ├── analytics/             7 chart types (Victory Native)
│   │   │   ├── achievements/          badge grid + evaluate
│   │   │   ├── challenges/            challenge list + leaderboard
│   │   │   ├── community/             feed, like/comment/share
│   │   │   ├── notifications/         list + mark read
│   │   │   └── settings/              theme, language, notifications, privacy, export, delete account
│   │   ├── components/               ScreenContainer, Card, StatCard, FormTextInput, EmptyState...
│   │   ├── theme/                     light/dark tokens + React Native Paper bridge
│   │   ├── types/                     domain models mirroring the backend
│   │   └── utils/                     SecureStore token storage, GPS/activity math
│   ├── assets/lottie/                onboarding animation
│   ├── App.tsx, index.ts, app.json, babel.config.js, tailwind.config.js
│
├── admin-web/                    React + Vite admin dashboard
│   ├── src/
│   │   ├── api/                    axios client + admin endpoint calls
│   │   ├── context/                 AuthContext (localStorage session)
│   │   ├── components/              Layout (sidebar), ProtectedRoute
│   │   ├── pages/                    Dashboard, Users, Workouts, Sports, DietPlans, Achievements,
│   │   │                            Analytics, Reports, Notifications, Login
│   │   └── styles/global.css        design system (cards, tables, forms, sidebar)
│   ├── .env.example, README.md
│
├── docs/                          ARCHITECTURE.md, FOLDER_STRUCTURE.md, PROJECT_REPORT.md
└── README.md                      root quick-start for all three apps
```
