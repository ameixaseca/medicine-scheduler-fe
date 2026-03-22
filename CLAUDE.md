# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A web application (PWA) for caregivers to manage medication schedules for multiple patients. The caregiver
registers patients and their medications, defines administration schedules, and receives reminders when it's
time to administer a dose.

Primary user: A caregiver or family member managing medications for multiple patients. Target platform:
Web (PWA — installable on mobile, works in browser). Future extensibility: Additional platforms (native
mobile, desktop) can be added by consuming the same API.

React PWA with a Service Worker that receives push notifications even when the tab is closed. When the app
is open, it plays an audio alarm via the Web Audio API and shows a visual alert (based on the user's
NotificationPreference).

## Commands

```bash
npm run dev       # Start dev server (proxies API to http://localhost:5104)
npm run build     # Type-check (tsc -b) then build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

**Testing:** Vitest and @testing-library/react are installed but no test script is configured. Run tests with `npx vitest` or `npx vitest run`. Test setup is in `src/test-setup.ts`, environment is jsdom.

## Architecture

A React 19 + TypeScript PWA for managing medication schedules. Deployed on Vercel with SPA routing via `vercel.json`.

### Key Layers

**`src/api/`** — Axios-based API layer. `axios.ts` configures the shared instance: tokens stored in memory (not localStorage), a 401 interceptor that queues concurrent requests and retries them after a silent token refresh.

**`src/context/AuthContext.tsx`** — Global auth state. Calls `/auth/refresh` on mount for silent session restoration. Consumed via `src/hooks/useAuth.ts`.

**`src/offline/queue.ts`** — IndexedDB queue (`medicine-scheduler` db) for confirm/skip actions taken while offline. Retries on reconnect with a 3-attempt limit.

**`src/alarm/alarm.ts`** — Polls every 30 seconds for medications due within 1 minute. Falls back to Web Audio API alarms when push notifications are disabled. Also manages Web Push subscriptions (VAPID key from `VITE_VAPID_PUBLIC_KEY` env var).

**`src/service-worker.ts`** — Workbox precaching + push event handling. Built with a separate TypeScript config (`tsconfig.sw.json`) targeting `WebWorker` libs.

### Routing

Protected routes are wrapped by `src/components/PrivateRoute.tsx` which checks auth context. Public routes: `/login`, `/register`. Protected: `/`, `/patients`, `/patients/:id`, `/medications/*`, `/settings`.

### Dev Proxy

`vite.config.ts` proxies these paths to `http://localhost:5104`: `/auth`, `/patients`, `/medications`, `/schedule`, `/push`, `/settings`.

### TypeScript Config

Three `tsconfig` targets: `tsconfig.app.json` (app, strict, ES2023), `tsconfig.sw.json` (service worker, WebWorker libs), `tsconfig.node.json` (Vite config/tooling). All referenced from `tsconfig.json`.
