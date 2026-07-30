# LifeBoard — Plan de Proyecto

> "Tu segundo cerebro para aprender, organizar y avanzar."

Aplicación web personal para administrar proyectos, hábitos, estudio, objetivos y conocimiento en un solo lugar visual e interactivo. Mezcla de Trello + Notion + Duolingo, enfocada en una sola persona.

---

## Stack de tecnologías

| Herramienta | Para qué sirve | Versión |
|---|---|---|
| **React** | Construcción de la interfaz con componentes | 19 |
| **TypeScript** | Seguridad de tipos en modo estricto | latest |
| **Vite** | Entorno de desarrollo y bundler rápido | latest |
| **Tailwind CSS** | Estilos utility-first | v4 |
| **Motion** | Microanimaciones fluidas (antes Framer Motion) | latest |
| **dnd-kit** | Drag & Drop profesional y accesible | latest |
| **React Hook Form** | Manejo de formularios con validación | latest |
| **Zod** | Validación de esquemas (formularios + storage) | latest |
| **React Router** | Navegación entre rutas (v7) | v7 |
| **Lucide React** | Iconografía consistente | latest |
| **Sonner** | Notificaciones toast elegantes | latest |
| **cmdk** | Command Palette estilo VSCode | latest |
| **Recharts** | Gráficos para estadísticas | latest |
| **Vitest** | Tests unitarios e integración (natural con Vite) | latest |
| **Testing Library** | Tests de componentes React | latest |
| **nanoid** | Generación de IDs únicos y cortos | latest |

---

## Estructura del proyecto

```
LifeBoard/
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│   │
│   ├── features/
│   │   ├── board/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── column/
│   │   ├── card/
│   │   ├── search/
│   │   ├── notes/
│   │   ├── pomodoro/
│   │   ├── statistics/
│   │   └── shortcuts/
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Dialog/
│   │   │   ├── Badge/
│   │   │   ├── Skeleton/
│   │   │   └── EmptyState/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── storage/
│   │   └── validations/
│   │
│   ├── layouts/
│   │   ├── MainLayout/
│   │   └── FocusLayout/
│   │
│   └── styles/
│       └── globals.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

**Regla**: cada carpeta de features es independiente. Nada de carpetas gigantes con componentes mezclados.

---

## Modelo de dominio

```
Board
├── id: string (nanoid)
├── title: string
├── icon: string
├── color: string
├── createdAt: string
├── updatedAt: string
└── columns: Column[]

Column
├── id: string
├── title: string
├── order: number
└── cards: Card[]

Card
├── id: string
├── title: string
├── description: string
├── priority: 'low' | 'medium' | 'high'
├── tags: string[]
├── checklist: ChecklistItem[]
├── progress: number (0-100)
├── timeSpent: number (minutos)
├── startDate: string | null
├── targetDate: string | null
├── difficulty: 'easy' | 'medium' | 'hard'
├── order: number
├── createdAt: string
└── updatedAt: string

ChecklistItem
├── id: string
├── text: string
└── completed: boolean
```

---

## Rutas de navegación

```
/                        → Dashboard (mis tableros)
/board/:boardId          → Tablero con columnas y tarjetas
```

Navegación simple:Inicio → Tablero. Sin rutas anidadas innecesarias.

---

## MVP

Crear tablero, CRUD de columnas, CRUD de tarjetas, mover tarjetas entre columnas, editar tarjeta con descripción y checklist, guardar y cargar de LocalStorage, borrar tablero. Sin login, sin backend, sin estadísticas, sin Pomodoro.

---

## Filosofía de UX

- Cada acción genera respuesta visual inmediata. La app se siente viva.
- Microanimaciones con Motion: botones reaccionan, tarjetas flotan, modales aparecen suavemente.
- Drag & Drop físico con dnd-kit: sombras, rotación, columnas se iluminan.
- Feedback inmediato con Sonner: notificaciones al crear, animación al eliminar.
- Atajos de teclado: `N` nueva tarjeta, `/` buscar, `Ctrl+K` comandos, `Esc` cerrar.
- Command Palette con cmdk: buscar tarjetas o ejecutar acciones.
- Búsqueda instantánea: filtrado en tiempo real sin botón.
- Modo Focus: una tarjeta a la vez, ideal para estudiar.
- Tema oscuro elegante inspirado en Linear, Raycast y Notion.

---

## Decisiones clave

1. **Sin store global al inicio**: el estado vive en `useState` donde corresponde. Context o Zustand solo si aparece un problema real de estado compartido.
2. **Persistencia abstraída**: nunca `localStorage.setItem` directo. Un `StorageService` que puede reemplazarse por IndexedDB o un backend sin cambiar la lógica.
3. **Guardado con debounce**: no en cada keystroke, sino cada 500ms o al salir de la página.
4. **Validación con Zod al cargar**: si los datos de LocalStorage están corruptos, se resetea con defaults.
5. **Tests desde Fase 2**: Vitest + Testing Library. TDD cuando sea posible.
6. **Accesibilidad**: ARIA labels en drag & drop, focus management en modales, navegación por teclado.

---

## Fases de construcción

### Fase 0 — Diseño (sin código)

- [ ] 0.1 Definir dominio completo (entidades + relaciones)
- [ ] 0.2 Definir rutas de navegación
- [ ] 0.3 Definir MVP real
- [ ] 0.4 Definir estrategia de persistencia (StorageService)
- [ ] 0.5 Definir estrategia de testing

### Fase 1 — Fundamentos de React

- [ ] 1.1 Configurar proyecto: Vite + TypeScript + Tailwind + Prettier
- [ ] 1.2 Crear estructura de carpetas (app/, features/, shared/, layouts/)
- [ ] 1.3 Componentes atómicos compartidos: Button, Input, Badge, Skeleton
- [ ] 1.4 Layout principal: Header + Sidebar + Main
- [ ] 1.5 Setup de React Router con las rutas definidas
- [ ] 1.6 Página Dashboard vacía y página Board vacía

**Conceptos React**: JSX, componentes, props, estructura de proyecto.

### Fase 2 — Estado y renderizado

- [ ] 2.1 Board: crear tablero, listar tableros, eliminar tablero
- [ ] 2.2 Column: crear columna, renombrar, eliminar
- [ ] 2.3 Card: crear tarjeta, renombrar, eliminar
- [ ] 2.4 Mover tarjetas entre columnas (botones, sin DnD aún)
- [ ] 2.5 Tests unitarios de cada feature

**Conceptos React**: useState, renderizado de listas (map), eventos, props drilling.

### Fase 3 — Persistencia

- [ ] 3.1 Crear StorageService (abstracción sobre LocalStorage)
- [ ] 3.2 Validación con Zod al cargar datos
- [ ] 3.3 Guardado automático con debounce (500ms)
- [ ] 3.4 Manejo de errores de storage (datos corruptos → reset)

**Conceptos React**: efectos (useEffect), ciclo de vida, cleanup.

### Fase 4 — Composición

- [ ] 4.1 Modal de tarjeta: ver y editar tarjeta completa
- [ ] 4.2 Formularios con React Hook Form + Zod
- [ ] 4.3 Checklist dentro de tarjeta (agregar, marcar, eliminar items)
- [ ] 4.4 Tags/etiquetas en tarjetas
- [ ] 4.5 Componentes reutilizables: CardDetail, ColumnHeader, BoardHeader

**Conceptos React**: composición, children, patrón compound, portales (modales).

### Fase 5 — Estado compartido

- [ ] 5.1 Context para board state (cuando useState + props se vuelve engorroso)
- [ ] 5.2 Optimistic updates (actualizar UI antes de confirmar)
- [ ] 5.3 Derivación de estado (progreso de tablero = promedio de tarjetas)

**Conceptos React**: Context API, useReducer, separación de estado derivado vs. estado almacenado.

### Fase 6 — Interacciones

- [ ] 6.1 Drag & Drop con dnd-kit (mover tarjetas y columnas)
- [ ] 6.2 Animaciones con Motion (entrada, salida, layout animations)
- [ ] 6.3 Atajos de teclado (N, /, Ctrl+K, Esc)
- [ ] 6.4 Command Palette con cmdk
- [ ] 6.5 Búsqueda instantánea

**Conceptos React**: refs, efectos secundarios, performance (memo, useCallback).

### Fase 7 — Features avanzadas

- [ ] 7.1 Pomodoro integrado (temporizador + registro de tiempo)
- [ ] 7.2 Notas Markdown en tarjetas
- [ ] 7.3 Estadísticas con Recharts (tiempo estudiado, cards completadas, racha)
- [ ] 7.4 Sistema de logros (sutil, no infantil)
- [ ] 7.5 Tema oscuro impecable

**Conceptos React**: timers, Markdown rendering, composición avanzada, optimización.

---

## Regla más importante

Este proyecto no se construye por pantallas, sino por **conceptos de React**. Cada funcionalidad existe porque obliga a aprender algo nuevo:

- Crear tarjeta → componentes, props y estado.
- Editarla → formularios y eventos.
- Moverla → estado complejo y drag & drop.
- Buscarla → renderizado, filtros y optimización.
- Ver estadísticas → composición y derivación de estado.
- Pomodoro → efectos, temporizadores y ciclo de vida.

---

## Flujo de trabajo por sesión

1. Diseñamos el problema.
2. Pensamos varias soluciones.
3. Elegimos la mejor y justificamos por qué.
4. Recién entonces escribimos código.
5. Analizamos cómo React resolvió ese problema internamente.
