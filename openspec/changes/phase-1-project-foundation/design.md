# Design: Phase 1 — Project Foundation

## Technical Approach

Extend the bare Vite + React 19 scaffold with Tailwind CSS v4 (via `@tailwindcss/vite` plugin), `@/` path aliases, feature-based folder structure, shared atomic components (Button, Input, Badge, Skeleton), a MainLayout with Header/Sidebar/Main, and React Router v7 with two routes. All styling via Tailwind utility classes — no `@apply`, no CSS modules.

## Architecture Decisions

### Decision: Tailwind v4 Integration Method

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `@tailwindcss/vite` plugin | Native Vite integration, no PostCSS config | **Selected** |
| PostCSS plugin | Works but adds config layer | Rejected |

**Rationale**: Tailwind v4 ships a Vite plugin that eliminates `postcss.config.js` and `tailwind.config.js`. Configuration moves to CSS (`@theme inline`), which is simpler for this project's scale.

### Decision: Path Alias Configuration

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `@/*` alias | Standard convention, clear import paths | **Selected** |
| Bare `*` alias | Less explicit, harder to grep | Rejected |
| No alias | Long relative imports | Rejected |

**Rationale**: `@/` is the React ecosystem convention. Requires matching config in `tsconfig.app.json` (`paths`) and `vite.config.ts` (`resolve.alias`).

### Decision: Component Structure Convention

| Option | Tradeoff | Decision |
|--------|----------|----------|
| One file per component, named export | Clean imports, follows AGENTS.md | **Selected** |
| Barrel `index.ts` re-exports | Extra file, import indirection | Rejected (AGENTS.md forbids) |

**Rationale**: AGENTS.md mandates no barrel `index.ts` — import directly from component file.

### Decision: Routing Library

| Option | Tradeoff | Decision |
|--------|----------|----------|
| React Router v7 (createBrowserRouter) | Standard, data router pattern | **Selected** |
| Tanstack Router | Type-safe but steeper learning curve | Rejected |
| Wouter | Minimal but less ecosystem | Rejected |

**Rationale**: Project spec calls for React Router v7. `createBrowserRouter` gives modern API without legacy `<BrowserRouter>`.

## Data Flow

```
index.html (dark class on <html>)
  └─ main.tsx (StrictMode + createRoot)
       └─ App.tsx (RouterProvider)
            └─ routes.tsx (createBrowserRouter)
                 ├─ / → MainLayout → Dashboard page
                 └─ /board/:boardId → MainLayout → Board page
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `vite.config.ts` | Modify | Add `@tailwindcss/vite` plugin + `resolve.alias` for `@/` |
| `tsconfig.app.json` | Modify | Add `baseUrl: "."` + `paths: {"@/*": ["src/*"]}` |
| `index.html` | Modify | Add `class="dark"` to `<html>` tag |
| `src/index.css` | Delete | Replaced by `src/styles/globals.css` |
| `src/App.css` | Delete | No longer needed — Tailwind replaces |
| `src/styles/globals.css` | Create | Tailwind directives + `@theme inline` CSS vars + dark mode |
| `src/app/main.tsx` | Create | Entry point — imports globals.css, renders App |
| `src/app/App.tsx` | Create | `RouterProvider` wrapper |
| `src/app/routes.tsx` | Create | `createBrowserRouter` with Dashboard + Board routes |
| `src/shared/components/Button/Button.tsx` | Create | Button with primary/secondary/ghost/danger variants |
| `src/shared/components/Input/Input.tsx` | Create | Input with label + error state |
| `src/shared/components/Badge/Badge.tsx` | Create | Badge with color variants |
| `src/shared/components/Skeleton/Skeleton.tsx` | Create | Loading placeholder skeleton |
| `src/layouts/MainLayout/MainLayout.tsx` | Create | Header + Sidebar + Main flex layout |
| `src/layouts/MainLayout/Sidebar.tsx` | Create | Sidebar component (re-exported from MainLayout) |
| `src/layouts/MainLayout/Header.tsx` | Create | Header component (re-exported from MainLayout) |
| `src/features/dashboard/index.tsx` | Create | Dashboard page shell ("Mis Tableros" placeholder) |
| `src/features/board/index.tsx` | Create | Board page shell (empty board placeholder) |

## Interfaces / Contracts

```ts
// Button variant types (shared/components/Button)
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

// Input props (shared/components/Input)
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// Badge variant types (shared/components/Badge)
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
}

// Skeleton props
interface SkeletonProps {
  className?: string
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Button renders variants, Input shows error | Render + assert class names |
| Integration | Router renders correct page at `/` and `/board/:id` | Render with RouterProvider, check route |
| E2E | None — Phase 1 is foundation only | — |

## Migration / Rollout

No data migration — this is the initial scaffold. Steps:
1. Install `tailwindcss`, `@tailwindcss/vite`, `react-router` as dependencies
2. Update config files (vite, tsconfig, index.html)
3. Delete old `src/index.css` and `src/App.css`
4. Create folder structure and all new files
5. Verify `pnpm dev` starts, styles render, routes work

## Open Questions

- None — all decisions are clear from the proposal and AGENTS.md conventions.
