# LifeBoard — Tu segundo cerebro

> Organizá tus proyectos, hábitos y estudios en un solo lugar.

LifeBoard es una app web personal para administrar todo lo que aprendés y hacés. Como Trello + Notion + Duolingo, pero para una sola persona. Incluye un asistente de IA que te ayuda a crear tableros desde una conversación.

---

## Características

- **Tableros Kanban** — Creá, editá y organizá tableros con columnas y tarjetas
- **Drag & Drop** — Mové tarjetas y columnas con la interfaz de arrastre
- **Chatbot con IA** — Asistente especializado en crear tableros desde lenguaje natural (Groq/llama-3.3)
- **Temporizador Pomodoro** — Técnica de productividad integrada con sonidos
- **Estadísticas** — Gráficos de progreso, prioridad y dificultad (Recharts)
- **Command Palette** — Atajos de teclado para navegación rápida
- **Dark Mode** — Tema oscuro/claro con toggle
- **Validación con Zod** — Entrada de datos segura en frontend y backend
- **Persistencia SQLite** — Base de datos local con better-sqlite3

---

## Stack Tecnológico

### Frontend

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | React | 19.2.7 |
| Language | TypeScript | 6.0.2 |
| Build | Vite | 8.1.1 |
| CSS | Tailwind CSS | v4.3.3 |
| Routing | React Router | 8.3.0 |
| Forms | React Hook Form + Zod | 7.83 / 4.4 |
| DnD | @dnd-kit | 6.3.1 |
| Charts | Recharts | 3.10.1 |
| Animation | Motion | 12.43 |
| Testing | Vitest + Testing Library | 4.1.10 |

### Backend

| Capa | Tecnología | Versión |
|------|------------|---------|
| Runtime | Node.js | LTS |
| Framework | Express | 4.21.2 |
| Database | SQLite (better-sqlite3) | 11.0 |
| Validation | Zod | 3.24.2 |
| Security | Helmet, CORS, Rate Limiting | — |
| Logging | Morgan + Winston | — |
| AI | Groq (llama-3.3) | API |

---

## Estructura del Proyecto

```
lifeboard/
├── frontend/                    ← React app (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── app/                 ← Config: routes, App.tsx
│   │   ├── features/
│   │   │   ├── ai/              ← Chatbot con IA
│   │   │   │   ├── components/  ← ChatBot, ChatPanel, ChatInput, MessageBubble
│   │   │   │   ├── hooks/       ← useChat
│   │   │   │   ├── services/    ← aiService
│   │   │   │   └── utils/       ← topicValidator
│   │   │   ├── board/           ← Feature principal (Kanban)
│   │   │   │   ├── components/  ← BoardHeader, Column, Card, DragDrop
│   │   │   │   ├── context/     ← BoardContext (state management)
│   │   │   │   ├── hooks/       ← useBoard
│   │   │   │   ├── types/       ← Board, Column, Card
│   │   │   │   └── utils/       ← boardStats
│   │   │   ├── dashboard/       ← Lista de tableros
│   │   │   ├── pomodoro/        ← Temporizador Pomodoro
│   │   │   └── stats/           ← Estadísticas y gráficos
│   │   ├── layouts/             ← MainLayout (Header + Sidebar)
│   │   ├── shared/              ← Componentes reutilizables
│   │   │   ├── components/      ← Button, Input, Badge, Modal, Skeleton
│   │   │   ├── hooks/           ← useKeyboardShortcuts, useAchievements
│   │   │   ├── storage/         ← StorageService (abstracción localStorage)
│   │   │   └── validations/     ← Schemas Zod
│   │   └── lib/                 ← Utilidades (cn, theme-provider)
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     ← API REST (Node.js + Express)
│   ├── src/
│   │   ├── config/              ← Configuración y base de datos
│   │   ├── controllers/         ← BoardController, AiController
│   │   ├── middleware/          ← errorHandler, validate, rateLimiter
│   │   ├── repositories/       ← BoardRepository (acceso a SQLite)
│   │   ├── routes/             ← /api/v1/boards, /api/v1/ai
│   │   ├── services/           ← BoardService, AiService
│   │   ├── utils/              ← AppError, asyncHandler, logger
│   │   ├── validators/         ← Schemas Zod para requests
│   │   ├── app.js              ← Express app setup
│   │   └── server.js           ← Server entry point
│   ├── .env.example
│   └── package.json
│
├── package.json                 ← Scripts globales (dev, install:all)
├── README.md
└── .gitignore
```

---

## Primeros Pasos

### Requisitos

- Node.js 18+
- pnpm (package manager)

### Instalación

```bash
# Clonar el repo
git clone <url>
cd lifeboard

# Instalar dependencias de ambos proyectos
pnpm install:all
```

### Configurar Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tu configuración (ver Variables de Entorno)
```

### Ejecutar

```bash
# Desde la raíz — ejecuta frontend y backend juntos
pnpm dev

# O por separado:
pnpm dev:frontend   # http://localhost:5173
pnpm dev:backend    # http://localhost:3001
```

---

## Variables de Entorno

Copiá `backend/.env.example` a `backend/.env` y completá:

```bash
# Servidor
PORT=3001
NODE_ENV=development

# API
API_PREFIX=/api/v1

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutos
RATE_LIMIT_MAX=100             # requests por ventana

# Base de datos
DATABASE_URL=./lifeboard.db

# IA (Groq — gratis y rápido)
GROQ_API_KEY=tu-api-key-de-groq
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### Obtener API Key de Groq

1. Andá a [console.groq.com](https://console.groq.com)
2. Creá una cuenta (gratis)
3. Generá una API key
4. Pegala en `GROQ_API_KEY`

---

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Status del servidor |

### Boards

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/boards` | Listar todos los tableros |
| GET | `/boards/:id` | Obtener un tablero por ID |
| POST | `/boards` | Crear un tablero |
| PUT | `/boards/:id` | Actualizar un tablero |
| DELETE | `/boards/:id` | Eliminar un tablero |

### AI

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/ai/chat` | Chat con el asistente |
| POST | `/ai/generate-board` | Generar tablero desde lenguaje natural |

---

## Desarrollo

### Comandos Útiles

```bash
# Desarrollo
pnpm dev                  # Frontend + Backend juntos
pnpm dev:frontend         # Solo frontend
pnpm dev:backend          # Solo backend

# Build
pnpm --filter lifeboard-frontend build

# Tests
pnpm --filter lifeboard-frontend test       # Watch mode
pnpm --filter lifeboard-frontend test:run   # Una vez
pnpm --filter lifeboard-backend test

# Type check
pnpm --filter lifeboard-frontend typecheck
```

### Convenciones

- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Componentes**: Un componente por archivo, PascalCase
- **Hooks**: Archivos separados con prefijo `use`
- **Tipos**: Interfaces para objetos, uniones de strings para enums
- **Estilos**: Tailwind CSS v4, utility-first, sin `@apply`

---

## Arquitectura

### Frontend

- **Feature-based**: Código organizado por features, no por capas técnicas
- **Context API**: `BoardContext` maneja el state global de tableros
- **Custom Hooks**: Lógica extraída en hooks reutilizables
- **Zod**: Validación de esquemas en frontend y backend

### Backend

- **Clean Architecture**: Controllers → Services → Repositories
- **SQLite WAL**: Base de datos con Write-Ahead Logging para mejor performance
- **Rate Limiting**: Protección contra abuso de la API
- **Error Handling**: Middleware centralizado con AppError

### AI Chatbot

- **Groq + llama-3.3**: Modelo gratuito y rápido
- **Topic Validation**: Filtrado de mensajes fuera de tema (solo tableros)
- **System Prompt Reforzado**: Solo responde sobre productividad y tableros
- **JSON Response**: Genera tableros en formato estructurado

---

## Testing

```bash
# Frontend
pnpm --filter lifeboard-frontend test
pnpm --filter lifeboard-frontend test:coverage

# Backend
pnpm --filter lifeboard-backend test
```

### Cobertura de Tests

- Componentes UI (Button, Input, Badge, Modal)
- Hooks (useBoard, useBoards, usePomodoro)
- Utilidades (boardStats, StorageService)
- Validaciones (board schemas)

---

## Seguridad

- **Helmet**: Headers HTTP seguros
- **CORS**: Orígenes permitidos configurables
- **Rate Limiting**: 100 requests por 15 minutos
- **Zod Validation**: Todas las entradas validadas
- **No secrets en frontend**: Variables de entorno solo en backend
- **Topic Validation**: Chatbot rechaza contenido fuera de tema

---

## Licencia

MIT
