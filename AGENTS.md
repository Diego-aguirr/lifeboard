# AGENTS.md — LifeBoard

> Guía para desarrolladores y agentes IA que trabajan en este proyecto.

---

## Proyecto

**LifeBoard** — App web personal para administrar proyectos, hábitos, estudio, objetivos y conocimiento. Mezcla de Trello + Notion + Duolingo, enfocada en una sola persona.

- **Stack**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4
- **Package manager**: pnpm
- **Arquitectura**: Feature-based (`src/app/`, `src/features/`, `src/shared/`, `src/layouts/`)
- **Persistencia**: LocalStorage (sin backend)
- **Tests**: Vitest + Testing Library

---

## Convenciones de Código

### TypeScript

- **Siempre tipar** — no usar `any`. Si no sabés el tipo, definí una interfaz.
- **Interfaces > Type aliases** para objetos que se extienden.
- **Exportar tipos** desde `types/` dentro de cada feature.
- **No usar `enum`** — preferir uniones de strings literales: `type Priority = 'low' | 'medium' | 'high'`.

### React

- **Functional components** — nada de class components.
- **Un componente por archivo** — el archivo se llama igual que el componente.
- **Props interfaces** — definir `ComponentProps` o `Props` exportada.
- **No mutar props** — siempre crear nuevo objeto/array.
- **Hooks en archivos separados** — `useSomething.ts` en la carpeta `hooks/`.
- **No usar `index.ts` barrel exports** — importar directamente del archivo.

### Estructura de carpetas

```
src/
├── app/              ← Config global: routes, providers, main layout
├── features/         ← Cada feature es independiente
│   └── board/
│       ├── components/   ← Componentes de UI
│       ├── hooks/        ← Custom hooks
│       ├── types/        ← Interfaces y tipos
│       ├── utils/        ← Funciones puras
│       └── index.ts      ← Solo exports públicos de la feature
├── shared/           ← Componentes y utils reutilizables
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── storage/      ← StorageService (abstracción LocalStorage)
├── layouts/          ← Layouts de página
└── styles/           ← CSS global
```

### Naming

- **Componentes**: `PascalCase` — `BoardCard.tsx`, `ColumnHeader.tsx`
- **Hooks**: `camelCase` con prefijo `use` — `useBoard.ts`, `useCards.ts`
- **Utils**: `camelCase` — `formatDate.ts`, `generateId.ts`
- **Tipos**: `PascalCase` — `Board`, `Column`, `Card`
- **Archivos de test**: `nombre.test.ts` junto al archivo testeado

### Estilos

- **Tailwind CSS v4** — utility-first, sin CSS modules.
- **No usar `@apply`** — preferir clases directamente en JSX.
- **Colores via CSS variables** — definir en `globals.css` con `@theme inline`.
- **Dark mode** — usar la clase `dark` en `<html>`, Tailwind lo resuelve.

---

## Protección de Datos

### REGLAS CRÍTICAS — NUNCA hacer

```markdown
❌ NO subir API keys, tokens, o credenciales al repo
❌ NO hardcodear strings sensibles en código
❌ NO exponer variables de entorno en frontend (son visibles en el bundle)
❌ NO guardar datos sensibles en LocalStorage (es accesible por JS)
❌ NO usar console.log con datos personales en producción
```

### Lo que SÍ hacer

```markdown
✅ Usar .env para variables de entorno (ya en .gitignore)
✅ Prefijar env vars con VITE_ para que Vite las exponga al frontend
✅ Solo exponer datos no sensibles al frontend (URLs públicas, feature flags)
✅ Validar y sanitizar toda entrada de usuario con Zod
✅ Usar StorageService para persistir — nunca localStorage directo
✅ Limpiar datos sensibles al hacer logout o reset
```

### .env.example

```bash
# Variables de entorno (copiar a .env y completar)
VITE_APP_TITLE=LifeBoard
VITE_APP_VERSION=0.1.0

# NO agregar API keys acá — el frontend no tiene secrets
```

### Datos en LocalStorage

LocalStorage es **accesible por cualquier JS que corra en la página**. Por eso:

- Solo guardar datos de usuario que NO sean sensibles (tableros, tarjetas, notas).
- NUNCA guardar: contraseñas, tokens, datos de pago, información médica.
- El `StorageService` valida con Zod al cargar — si está corrupto, resetea.

---

## Gentle AI — Convenciones de Agente

### Roles del agente

| Agente | Rol | Puede editar |
|--------|-----|--------------|
| `gentle-orchestrator` | Coordina fases SDD, delega trabajo | Solo archivos de configuración |
| `sdd-explore` | Investiga el codebase | Solo lectura |
| `sdd-propose` | Crea propuestas de cambio | Solo artefactos SDD |
| `sdd-spec` | Escribe especificaciones | Solo artefactos SDD |
| `sdd-design` | Diseño técnico | Solo artefactos SDD |
| `sdd-tasks` | Planifica tareas | Solo artefactos SDD |
| `sdd-apply` | Implementa código | Código del proyecto |
| `sdd-verify` | Valida implementación | Solo lectura |

### Reglas para agentes

1. **Leer skills antes de trabajar** — cada agente carga sus SKILL.md antes de empezar.
2. **No inflar contexto** — delegar en lugar de leer 4+ archivos inline.
3. **Un commit por work-unit** — commits atómicos y reviewables.
4. **Tests antes de merge** — todo código nuevo debe tener tests.
5. **No expone datos** — nunca loggear datos sensibles, nunca hardcodear secrets.

### Flujo SDD

```
/init → /explore → /propose → /spec → /design → /tasks → /apply → /verify → /archive
```

- Cada fase produce artefactos que alimentan la siguiente.
- En modo `interactive`, pausar entre fases para confirmar.
- En modo `auto`, ejecutar todo y mostrar resultado final.

---

## Git y PRs

### Commits

- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- **Un work-unit por commit** — no mezclar features distintas.
- **Descripción clara** en cuerpo del commit (qué y por qué, no cómo).

### PRs

- **Título descriptivo** — qué cambia y por qué.
- **Descripción** con contexto, screenshots si hay UI changes.
- **Tests pasando** antes de abrir PR.
- **Review checklist**:
  - [ ] No hay `console.log` olvidados
  - [ ] No hay `any` types
  - [ ] No hay datos sensibles expuestos
  - [ ] Tests cubren el cambio
  - [ ] TypeScript compila sin errores
  - [ ] No hay warnings nuevos

---

## Scripts útiles

```bash
# Desarrollo
pnpm dev              # Dev server en localhost:5173

# Build
pnpm build            # Build de producción

# Tests
pnpm test             # Vitest en watch mode
pnpm test:run         # Vitest una vez
pnpm test:coverage    # Con coverage

# Type check
pnpm typecheck        # tsc --noEmit
```

---

## Arquitectura — Decisiones Clave

1. **Sin store global al inicio** — `useState` donde corresponde. Context o Zustand solo si hay problema real.
2. **Persistencia abstraída** — `StorageService` puede reemplazarse por IndexedDB o backend sin cambiar lógica.
3. **Guardado con debounce** — 500ms o al salir de la página, no en cada keystroke.
4. **Validación con Zod al cargar** — datos corruptos → reset con defaults.
5. **Tests desde Fase 2** — Vitest + Testing Library. TDD cuando sea posible.
6. **Accesibilidad** — ARIA labels en DnD, focus management en modales, navegación por teclado.

---

## Emergencia

Si el proyecto está roto:

```bash
# Resetear node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar que compila
pnpm typecheck

# Verificar que tests pasan
pnpm test:run
```

Si `opencode.json` está roto y no arranca:
```bash
OPENCODE_DISABLE_PROJECT_CONFIG=1 opencode
# Editar el config, guardar, reiniciar sin el flag
```
