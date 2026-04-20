# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dujiao-Next User Web — customer-facing Vue 3 storefront (products, checkout, payment, member center). Pairs with a separate backend exposing `/api/v1/*`. Online: https://dujiao-next.com.

## Commands

```bash
npm install         # install deps
npm run dev         # vite dev server on 0.0.0.0:5173 (strictPort)
npm run build       # vue-tsc -b && vite build — type-check then bundle
npm run preview     # serve built dist/
```

No test runner, linter, or formatter is configured. Type errors from `vue-tsc` during `npm run build` are the only automated gate — run it before declaring work done. Production builds drop `console.*` and `debugger` via esbuild.

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:8080` — start the backend there for local development. Override backend origin via `VITE_API_BASE_URL` in `.env.local` (the code prefixes `/api/v1` automatically).

Deployment: `Dockerfile` builds the app and serves `dist/` through nginx (`nginx.conf` adds SPA fallback `try_files … /index.html` and long-cache for `/assets/`). CI (`.github/workflows/vite-release.yml`) builds and attaches `dist.zip` to GitHub releases on `v*` tags.

## Architecture

### HTTP layer (`src/api/`)

- `client.ts` exports **two** fetch-based clients from one factory: `api` (anonymous) and `userApi` (injects `Authorization: Bearer <user_token>` from `localStorage`). Always import the matching one — guest-order endpoints use `userApi` even without login because they share the interceptor stack.
- Every request auto-adds `X-Lang` from the vue-i18n locale and unwraps the backend envelope `{ status_code, msg, data, pagination? }`. Non-zero `status_code` or non-2xx HTTP both reject; a 401 on a non-auth endpoint clears `user_token`/`user_profile` and hard-redirects to `/auth/login`. Pass `silentBusinessError: true` to suppress the `console.error` (used for polling endpoints like `payments/latest`).
- Domain modules (`auth.ts`, `order.ts`, `product.ts`, `user.ts`, `wallet.ts`, `affiliate.ts`, `credential.ts`) export named API objects. `index.ts` re-exports them — import domain APIs from `@/api` (relative path), not the submodule.

### State (`src/stores/`, Pinia setup-style)

- `app` — global config (`configAPI.get()`), current locale, server-time offset (used to display countdowns/time without clock skew), reactive SEO via `@unhead/vue` `useHead`, and custom script injection. `loadConfig` runs once from the router `beforeEach` guard — don't call it from views.
- `userAuth` — token + profile persisted to `localStorage` (`user_token`, `user_profile`); `isAuthenticated` drives route guards.
- `cart`, `buyNow` — cart items and "buy now" single-item flow kept separate so Checkout can consume either source. SKU identity is `${productId}:${skuId|0}` — use `cartIdentity()` when merging.
- `telegramMiniApp` — detects Telegram WebApp context, runs miniapp login, and syncs the native back button with router navigation. `main.ts` awaits `init()` before mounting so the app boots in the correct auth state inside Telegram.
- `userProfile` — member profile, login history, security forms.

### Router (`src/router/index.ts`)

- All non-landing routes are lazy (`() => import(...)`). After first paint, `warmupCommonRoutes()` prefetches the hot set (products, detail, cart, checkout, payment, blog, notice, login) using `requestIdleCallback`, skipping `saveData` and 2G connections.
- `/products` and `/categories/:slug` conditionally render `Home.vue` instead of `Products.vue` when `appStore.config.template_mode === 'list'` — the home view doubles as a long-scroll list template. Preserve this switch when editing either view.
- Route meta drives auth: `requiresUserAuth` redirects to `/auth/login?redirect=<encoded>`; `userGuest` bounces logged-in users to `/me/orders`.
- `afterEach` re-applies SEO, logs a contact notice once to the console, and informs the Telegram miniapp store so the native back button matches the stack.

### i18n (`src/i18n/index.ts`)

Single giant file with three locales: `zh-CN`, `zh-TW`, `en-US`. `detectLocale()` reads `localStorage.locale`, then falls back to `navigator.language` (zh-TW/HK/Hant → `zh-TW`, else `zh-CN`). Fallback is `zh-CN`. The backend receives the selected locale via `X-Lang`; when adding backend-translated fields (product/post/banner), translate in the **backend** — the frontend just displays whatever `X-Lang` returned.

### Styling / theming

- Tailwind v4 with `darkMode: 'class'`. Theme is toggled by adding/removing `dark` on `<html>`; persisted under `localStorage.dujiao_theme` (`src/utils/theme.ts`), initial value follows system preference.
- Reusable semantic classes (`theme-page`, `theme-card`, etc.) live in `src/style.css` — prefer them over raw color utilities so dark mode stays consistent.
- `@tailwindcss/typography` renders server-sent HTML (blog/legal) — always pipe that HTML through `DOMPurify` (see `utils/content.ts`) before `v-html`.

### SEO

`app.ts` calls `useHead` reactively from `config.seo[locale]` and Open Graph / Twitter Card tags mirror the same fields. Per-view overrides should use `useHead` locally rather than mutating `document.head`. SEO fidelity is a first-class requirement for this storefront — when adding CMS-like entities (products, posts, categories), keep `meta_title`, `meta_description`, `meta_keywords` reachable per locale and guard against undefined keys in templates (missing translations are a real failure mode).

## Conventions

- Aliases are **not** configured — use relative imports (`../api`, `../stores/app`).
- `tsconfig.app.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` — dead imports/params will break `npm run build`.
- Vue SFCs use `<script setup lang="ts">` throughout; Pinia stores use the composition (setup function) form, not options.
- `vite.config.ts` ships a `cfasync-module-script` plugin that injects `data-cfasync="false"` on module scripts — keep that when editing the config (Cloudflare Rocket Loader would otherwise break module loading).
- Manual chunks split `qrcode` and `vue-i18n` out of the main bundle — add further splits in `build.rollupOptions.output.manualChunks` rather than dynamic-importing those libs.

## Gotchas

- Guest checkout uses an **email + order password** credential pair stored locally; `guest/payments/latest` and `guest/orders/:no` are the only way for anonymous users to resume a flow — don't assume auth state when touching order views.
- Server time: prefer `appStore.getServerTime()` / `getServerDate()` over `Date.now()` for anything the backend also computes (countdowns, pay-before deadlines).
- Auth 401 handler does `window.location.href = '/auth/login'` (full reload). If you add a new auth-ish endpoint that should *not* trigger that redirect, extend `isAuthEndpoint` in `api/client.ts`.
- The `userApi` 401 redirect and the `telegramMiniApp` init both run before mount — bugs in either will look like "blank page on load".
