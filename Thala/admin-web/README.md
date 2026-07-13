# Thala Admin (Web Dashboard)

React + TypeScript + Vite admin panel for the Thala Sports & Fitness Tracking platform. Consumes the
same backend API as the mobile app (`/backend`), scoped to the `admin` role.

## Quick start

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev             # http://localhost:5173
```

Login with the seeded admin account: `admin@thala.app` / `Admin@1234`.

## Pages

Dashboard (platform stats + active-user trend) - Users (search, paginate, remove) - Workouts
(create/delete routines) - Sports (create/delete + tips/injury prevention) - Diet Plans (generated
plans overview) - Achievements (badge definitions CRUD) - Analytics (users by goal, sessions by
activity type) - Reports (most active users) - Notifications (broadcast push to all users).

## Stack

React 19, React Router, React Query, Axios, Recharts. Plain CSS design system in
`src/styles/global.css` (cards, sidebar, tables, forms) - no UI framework dependency.

## Scripts

- `npm run dev` - Vite dev server
- `npm run build` - `tsc -b && vite build` (verified zero type errors)
- `npm run preview` - serve the production build locally
