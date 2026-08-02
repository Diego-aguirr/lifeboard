# LifeBoard — React Architecture (Interview Reference)

Personal productivity app (Trello + Notion + Duolingo hybrid). Single-user, localStorage persistence.

## Stack

| Layer | Tool | Why |
|-------|------|-----|
| UI | React 19 | Latest concurrent features, strict mode |
| Language | TypeScript 6 | Full type safety, no `any` |
| Build | Vite 8 | Fast HMR, ESM-first |
| Styling | Tailwind CSS v4 | Utility-first, dark mode via `class` |
| Routing | React Router v7 | Nested layouts, type-safe routes |
| DnD | @dnd-kit | Accessible, composable drag-and-drop |
| Validation | Zod | Runtime schema validation at load time |
| Testing | Vitest + Testing Library | Unit + integration tests |
| Package | pnpm | Fast, disk-efficient |

---

## App Bootstrap — Where Everything Starts

This is the rendering chain. Every React app has one. Understanding this is fundamental.

### The Chain

```
index.html  (Vite serves this)
    │
    │  <div id="root"></div>
    │  <script type="module" src="/src/main.tsx"></script>
    │
    ▼
main.tsx  (React entry point)
    │
    │  createRoot(document.getElementById('root')).render(
    │    <StrictMode>
    │      <ThemeProvider>
    │        <BoardProvider>
    │          <App />
    │        </BoardProvider>
    │      </ThemeProvider>
    │    </StrictMode>
    │  )
    │
    ▼
App.tsx  (component tree root)
    │
    ├── AchievementChecker  (observer — watches boards)
    │   └── AchievementNotification  (toast)
    │
    └── RouterProvider  (React Router)
        │
        ▼
    routes.tsx  (route definitions)
        │
        │  { path: '/', element: <MainLayout />, children: [...] }
        │
        ▼
    MainLayout  (shell: Header + Sidebar + Outlet)
        │
        │  <Outlet />  ← renders the matched child route
        │
        ├── "/" → DashboardPage  (home, board listing)
        ├── "/board/:id" → BoardPage  (kanban editor)
        └── "/stats" → StatsPage  (analytics)
```

### Step by Step

**1. `index.html`** — Vite's entry point. Just a `<div id="root">` and a script tag pointing to `main.tsx`.

**2. `main.tsx`** — Calls `createRoot` and renders the component tree. Notice the nesting:

```
StrictMode          → catches common mistakes in dev
  ThemeProvider     → dark/light mode (reads localStorage)
    BoardProvider   → central state (reads localStorage, validates with Zod)
      App           → root component
```

**Why this order?** Providers wrap from outermost (most general) to innermost (most specific). Theme is app-wide. Board state is app-wide. App uses both.

**3. `App.tsx`** — Does two things:
- Renders `AchievementChecker` (observes boards, shows toast notifications)
- Renders `RouterProvider` with the route config

**4. `routes.tsx`** — Defines the route tree. All routes are children of `MainLayout`:

```tsx
{
  path: '/',
  element: <MainLayout />,      // Header + Sidebar always visible
  children: [
    { index: true, element: <DashboardPage /> },     // "/" (exact)
    { path: 'board/:boardId', element: <BoardPage /> },
    { path: 'stats', element: <StatsPage /> },
    { path: '*', element: <Navigate to="/" /> },     // 404 → home
  ]
}
```

**5. `MainLayout`** — The shell. Always renders Header and Sidebar. The `<Outlet />` component renders whichever child route matches the URL.

### What the User Sees First

When you visit `http://localhost:5173/`:

```
┌─────────────────────────────────────────┐
│  Header (logo, theme toggle, etc.)      │
├──────────┬──────────────────────────────┤
│ Sidebar  │  DashboardPage               │
│ (nav)    │  ├── BoardCard × N           │
│          │  └── CreateBoardForm button  │
│          │                              │
└──────────┴──────────────────────────────┘
```

The `DashboardPage` is the **index route** (`index: true`). It reads boards from `BoardContext` and displays them as cards.

---

## Architecture

### Feature-based structure

```
src/
├── app/            → Router, providers, entry point
├── features/       → Each feature is independent
│   ├── board/      → Kanban boards (context, components, types)
│   ├── dashboard/  → Home, board cards, create form
│   ├── stats/      → Charts and analytics
│   └── pomodoro/   → Focus timer
├── shared/         → Reusable: components, hooks, storage, utils
├── layouts/        → Page shells (MainLayout with sidebar)
├── lib/            → Cross-cutting: theme provider, utilities
└── styles/         → Global CSS, Tailwind config
```

**Key principle**: Features don't import from each other. Shared code lives in `shared/`.

---

## Core Patterns

### 1. State Management — `useReducer` + Context

No global store (Redux/Zustand) at this scale. State lives in `BoardContext`:

```
BoardProvider
├── useReducer(boardReducer, initialState)
├── useEffect → load from localStorage on mount
├── useEffect → debounced save on every state change
└── Exposes: boards, CRUD actions, getBoardById
```

**Why `useReducer` over `useState`?**
- Complex state transitions (CREATE, DELETE, UPDATE, SET_BOARD)
- Predictable: pure reducer function, easy to test
- Dispatch is stable (no re-renders), unlike setState with objects

**Interview answer**: "I chose `useReducer` because the board state has multiple related sub-operations. The reducer centralizes state logic, making it testable and debuggable. Context provides the dependency injection — any component below `BoardProvider` can consume without prop drilling."

### 2. Persistence — Abstraction Layer

```
StorageService (singleton)
├── get<T>(key) → T | null
├── set<T>(key, data) → void
├── remove(key) → void
└── clear() → void (only lifeboard: prefix)
```

- All keys prefixed with `lifeboard:` — no collision with other apps
- Zod validation on load — corrupt data triggers reset to demo boards
- Debounced save (500ms) — no writes on every keystroke
- Silent failure — localStorage unavailable ≠ crash

**Interview answer**: "The `StorageService` is a thin abstraction over localStorage. If we migrate to IndexedDB or a backend, we swap one class — zero changes to business logic. Zod validation at load time is critical: localStorage is fragile (users clear it, extensions corrupt it), so we validate and fallback to defaults."

### 3. Drag and Drop — @dnd-kit

```
DragDropProvider
├── DndContext (sensors, events)
├── SortableContext (horizontal strategy for columns)
└── DragOverlay (visual feedback during drag)
```

- `PointerSensor` with 8px activation constraint — prevents accidental drags
- Two drag types: `column` (reorder) and `card` (reorder within column or move across)
- `onDragOver` handles cross-column moves in real-time
- `onDragEnd` finalizes the reorder with `arrayMove`

**Interview answer**: "I wrapped dnd-kit in a `DragDropProvider` component that owns all the drag logic. Parent components just pass callbacks — `onReorderColumns` and `onMoveCard`. This follows the inversion of control pattern: the provider handles the complexity, consumers stay simple."

### 4. Gamification — Achievement System

```
useAchievements hook
├── Loads from localStorage
├── checkAchievements(boards) → evaluates rules
├── unlock(id) → marks as unlocked, saves
└── newAchievement → triggers toast notification
```

- Rules are pure functions: count boards, cards, checklist items, tags
- `AchievementChecker` component sits in `App`, watches `boards` context
- Each achievement: `{ id, title, description, icon, unlocked, unlockedAt }`

### 5. Component Design

| Pattern | Where | Example |
|---------|-------|---------|
| Container/Presentational | BoardPage → Column → CardItem | Page holds state, children are pure UI |
| Compound Components | DragDropProvider + children | Provider owns logic, children compose |
| Controlled Inputs | CreateBoardForm, Input | Value + onChange, no internal state |
| Portal Modals | Modal component | Renders outside DOM tree, z-index safe |

---

## Domain Map — How Everything Connects

Think of the app as a **house**. Each domain is a room with its own logic, but they share:
- **Structure** (Layouts) — the walls, doors, hallways
- **Water pipes** (Context) — data flows through the whole house
- **Electricity** (Shared hooks/components) — reusable utilities

### Domain 1: Board (the core)

This is where all the complexity lives. Everything else either feeds it or reads from it.

```
BoardContext (the "brain")
├── State: Board[] → Column[] → Card[]
├── Reducer: LOAD, CREATE, DELETE, UPDATE, SET_BOARD
├── Persistence: debounced save to localStorage
└── CRUD: createBoard, addColumn, addCard, moveCard, etc.
```

**Component tree:**

```
BoardPage (route: /board/:boardId)
│
├── BoardHeader → title, "Add column" button
├── DragDropProvider → wraps everything, handles DnD
│   └── ColumnList → iterates sorted columns
│       └── Column → title + card list
│           ├── CardItem → card preview
│           └── CreateCardForm → input for new card
└── CardDetail (modal) → edit full card
```

**How it works:**

1. `BoardPage` gets `boardId` from the URL
2. Calls `getBoardById(boardId)` from `BoardContext`
3. Renders the board with all its columns and cards
4. User interactions (create, move, edit) dispatch actions to the reducer
5. Reducer updates state → `useEffect` saves to localStorage

**Key insight**: The board state lives in `BoardContext`, NOT in `BoardPage`. This means:
- Navigation doesn't lose state
- Any component can read/write boards
- Achievements can observe board changes

**Drag & Drop flow:**

```
User drags card from Column A to Column B
  → DragDropProvider.onDragOver fires
    → Finds card in Column A, removes it
    → Finds Column B, inserts card at new position
    → dispatch({ type: 'SET_BOARD', ... })
      → Reducer returns new state
        → useEffect saves to localStorage
```

### Domain 2: Dashboard (the home)

The dashboard is intentionally simple. It lists boards and lets you create new ones.

```
DashboardPage (route: /)
│
├── BoardCard × N → each board as a visual card
└── CreateBoardForm → modal for new board
```

**Connection to Board:**
- Reads `boards` from `BoardContext`
- `createBoard()` adds a new board → dispatches to reducer → persists
- Clicking a `BoardCard` → React Router navigates to `/board/:boardId`

**Why it's separate from Board:**
- Different concern: listing vs. editing
- Different UI: grid of cards vs. kanban columns
- Independent testing: test dashboard without DnD complexity

### Domain 3: Stats (analytics)

Stats is a **pure consumer** — it reads data, calculates metrics, shows charts.

```
StatsPage (route: /stats)
│
├── Reads all boards from BoardContext
├── Calculates: total cards, completed, by priority, by difficulty
└── Renders: bar charts, pie charts
```

**Connection:**
- No state of its own
- Reads `boards` from context → computes derived data
- If you add a card in Board domain, stats update automatically

**Key React concept**: Stats demonstrates **derived state**. Instead of storing "total completed cards" as separate state, it computes it from the source of truth (boards). This eliminates sync bugs.

### Domain 4: Pomodoro (focus timer)

The Pomodoro timer is mostly independent with its own local state.

```
PomodoroTimer
├── Local state: timeRemaining, isRunning, mode (work/break)
├── useEffect with setInterval → countdown logic
└── Persists completed sessions to localStorage
```

**Connection to Board:**
- When a session completes, it can update `timeSpent` on the active card
- `useAchievements` checks if you've done 5 pomodoros → unlocks achievement

**React concept**: Pomodoro uses **local component state** (`useState` + `useEffect`), not Context. Why? Because timer state is temporary and doesn't need to be shared. This is a good example of choosing the right tool — don't put everything in Context.

### Domain 5: Achievements (gamification, cross-cutting)

Achievements are a **horizontal concern** — they touch every domain.

```
useAchievements hook
├── State: Achievement[] (localStorage)
├── checkAchievements(boards) → evaluates rules
├── unlock(id) → marks as unlocked, saves
└── newAchievement → triggers toast notification
```

**Rules are pure functions:**

| Rule | Condition | Achievement |
|------|-----------|-------------|
| Board count | `boards.length >= 1` | "Primer Tablero" |
| Board count | `boards.length >= 5` | "Coleccionista" |
| Card count | `allCards.length >= 1` | "Primera Tarjeta" |
| Card count | `allCards.length >= 10` | "Productivo" |
| Card count | `allCards.length >= 50` | "Maestro" |
| Completion | `completedCards.length >= 1` | "Primer Logro" |
| Completion | `completedCards.length >= 10` | "Imparable" |
| Checklist | `completedChecklist.length >= 20` | "Detalle" |
| Tags | `allTags.size >= 5` | "Organizador" |
| Pomodoro | `pomodoroSessions >= 5` | "Enfocado" |

**How it connects to the whole app:**

```tsx
// App.tsx
function AchievementChecker() {
  const { boards } = useBoardContext()  // ← reads from Board
  const { checkAchievements } = useAchievements()
  
  useEffect(() => {
    checkAchievements(boards)  // ← evaluates rules
  }, [boards])  // ← re-runs when boards change
  
  return <AchievementNotification ... />  // ← shows toast
}
```

**React concept**: This is an **observer pattern** implemented with `useEffect`. The `AchievementChecker` component "watches" the `boards` state and reacts to changes. It sits at the top of the component tree (in `App`) so it can observe everything.

---

## Full Connection Map

```
main.tsx
└── ThemeProvider (dark mode, localStorage)
    └── BoardProvider (central state)
        └── App
            ├── AchievementChecker (observer)
            │   ├── useBoardContext() → reads boards
            │   ├── useAchievements() → evaluates rules
            │   └── AchievementNotification → toast UI
            └── RouterProvider
                └── MainLayout (Header + Sidebar + Outlet)
                    │
                    ├── DashboardPage
                    │   ├── BoardCard × N → reads boards
                    │   └── CreateBoardForm → creates board
                    │
                    ├── BoardPage
                    │   ├── BoardHeader → board info
                    │   ├── DragDropProvider → DnD logic
                    │   │   └── ColumnList → Column → CardItem
                    │   └── CardDetail → edit card
                    │
                    └── StatsPage
                        └── Reads boards → calculates metrics
```

**Data flows DOWN, actions flow UP:**

```
BoardProvider (state + dispatch)
    │
    │  ↓ boards, createBoard, addCard, etc.
    ▼
DashboardPage
    │  createBoard({ title, icon, color })
    │
    │  ↓ dispatch({ type: 'CREATE_BOARD', payload: ... })
    ▼
BoardContext (reducer)
    │
    │  ↓ new state
    ▼
useEffect → saveToStorage(state.boards)
    │
    │  ↓ StorageService.set()
    ▼
localStorage
```

---

## Data Flow (Board CRUD)

```
User clicks "Create Board"
  → DashboardPage.createBoard({ title, icon, color })
    → BoardContext.createBoard()
      → dispatch({ type: 'CREATE_BOARD', payload: newBoard })
        → reducer returns { ...state, boards: [...state.boards, newBoard] }
          → useEffect fires saveToStorage(state.boards)
            → StorageService.set('boards', boards)  [debounced 500ms]
```

**No prop drilling**: Context provides `createBoard` to any descendant.

---

## React Concepts Demonstrated

| Concept | Where | Why It Matters |
|---------|-------|----------------|
| **useReducer** | BoardContext | Complex state transitions, testable logic |
| **Context** | BoardProvider, ThemeProvider | Avoid prop drilling, dependency injection |
| **useEffect** | Persistence, achievements, timer | Side effects: storage, observers, intervals |
| **useCallback** | BoardContext actions | Stable function references, prevent re-renders |
| **Derived state** | StatsPage | Compute from source of truth, no sync bugs |
| **Local state** | PomodoroTimer, Sidebar | Temporary UI state, no sharing needed |
| **Component composition** | DragDropProvider + children | Inversion of control, separation of concerns |
| **Controlled components** | CreateBoardForm, Input | Parent owns state, predictable behavior |
| **Portals** | Modal | Render outside DOM tree, z-index safety |
| **Custom hooks** | useAchievements, useKeyboardShortcuts | Reusable logic, clean components |

---

## Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest | Utils, hooks, reducer logic |
| Integration | Testing Library | Components with context |
| E2E | (planned) | Full user flows |

- Tests co-located: `BoardContext.test.tsx` next to `BoardContext.tsx`
- `localStorage.clear()` in `beforeEach` — clean state per test
- Mock data via `DEMO_BOARDS` constant

---

## Interview Cheat Sheet

**Q: Walk me through what happens when the app loads.**
> Vite serves `index.html` which loads `main.tsx`. `main.tsx` calls `createRoot` and renders a tree: `StrictMode` → `ThemeProvider` → `BoardProvider` → `App`. The `BoardProvider` reads from localStorage, validates with Zod, and dispatches `LOAD_BOARDS`. `App` renders the router, which matches `/` to `MainLayout` → `DashboardPage`. The dashboard reads boards from context and displays them.

**Q: How do you handle state in this app?**
> `useReducer` for complex state (boards with nested columns/cards), Context for distribution. No external store needed at this scale — it would add dependency overhead without benefit.

**Q: How do you persist data?**
> `StorageService` singleton wraps localStorage. Zod validates on load (corrupt → reset). Debounced saves prevent performance issues. The abstraction means we can swap to IndexedDB/backend without touching business logic.

**Q: How does drag and drop work?**
> @dnd-kit with a custom `DragDropProvider`. It handles two drag types (column reorder, card move). The provider pattern inverts control — parent owns the logic, children just render.

**Q: How do you handle errors?**
> Zod validation at data boundaries (load time). Silent failures in storage (quota exceeded ≠ crash). Component-level error boundaries (planned). No try-catch scattered everywhere.

**Q: How is the code organized?**
> Feature-based: `features/board/`, `features/dashboard/`. Features don't import each other. Shared code in `shared/`. This makes features independently testable and replaceable.

**Q: What about performance?**
> Debounced saves (500ms), memoized callbacks (`useCallback`), stable context values, Vite code-splitting at route level. No unnecessary re-renders — `useReducer` dispatch is stable.

**Q: Why Context instead of Redux/Zustand?**
> At this scale, Context + useReducer is sufficient. Adding Redux would mean learning a new API, setting up stores/slices/actions, and managing middleware — overhead that doesn't pay for itself here. If we needed server state, caching, or optimistic updates, I'd reach for TanStack Query or Zustand.

---

## Interview Explanation (30 seconds)

> "LifeBoard is a Kanban-style productivity app built with React 19 and TypeScript. It uses a **feature-based architecture** where each domain (Board, Dashboard, Stats, Pomodoro) is independent and connects to a central `BoardContext` for state management. The context uses `useReducer` for complex state transitions and `useCallback` for stable action references. Data persists to localStorage via an abstracted `StorageService` with Zod validation and debounced saves. Drag and drop is handled by `@dnd-kit` wrapped in a `DragDropProvider` that inverts control — the provider owns the logic, children just render. Achievements are a cross-cutting concern that observes board changes via `useEffect` and evaluates pure rule functions. The whole app demonstrates Context for dependency injection, derived state for analytics, local state for temporary UI, and component composition for separation of concerns."

---

## Checklist

- [x] TypeScript strict mode, no `any`
- [x] Feature-based architecture
- [x] Context + useReducer for state
- [x] StorageService abstraction
- [x] Zod validation at load
- [x] Debounced persistence
- [x] Drag and drop (columns + cards)
- [x] Achievement/gamification system
- [x] Dark mode support
- [x] 109 tests passing
- [ ] Error boundaries (planned)
- [ ] IndexedDB migration (planned)
