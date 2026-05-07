# AGENTS.md — lecturer-fees

Comunicarse siempre en español. Explicar decisiones técnicas de forma clara y breve.

## Comandos (usar Yarn, no npm)

| Comando | Propósito |
|---------|-----------|
| `yarn dev` | Servidor de desarrollo Vite con HMR |
| `yarn build` | Build producción en `dist/` |
| `yarn preview` | Previsualizar build producción |
| `yarn lint` | ESLint 10 flat config |

No hay framework de testing configurado.

## Stack

- React 19 (JSX, sin TypeScript)
- Vite 8 + `@vitejs/plugin-react`
- Yarn v1 (classic)
- Tailwind 3 + PostCSS (`darkMode: 'class'`)
- ESLint 10 flat config (plugins: react-hooks, react-refresh)
- Dexie 4 (IndexedDB)
- react-router-dom 7
- Sin librería de estado global (solo Context para tema)

## Arquitectura real (verificada contra src/)

```
src/
  main.jsx                          ← Entry point
  App.jsx                           ← BrowserRouter + Routes
  index.css                         ← @tailwind directives

  app/providers/ThemeProvider.jsx   ← Tema oscuro/claro
  database/db.js                    ← Dexie schema + migraciones

  pages/                            ← Páginas (rutas)
    dashboard/  docentes/  carreras/  asignaturas/
    periodos/   schedules/ settings/  payroll/

  modules/                          ← CRUD con capas separadas
    docentes/  carreras/  asignaturas/  periodos/  schedules/  settings/
    └── services/ repositories/ hooks/ components/

  shared/
    components/   (Sidebar, Header)
    layouts/      (DashboardLayout con Outlet)
    hooks/        (useTheme)
    constants/    (navigation)
```

**Cada módulo sigue:** `Page → Hook → Service → Repository → Dexie`

## Convenciones del código

- **Nombres de módulos en español:** `docentes`, `carreras`, `asignaturas`, `periodos`
- **IDs:** `crypto.randomUUID()`
- **Timestamps:** `created_at`, `updated_at` en ISO string (`new Date().toISOString()`)
- **Soft-delete:** campo `active` (booleano), patrón `toggleActive(id)` en repository
- **Mount guard:** `let mounted = true` + cleanup en todos los `useEffect`
- **Validación:** en services (unicidad de sigla, fechas start_at ≤ end_at, formato monetario)
- **Settings singleton:** `get()` devuelve el primero o crea default; `update()` hace put

## Base de datos (Dexie) — 6 tablas

| Tabla | Índices | Notas |
|-------|---------|-------|
| `docentes` | `id, name, ci, email, active, created_at` | |
| `carreras` | `id, &acronym, name, active, created_at` | `&acronym` = unique |
| `asignaturas` | `id, &acronym, name, career_id, active, created_at` | `&acronym` = unique, FK a carreras |
| `periodos` | `id, name, start_at, end_at, active, created_at` | |
| `settings` | `id, pay_per_hour, morning_start…, evening_end, created_at, updated_at` | Evolucionó: v6→v7 agrega horarios de turnos |
| `schedules` | `id, professor_id, subject_id, period_id, day, shift, active, created_at` | FK compuesta |

Nota: las versiones de migración (v3, v4) están intercambiadas cronológicamente en `db.js`; Dexie las ejecuta en orden numérico.
