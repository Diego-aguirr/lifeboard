# Tasks: Phase 1 — Project Foundation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600–800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (setup+components) → PR 2 (layout+routes+pages) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Tailwind setup + path aliases + shared components + tests | PR 1 | base: main; config + 4 atomic components |
| 2 | Folder structure + layout + routing + page shells + tests | PR 2 | base: main (or stacked to PR 1); depends on PR 1 |

## Phase 1: Infrastructure & Config

- [ ] 1.1 Install `tailwindcss`, `@tailwindcss/vite`, `react-router` via pnpm
- [ ] 1.2 Modify `vite.config.ts` — add `@tailwindcss/vite` plugin + `resolve.alias` for `@/`
- [ ] 1.3 Modify `tsconfig.app.json` — add `baseUrl: "."` + `paths: {"@/*": ["src/*"]}`
- [ ] 1.4 Modify `index.html` — add `class="dark"` to `<html>` tag
- [ ] 1.5 Create `src/styles/globals.css` — Tailwind directives + `@theme inline` CSS vars + dark mode tokens
- [ ] 1.6 Delete `src/index.css` and `src/App.css`

## Phase 2: Shared Atomic Components

- [ ] 2.1 Create `src/shared/components/Button/Button.tsx` — Button with `variant` (primary/secondary/ghost/danger), `size` (sm/md/lg), children, disabled, onClick. Tailwind utility classes only.
- [ ] 2.2 Create `src/shared/components/Input/Input.tsx` — Input with label, error state, standard input attrs. Error shows text + red border.
- [ ] 2.3 Create `src/shared/components/Badge/Badge.tsx` — Badge with variant (default/success/warning/danger/info), inline pill.
- [ ] 2.4 Create `src/shared/components/Skeleton/Skeleton.tsx` — Animated pulse placeholder, respects `prefers-reduced-motion`.

## Phase 3: Tests — Shared Components

- [ ] 3.1 Create `src/shared/components/Button/Button.test.tsx` — Test: renders variant colors, size dimensions, disabled state, onClick fires.
- [ ] 3.2 Create `src/shared/components/Input/Input.test.tsx` — Test: error text visible, label click focuses input.
- [ ] 3.3 Create `src/shared/components/Badge/Badge.test.tsx` — Test: variant renders correct color class.
- [ ] 3.4 Create `src/shared/components/Skeleton/Skeleton.test.tsx` — Test: pulse animation present, respects reduced-motion.

## Phase 4: Folder Structure & Entry Points

- [ ] 4.1 Create `src/app/` directory structure
- [ ] 4.2 Create `src/app/main.tsx` — imports globals.css, renders `<App />` in StrictMode
- [ ] 4.3 Create `src/app/App.tsx` — `RouterProvider` with router from routes.tsx
- [ ] 4.4 Create `src/app/routes.tsx` — `createBrowserRouter` with `/` and `/board/:boardId` routes inside MainLayout
- [ ] 4.5 Create empty feature dirs: `src/features/dashboard/`, `src/features/board/` with subdirs (components/, hooks/, types/, utils/)

## Phase 5: Layout System

- [ ] 5.1 Create `src/layouts/MainLayout/Header.tsx` — Fixed top header with app title
- [ ] 5.2 Create `src/layouts/MainLayout/Sidebar.tsx` — Collapsible sidebar with toggle button (keyboard accessible)
- [ ] 5.3 Create `src/layouts/MainLayout/MainLayout.tsx` — Flex layout composing Header + Sidebar + scrollable Main area, passes children

## Phase 6: Page Shells

- [ ] 6.1 Create `src/features/dashboard/index.tsx` — Dashboard page: "Mis Tableros" placeholder heading
- [ ] 6.2 Create `src/features/board/index.tsx` — Board page: empty board shell placeholder, reads `boardId` from route params

## Phase 7: Integration Tests & Verification

- [ ] 7.1 Test: `pnpm dev` starts without errors, Tailwind classes render
- [ ] 7.2 Test: `@/` imports resolve (import Button from `@/shared/components/Button/Button`)
- [ ] 7.3 Test: Router renders Dashboard at `/` and Board at `/board/:id`
- [ ] 7.4 Test: `pnpm build` produces no errors
- [ ] 7.5 Test: `pnpm test:run` passes all tests
