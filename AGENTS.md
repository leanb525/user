# Repository Guidelines

## Project Structure & Module Organization

This repository is the Dujiao-Next customer-facing web frontend. Runtime code lives in `src/`, with `main.ts` bootstrapping Vue, Pinia, router, i18n, and global styles. Use `src/views/` for route-level pages, `src/components/` for reusable UI, `src/stores/` for Pinia state, `src/api/` for backend domain clients, `src/composables/` for reusable Vue logic, `src/utils/` for shared helpers, and `src/constants/` for stable values. Global styling is in `src/style.css`; Tailwind scans `index.html` and `src/**/*.{vue,js,ts,jsx,tsx}`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package.json` / `package-lock.json`.
- `npm run dev`: start the Vite dev server on port `5173`.
- `npm run build`: run `vue-tsc -b` type checking, then create the production Vite build.
- `npm run preview`: serve the built app locally for release checks.

The dev server proxies `/api` and `/uploads` to the local backend. Set `VITE_API_BASE_URL` in `.env.local` when targeting another backend origin.

## Coding Style & Naming Conventions

Use Vue 3 single-file components with TypeScript. Match the existing style: 4-space indentation in `src/`, single quotes, no semicolons, strict TypeScript, and no unused locals. Name components in PascalCase, route views by page name, composables as `useThing.ts`, and Pinia stores as `useThingStore`. Import API domain objects through `src/api/index.ts` unless a local pattern clearly requires otherwise.

## Testing Guidelines

No dedicated test runner is currently configured. Treat `npm run build` as the required validation before submitting changes. For new tests, prefer colocated `*.spec.ts` or component-focused specs under the relevant `src/` folder, and add the matching npm script in `package.json`.

## Commit & Pull Request Guidelines

History uses short, direct commit subjects, often in Chinese, such as "add navigation" or "modify home UI". Keep subjects concise and imperative, focused on one change. Pull requests should describe the user-visible change, note validation performed, link related issues, and include screenshots or screen recordings for UI work.

## Security & Agent Notes

Do not commit `.env.local` or secrets. Sanitize any HTML rendered with `v-html`; existing helpers use DOMPurify for this path. Agents should use the code-index MCP tools for file discovery and structural analysis, and refresh the index after edits.
