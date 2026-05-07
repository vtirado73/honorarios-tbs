# ARCHITECTURE.md — lecturer-fees

## Propósito del proyecto

La aplicación **lecturer-fees** tiene como objetivo calcular los honorarios de los docentes de un instituto en distintos periodos académicos, de manera completamente local (offline), utilizando IndexedDB para persistencia y UUIDs para los identificadores de las entidades.

---

## Contexto funcional

El sistema debe permitir:

- Registrar y gestionar **profesores** con sus datos personales y bancarios.  
- Registrar y gestionar **carreras**.  
- Registrar y gestionar **asignaturas**.  
- Registrar y gestionar **periodos académicos**, con fechas de inicio y fin.  
- Registrar y gestionar **horarios de clases** asociados a profesores y asignaturas, con día, turno y horario.  
- Configurar el **valor por hora** trabajada de los docentes.  
- Calcular los honorarios de los docentes según horarios y periodos.  

---

## Entidades principales

### Profesores

```txt
- id (UUID)
- name
- lastname
- surname
- ci
- email
- phone
- bank_name
- bank_account
- created_at
- updated_at
```

### Carreras

```txt
- id (UUID)
- name
- created_at
- updated_at
```

### Asignaturas

```txt
- id (UUID)
- name
- created_at
- updated_at
```

### Periodos académicos

```txt
- id (UUID)
- name
- start_at
- end_at
- created_at
- updated_at
```

### Horarios (schedules)

```txt
- id (UUID)
- professor_id
- subject_id
- day (lunes, martes, miércoles, jueves, viernes, sábado, domingo)
- start_at
- end_at
- shift (mañana, tarde, noche)
- created_at
- updated_at
```

### Configuración de pagos (settings)

```txt
- id (UUID)
- pay_per_hour
- created_at
- updated_at
```

---

## Persistencia y almacenamiento local

- **IndexedDB** es la fuente de verdad para todos los datos de la aplicación.  
- **Dexie** se recomienda como capa de abstracción para manejar IndexedDB de forma sencilla y confiable.  
- **localStorage** se puede utilizar únicamente para configuraciones ligeras de UI o preferencias.  
- Todos los IDs serán **UUIDs** para garantizar unicidad.  
- Todas las operaciones sobre la base de datos deben realizarse mediante **repositorios** y **servicios**, nunca directamente desde los componentes React.

---

## Arquitectura de carpetas sugerida

```txt
src/
  app/
    router/
    providers/
  
  database/
    db.js
    migrations/
    stores/

  modules/
    professors/
      components/
      pages/
      services/
      hooks/
      utils/
    careers/
    subjects/
    periods/
    schedules/
    settings/
    payroll/

  shared/
    components/
    hooks/
    layouts/
    services/
    utils/
    constants/
```

---

## Principios arquitectónicos

- **Modularidad**: separar por dominios o funcionalidades.  
- **Separación de responsabilidades**: UI, lógica de negocio, persistencia y utilidades claramente diferenciadas.  
- **Capa de servicios y repositorios**: centralizar el acceso a la base de datos y la lógica de negocio.  
- **Reutilización de componentes y hooks**: evitar duplicación de lógica.  
- **Entidades normalizadas**: relaciones mediante IDs, no objetos anidados.  
- **Persistencia offline-first**: toda la aplicación funciona sin conexión a internet.

---

## Flujo de datos recomendado

```txt
Componente React
  ↓
Hook reutilizable
  ↓
Servicio de negocio
  ↓
Repositorio (acceso a Dexie/IndexedDB)
```

---

## Cálculos de negocio

Se recomienda encapsular todas las reglas de negocio en servicios específicos, por ejemplo:

- `calculateWorkedHours(schedule)` → devuelve horas trabajadas por horario.  
- `calculateProfessorPayment(professor_id, period_id)` → devuelve el pago total de un profesor en un periodo.  
- `groupSchedulesByPeriod(professor_id)` → organiza los horarios por periodo académico.

Esto asegura que la UI permanezca desacoplada de la lógica de negocio.

---

## Manejo de fechas y dinero

- Todas las fechas deben manejarse con librerías confiables (Dayjs, Luxon).  
- Los cálculos monetarios deben evitar problemas de precisión de los números flotantes.  
- Mantener las utilidades de cálculo separadas de los componentes.

---

## Escalabilidad futura

La arquitectura debe permitir:

- Agregar autenticación y roles de usuario.  
- Sincronización eventual con la nube si fuera necesario.  
- Exportaciones de datos a PDF o Excel.  
- Dashboard de métricas y reportes.  
- Multiusuario sin reescrituras importantes de la base de datos.  

---

## Reglas generales de desarrollo

- Código limpio, explícito y mantenible.  
- Evitar duplicación de lógica.  
- Priorizar la legibilidad sobre la cleverness.  
- Pensar en crecimiento a largo plazo desde el inicio.  
- Usar patrones de diseño y principios SOLID cuando aporten valor real.

---

## Resumen de decisiones clave

| Aspecto | Decisión |
|---------|---------|
| Persistencia | IndexedDB (Dexie) |
| Configuraciones ligeras | localStorage |
| Identificadores | UUID |
| Arquitectura | Modular por dominio |
| Acceso a DB | Repositorios y servicios |
| UI | Componentes React reutilizables, hooks |
| Cálculos de negocio | Servicios dedicados |
| Manejo de fechas | Librería confiable (Dayjs, Luxon) |
| Cálculo de pagos | Normalizado, centralizado, aislado de UI |
