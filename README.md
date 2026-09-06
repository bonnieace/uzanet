# Uzanet operator dashboard and captive portal

Vue 3 frontend for the Uzanet ISP control plane. It provides router-scoped administration for plans, Hotspot/PPPoE customers, payments, logs, active sessions, and safe MikroTik onboarding, plus a public captive portal.

## Run locally

```bash
cp .env.example .env
npm ci
npm run dev
```

Set `VITE_API_BASE_URL` to the API origin (for example `http://localhost:8000`) or the complete `/api/v1` base. No operator username, password, router ID, plan price, or provider secret belongs in a Vite environment variable: every `VITE_*` value is public in the browser bundle.

## Portal URLs

Preferred per-router URL:

```text
https://<frontend-host>/portal/<portal-slug>?link-login-only=<router-login-url>&link-orig=<original-url>&mac=<mac>&ip=<ip>
```

The legacy `/login?portal=<portal-slug>` route is retained. `VITE_DEFAULT_PORTAL_SLUG` can provide a single-site fallback during migration.

The portal loads packages and prices from the backend, starts an idempotent payment session, and polls with the returned private status token. It never accepts a router ID or amount from page configuration. Ticket credentials are submitted with an ephemeral POST form and only to private IPs, `.local`/`.lan` names, same-origin URLs, or hosts explicitly listed in `VITE_ALLOWED_HOTSPOT_HOSTS`.

## Deploy

```bash
npm ci
npm run build
```

Publish `dist/`. The committed `_redirects` file enables SPA deep links on Netlify, and `_headers` applies baseline browser security headers. Add every production API origin to the deployed Content Security Policy if it differs from `https://api.uzanet.co.ke`.

Deploy the backend API changes before this frontend. After deployment, verify operator login/logout, router UUID selection, `.rsc` onboarding, plan creation, both subscriber types, both provider callbacks, and captive-login form submission on a real RouterOS 6 and 7 device.
