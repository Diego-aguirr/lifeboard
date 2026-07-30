# Proposal: Phase 1 — Project Foundation

## Intent

LifeBoard has a bare Vite + React 19 scaffold with no Tailwind, no folder structure, no components, and no routing. Phase 1 establishes the complete project foundation: styling system, architecture scaffolding, shared atomic components, layouts, routing, and empty page shells. Without this, no feature work can begin.

## Scope

### In Scope
- Install and configure Tailwind CSS v4 with dark mode support from day 1
- Configure `@/` path aliases in tsconfig + vite
- Create feature-based folder structure: `app/`, `features/`, `shared/`, `layouts/`
- Build shared atomic components: Button, Input, Badge, Skeleton (Tailwind utility-first, no @apply)
- Create MainLayout with Header + Sidebar + Main content area
- Setup React Router v7 with `/` (Dashboard) and `/board/:boardId` (Board) routes
- Create empty Dashboard and Board page shells

### Out of Scope
- Prettier setup (decision: DISABLED — no lint script)
- ESLint configuration (decision: DISABLED — simplified config)
- Any feature logic (boards, columns, cards)
- State management beyond local component state
- Persistence layer (StorageService)
- Testing beyond verifying setup works

## Capabilities

### New Capabilities
- `project-setup`: Vite + TypeScript + Tailwind v4 configuration, path aliases, dark mode CSS variables
- `folder-architecture`: Feature-based directory structure with clear boundaries
- `shared-components`: Atomic reusable UI components (Button, Input, Badge, Skeleton)
- `layout-system`: MainLayout with Header, Sidebar, Main content area
- `routing`: React Router v7 setup with Dashboard and Board routes

### Modified Capabilities
None — this is the initial foundation.

## Approach

1. **Tailwind v4 install**: Add `tailwindcss` + `@tailwindcss/vite` plugin. Configure `@theme inline` in `globals.css` with CSS variables for colors. Set up dark mode via `dark:` class on `<html>`.
2. **Path aliases**: Add `@/*` mapping in `tsconfig.app.json` (`baseUrl: "."`, `paths: {"@/*": ["src/*"]}`) and matching `resolve.alias` in `vite.config.ts`.
3. **Folder structure**: Create directories per AGENTS.md conventions. No barrel `index.ts` files.
4. **Atomic components**: Button (variants: primary/secondary/ghost/danger, sizes: sm/md/lg), Input (with label + error state), Badge (color variants), Skeleton (loading placeholder). All Tailwind utility classes, no CSS modules.
5. **Layout**: MainLayout component with flex layout — fixed Header top, collapsible Sidebar left, Main scrollable area. Tailwind for all styling.
6. **Routing**: React Router v7 `createBrowserRouter` with two routes. Dashboard shows "Mis Tableros" placeholder. Board shows empty board shell.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `vite.config.ts` | Modified | Add Tailwind plugin + path alias resolve |
| `tsconfig.app.json` | Modified | Add `baseUrl` + `paths` for `@/` alias |
| `src/styles/globals.css` | New | Tailwind directives + CSS variables + dark mode theme |
| `src/index.css` | Removed | Replaced by globals.css |
| `src/app/` | New | App.tsx, main.tsx, routes.tsx |
| `src/shared/components/` | New | Button/, Input/, Badge/, Skeleton/ |
| `src/layouts/` | New | MainLayout/ |
| `src/features/board/` | New | Empty placeholder |
| `src/features/dashboard/` | New | Empty placeholder |
| `index.html` | Modified | Add `dark` class to `<html>` for dark mode |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind v4 breaking changes from v3 docs | Medium | Use official v4 docs, `@tailwindcss/vite` plugin (not PostCSS) |
| Path alias not resolving at runtime | Low | Verify with a simple import test after config |
| Dark mode flash on load | Low | Add `dark` class to `<html>` in index.html statically |
| Over-engineering shared components too early | Medium | Keep components minimal — just enough for Phase 1 layout |

## Rollback Plan

1. Remove Tailwind: uninstall packages, delete `globals.css`, restore `index.css`
2. Remove path aliases: revert `tsconfig.app.json` and `vite.config.ts` changes
3. Remove folder structure: delete created directories, restore flat `src/` layout
4. Remove routing: uninstall `react-router`, restore single-page `App.tsx`
5. All changes are additive — no existing functionality to break

## Dependencies

- `tailwindcss` + `@tailwindcss/vite` (new)
- `react-router` v7 (new)
- No backend or external services required

## Success Criteria

- [ ] `pnpm dev` starts without errors, Tailwind styles render
- [ ] `@/` imports resolve correctly (e.g., `import { Button } from '@/shared/components/Button/Button'`)
- [ ] Dark mode toggles correctly via `dark` class on `<html>`
- [ ] Dashboard page renders at `/`
- [ ] Board page renders at `/board/:boardId`
- [ ] Shared components (Button, Input, Badge, Skeleton) render with correct Tailwind styles
- [ ] `pnpm build` produces no errors
- [ ] `pnpm test:run` passes (existing tests + any new smoke tests)
