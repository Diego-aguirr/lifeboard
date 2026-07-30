# Phase 1 — Project Foundation Specification

## Domain: Project Setup

### Requirement: Tailwind CSS v4 Configuration

SHALL use Tailwind CSS v4 via `@tailwindcss/vite` plugin. CSS variables SHALL use `@theme inline` in `globals.css`. Dark mode SHALL use `dark` class on `<html>`.

#### Scenario: Tailwind styles render

- GIVEN `pnpm dev` is running
- WHEN a component uses a Tailwind class
- THEN the style applies correctly

#### Scenario: Dark mode activates

- GIVEN `<html>` has class `dark`
- WHEN components use `dark:` variants
- THEN dark styles apply; removing `dark` reverts to light

### Requirement: Path Aliases

SHALL resolve `@/` imports to `src/`. Configuration MUST exist in `tsconfig.app.json` and `vite.config.ts`.

#### Scenario: Alias resolves at runtime

- GIVEN a file at `src/shared/components/Button/Button.tsx`
- WHEN imported as `@/shared/components/Button/Button`
- THEN TypeScript compiles and Vite resolves correctly

## Domain: Folder Architecture

### Requirement: Feature-Based Directory Structure

SHALL organize code under `src/` with: `app/`, `features/`, `shared/`, `layouts/`, `styles/`. Each feature SHALL contain `components/`, `hooks/`, `types/`, `utils/`. Barrel `index.ts` SHALL NOT be used.

#### Scenario: Directories exist

- GIVEN project is scaffolded
- WHEN inspecting `src/`
- THEN all five top-level directories exist

#### Scenario: Feature subdirs exist

- GIVEN `src/features/board/`
- WHEN inspected
- THEN `components/`, `hooks/`, `types/`, `utils/` exist

## Domain: Shared Components

### Requirement: Button

SHALL provide Button at `src/shared/components/Button/Button.tsx`. Props: `variant` (`'primary' | 'secondary' | 'ghost' | 'danger'`), `size` (`'sm' | 'md' | 'lg'`), `children`, `disabled`, `onClick`. Styling MUST use Tailwind utilities.

#### Scenario: Variant renders correct colors

- GIVEN Button with `variant="primary"`
- WHEN rendered
- THEN primary color styling applies

#### Scenario: Size affects dimensions

- GIVEN Button with `size="sm"`
- WHEN rendered
- THEN padding and font are smaller than `size="md"`

### Requirement: Input

SHALL provide Input at `src/shared/components/Input/Input.tsx`. Props: `label`, `error` (optional), `value`, `onChange`, plus standard `<input>` attributes. Error state MUST show error text and error border.

#### Scenario: Error displays

- GIVEN Input with `error="Required"`
- WHEN rendered
- THEN error text visible, border error-colored

#### Scenario: Label focuses input

- GIVEN Input with `label="Email"`
- WHEN label clicked
- THEN input receives focus

### Requirement: Badge

SHALL provide Badge at `src/shared/components/Badge/Badge.tsx`. Props: `variant` (`'default' | 'success' | 'warning' | 'error'`), `children`. Renders as inline pill.

#### Scenario: Variant shows correct color

- GIVEN Badge with `variant="success"`
- WHEN rendered
- THEN success color background and text display

### Requirement: Skeleton

SHALL provide Skeleton at `src/shared/components/Skeleton/Skeleton.tsx`. Props: `className` (optional). Renders animated pulse placeholder. MUST respect `prefers-reduced-motion`.

#### Scenario: Animates by default

- GIVEN Skeleton rendered
- WHEN viewed
- THEN pulse animation plays

#### Scenario: Respects reduced motion

- GIVEN OS has `prefers-reduced-motion: reduce`
- WHEN Skeleton renders
- THEN animation disabled

## Domain: Layout System

### Requirement: MainLayout

SHALL provide MainLayout at `src/layouts/MainLayout/MainLayout.tsx`. Layout: fixed Header top, Sidebar left (collapsible), scrollable Main area. Props: `children`. Toggle MUST be keyboard accessible.

#### Scenario: Three zones render

- GIVEN MainLayout wraps content
- WHEN rendered
- THEN Header, Sidebar, and Main visible

#### Scenario: Sidebar collapses

- GIVEN sidebar expanded
- WHEN toggle activated
- THEN sidebar collapses, Main expands

## Domain: Routing

### Requirement: React Router v7 Setup

SHALL use React Router v7 with `createBrowserRouter`. Routes: `/` (Dashboard), `/board/:boardId` (Board). Both render inside MainLayout.

#### Scenario: Dashboard at root

- GIVEN user navigates to `/`
- WHEN page loads
- THEN Dashboard shell renders in MainLayout

#### Scenario: Board with param

- GIVEN user navigates to `/board/abc123`
- WHEN page loads
- THEN Board shell renders with `boardId = "abc123"`

#### Scenario: Unknown route fallback

- GIVEN user navigates to `/nonexistent`
- WHEN page loads
- THEN 404 or redirect to `/`
