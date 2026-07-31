# LifeBoard — Tu segundo cerebro

> Organizá tus proyectos, hábitos y estudios en un solo lugar.

LifeBoard es una app web personal para administrar todo lo que aprendés y hacés. Como Trello + Notion + Duolingo, pero para una sola persona.

---

## Primeros pasos

1. **Abrí la app** — hacé `pnpm dev` y entrá a `localhost:5173`
2. **Creá un tablero** — click en "Nuevo Tablero" en el Dashboard
3. **Agregá columnas** — como listas de Trello (ej: "Por hacer", "En progreso", "Hecho")
4. **Agregá tarjetas** — cada tarjeta es una tarea, concepto o nota

---

## Funcionalidades

### Tableros y tarjetas

| Acción | Cómo |
|--------|------|
| Crear tablero | Click en "Nuevo Tablero" en el Dashboard |
| Crear columna | Click en "+ Nueva columna" dentro del tablero |
| Crear tarjeta | Click en "+ Nueva tarjeta" dentro de una columna |
| Editar tarjeta | Click en cualquier tarjeta para abrir el detalle |
| Mover tarjeta | Arrastrá con el mouse o usá los botones ← → |
| Eliminar | Click en el ícono ✕ en columnas o tarjetas |

### Detalle de tarjeta

Al hacer click en una tarjeta podés:

- **Editar título y descripción**
- **Cambiar prioridad** (Baja / Media / Alta)
- **Cambiar dificultad** (Fácil / Media / Difícil)
- **Agregar etiquetas** — para categorizar (ej: "urgente", "react", "diseño")
- **Usar checklist** — lista de tareas dentro de la tarjeta
- **Escribir notas en Markdown** — con soporte de negrita, cursiva, código, listas y títulos

### Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `Ctrl + K` | Abrir Command Palette |
| `N` | Crear nueva tarjeta |
| `/` | Buscar |
| `Esc` | Cerrar modales |

### Command Palette

Presioná `Ctrl + K` para acceder rápidamente a:

- Navegar a tableros
- Crear nuevas tarjetas
- Buscar contenido
- Ver estadísticas

### Búsqueda

En el Dashboard, escribí en el campo de búsqueda para filtrar tableros por nombre en tiempo real.

### Pomodoro

En el sidebar hay un temporizador Pomodoro:

- **25 minutos** de trabajo concentrado
- **5 minutos** de descanso
- Cuenta cuántas sesiones completás
- Controles: Iniciar, Pausar, Saltar, Reiniciar

### Estadísticas

En `/stats` o desde el sidebar:

- Tarjetas totales y completadas
- Tarjetas por columna, prioridad y dificultad
- Progreso de checklists
- Tasa de éxito general

### Logros

La app desbloquea logros automáticamente cuando:

| Logro | Condición |
|-------|-----------|
| 🎯 Primer Tablero | Creás tu primer tablero |
| 📚 Coleccionista | Tenés 5 tableros |
| 🃏 Primera Tarjeta | Creás tu primera tarjeta |
| ⚡ Productivo | Tenés 10 tarjetas |
| 🏆 Maestro | Tenés 50 tarjetas |
| ⭐ Primer Logro | Completás una tarjeta (100%) |
| 🔥 Imparable | Completás 10 tarjetas |
| ✅ Checklist Master | Completás 20 items de checklist |
| 🏷️ Organizador | Usás 5 etiquetas diferentes |
| 🍅 Enfocado | Completás 5 sesiones Pomodoro |

### Tema oscuro / claro

En el header hay un botón para cambiar entre:

- 🌙 **Oscuro** — modo oscuro
- ☀️ **Claro** — modo claro
- 💻 **Sistema** — usa la configuración de tu SO

La preferencia se guarda automáticamente.

---

## Qué guarda la app

Todo se guarda en **LocalStorage** de tu navegador. No hay servidor, no hay cuenta, no hay datos en la nube.

- Tus tableros, columnas y tarjetas
- Tu preferencia de tema
- Tus logros desbloqueados

**⚠️ Importante:** Si limpiás el cache del navegador, perdés los datos. LifeBoard es una app local.

---

## Comandos útiles

```bash
pnpm dev          # Arrancar en desarrollo
pnpm build        # Build de producción
pnpm test:run     # Correr tests
```

---

## Stack

| Tecnología | Para qué |
|------------|----------|
| React 19 | UI |
| TypeScript | Tipado estático |
| Vite 8 | Bundler y dev server |
| Tailwind CSS v4 | Estilos |
| dnd-kit | Drag & Drop |
| Motion | Animaciones |
| cmdk | Command Palette |
| Recharts | Gráficos de estadísticas |
| React Hook Form + Zod | Formularios y validación |
| Vitest + Testing Library | Tests |
