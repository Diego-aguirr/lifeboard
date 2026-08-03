# AGENTS.md — LifeBoard

> Guía para desarrolladores y agentes IA que trabajan en este proyecto.

---

## Proyecto

**LifeBoard** — App web personal para administrar proyectos, hábitos, estudio, objetivos y conocimiento. Mezcla de Trello + Notion + Duolingo, enfocada en una sola persona. Incluye chatbot con IA para crear tableros desde lenguaje natural.

- **Stack**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Node.js/Express + SQLite
- **Package manager**: pnpm (monorepo)
- **Arquitectura**: Feature-based (frontend) + Clean Architecture (backend)
- **Persistencia**: SQLite con WAL mode (backend) + localStorage como backup (frontend)
- **AI**: Groq + llama-3.3 (gratis, rápido)
- **Tests**: Vitest + Testing Library

---

## Estructura del Proyecto

```
lifeboard/
├── frontend/                    ← React app
│   ├── src/
│   │   ├── app/                 ← Routes, App.tsx
│   │   ├── features/
│   │   │   ├── ai/              ← Chatbot con IA
│   │   │   ├── board/           ← Feature principal (Kanban)
│   │   │   ├── dashboard/       ← Lista de tableros
│   │   │   ├── pomodoro/        ← Temporizador
│   │   │   └── stats/           ← Estadísticas
│   │   ├── layouts/             ← MainLayout
│   │   ├── shared/              ← Componentes reutilizables
│   │   └── lib/                 ← Utilidades
│   └── package.json
│
├── backend/                     ← API REST
│   ├── src/
│   │   ├── config/              ← Configuración y BD
│   │   ├── controllers/         ← Manejo de requests
│   │   ├── middleware/          ← sanitize, validate, errorHandler
│   │   ├── repositories/       ← Acceso a SQLite
│   │   ├── routes/             ← /api/v1/boards, /api/v1/ai
│   │   ├── services/           ← Lógica de negocio
│   │   ├── utils/              ← AppError, logger
│   │   └── validators/         ← Schemas Zod
│   ├── .env.example
│   └── package.json
│
├── package.json                 ← Scripts globales
├── README.md                    ← Documentación completa
├── NODE_ARCHITECTURE.md         ← Arquitectura Node.js
└── .gitignore
```

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

### Backend (Node.js/Express)

- **Clean Architecture**: Controller → Service → Repository
- **Validación con Zod** en controllers antes de procesar
- **Error handling** con AppError y errorHandler middleware
- **Sanitización** de todo input con sanitize middleware
- **Request ID** para tracking y debugging

### Naming

- **Componentes**: `PascalCase` — `BoardCard.tsx`, `ColumnHeader.tsx`
- **Hooks**: `camelCase` con prefijo `use` — `useBoard.ts`, `useCards.ts`
- **Utils**: `camelCase` — `formatDate.ts`, `generateId.ts`
- **Tipos**: `PascalCase` — `Board`, `Column`, `Card`
- **Archivos de test**: `nombre.test.ts` junto al archivo testeado
- **Backend**: `nombre.controller.js`, `nombre.service.js`, `nombre.repository.js`

### Estilos

- **Tailwind CSS v4** — utility-first, sin CSS modules.
- **No usar `@apply`** — preferir clases directamente en JSX.
- **Colores via CSS variables** — definir en `globals.css` con `@theme inline`.
- **Dark mode** — usar la clase `dark` en `<html>`, Tailwind lo resuelve.

---

## Seguridad y Protección

### REGLAS CRÍTICAS — NUNCA hacer

```markdown
❌ NO subir API keys, tokens, o credenciales al repo
❌ NO hardcodear strings sensibles en código
❌ NO exponer variables de entorno en frontend (son visibles en el bundle)
❌ NO guardar datos sensibles en LocalStorage (es accesible por JS)
❌ NO usar console.log con datos personales en producción
❌ NO commitear la base de datos (*.db)
```

### Lo que SÍ hacer

```markdown
✅ Usar .env para variables de entorno (ya en .gitignore)
✅ Prefijar env vars con VITE_ para que Vite las exponga al frontend
✅ Solo exponer datos no sensibles al frontend (URLs públicas, feature flags)
✅ Validar y sanitizar toda entrada de usuario con Zod
✅ Usar StorageService para persistir — nunca localStorage directo
✅ Limpiar datos sensibles al hacer logout o reset
✅ Sanitizar input del chatbot contra XSS e inyección
✅ Nunca mostrar JSON/código al usuario en el chat
```

### Middleware de Seguridad (Backend)

| Middleware | Propósito |
|------------|-----------|
| `helmet` | Headers HTTP seguros |
| `cors` | Controlar orígenes permitidos |
| `rateLimit` | Prevenir abuso/DDoS |
| `sanitize` | Limpiar input (XSS, SQL injection) |
| `validate` | Validar con Zod schemas |
| `requestId` | Tracking de requests |

### Chatbot Protección

- **Topic Validation**: Solo responde sobre tableros/productividad
- **Response Cleaning**: Nunca muestra JSON/código al usuario
- **Input Sanitization**: Limpia intentos de inyección
- **Rate Limiting**: 10 requests/hora para IA

---

## Variables de Entorno

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3001/api/v1
```

### Backend (.env)

```bash
PORT=3001
NODE_ENV=development
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
DATABASE_URL=./lifeboard.db
GROQ_API_KEY=tu-api-key-de-groq
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

---

## Scripts Útiles

```bash
# Desarrollo (frontend + backend)
pnpm dev

# Por separado
pnpm dev:frontend    # http://localhost:5173
pnpm dev:backend     # http://localhost:3001

# Install
pnpm install:all

# Tests
pnpm --filter lifeboard-frontend test
pnpm --filter lifeboard-frontend test:run
pnpm --filter lifeboard-backend test

# Type check
pnpm --filter lifeboard-frontend typecheck

# Build
pnpm --filter lifeboard-frontend build
```

---

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Status del servidor |
| GET | `/boards` | Listar tableros |
| GET | `/boards/:id` | Obtener tablero |
| POST | `/boards` | Crear tablero |
| PUT | `/boards/:id` | Actualizar tablero |
| DELETE | `/boards/:id` | Eliminar tablero |
| POST | `/ai/chat` | Chat con IA |
| POST | `/ai/generate-board` | Generar tablero con IA |

---

## Arquitectura — Decisiones Clave

1. **Monorepo con pnpm** — frontend y backend juntos, scripts compartidos
2. **Feature-based (frontend)** — código por features, no por capas
3. **Clean Architecture (backend)** — Controller → Service → Repository
4. **SQLite WAL** — performance para apps personales
5. **AI con Groq** — gratis, rápido, OpenAI-compatible
6. **Validación Zod** — frontend y backend
7. **Sanitización** — protección contra XSS e inyección
8. **Chatbot seguro** — solo tableros, nunca muestra código

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
6. **Sanitizar input** — siempre validar y limpiar datos de usuario.
7. **Chatbot seguro** — nunca mostrar JSON/código al usuario.

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
  - [ ] Input sanitizado correctamente
  - [ ] Chatbot no muestra código/JSON

---

## Emergencia

Si el proyecto está roto:

```bash
# Resetear node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install:all

# Verificar que compila
pnpm --filter lifeboard-frontend typecheck

# Verificar que tests pasan
pnpm --filter lifeboard-frontend test:run
pnpm --filter lifeboard-backend test

# Resetear base de datos
rm -f backend/lifeboard.db backend/lifeboard.db-wal backend/lifeboard.db-shm
# Se recreará automáticamente al iniciar el backend
```

Si `opencode.json` está roto y no arranca:
```bash
OPENCODE_DISABLE_PROJECT_CONFIG=1 opencode
# Editar el config, guardar, reiniciar sin el flag
```
