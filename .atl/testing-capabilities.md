## Testing Capabilities

**Strict TDD Mode**: enabled
**Detected**: 2026-07-30

### Test Runner

- Command: `pnpm test` (watch) / `pnpm test:run` (single)
- Framework: Vitest 4.1.10

### Test Layers

| Layer       | Available | Tool                              |
| ----------- | --------- | --------------------------------- |
| Unit        | ✅        | Vitest                            |
| Integration | ✅        | @testing-library/react 16.3.2    |
| E2E         | ❌        | — (no Playwright/Cypress/Selenium)|

### Coverage

- Available: ✅
- Command: `pnpm test:coverage`
- Reporters: text, json, html
- Includes: `src/**/*.{ts,tsx}`
- Excludes: `src/test/**`, `**/*.d.ts`

### Quality Tools

| Tool         | Available | Command        |
| ------------ | --------- | -------------- |
| Linter       | ✅        | `pnpm lint`    |
| Type checker | ✅        | `pnpm typecheck` (tsc -b) |
| Formatter    | ❌        | — (no Prettier detected) |

### Test Setup

- Setup file: `src/test/setup.ts`
- Import: `@testing-library/jest-dom/vitest`
- DOM environment: jsdom
- Globals: true (describe, it, expect available without import)
