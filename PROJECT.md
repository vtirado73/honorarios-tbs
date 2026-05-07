# PROJECT.md — lecturer-fees

## Propósito del proyecto

La aplicación **lecturer-fees** tiene como objetivo calcular los honorarios de los docentes de un instituto en distintos periodos académicos, trabajando completamente en local (offline) usando IndexedDB.  
Permite gestionar profesores, asignaturas, carreras, horarios, periodos y configuraciones de pagos, y calcular automáticamente los honorarios de cada docente según sus horarios y el valor por hora configurado.

---

## Dominio funcional

El proyecto se organiza en torno a las siguientes funcionalidades:

1. **Gestión de profesores**
   - Crear, editar, eliminar y listar profesores.
   - Registrar datos personales y bancarios.

2. **Gestión de carreras**
   - Crear y listar carreras disponibles en el instituto.

3. **Gestión de asignaturas**
   - Crear y listar asignaturas asociadas a las carreras.

4. **Gestión de periodos académicos**
   - Definir periodos con fechas de inicio y fin.
   - Asociar horarios y pagos a cada periodo.

5. **Gestión de horarios**
   - Registrar horarios de clases por profesor y asignatura.
   - Definir día, turno (mañana, tarde, noche) y horas de inicio y fin.

6. **Configuración de pagos**
   - Definir el valor por hora de los docentes.

7. **Cálculo de honorarios**
   - Calcular automáticamente el pago de cada docente según horarios y periodo.

---

## Entidades principales

### Profesores

```txt
id (UUID)
name
lastname
surname
ci
email
phone
bank_name
bank_account
created_at
updated_at
```

### Carreras

```txt
id (UUID)
name
created_at
updated_at
```

### Asignaturas

```txt
id (UUID)
name
created_at
updated_at
```

### Periodos académicos

```txt
id (UUID)
name
start_at
end_at
created_at
updated_at
```

### Horarios (schedules)

```txt
id (UUID)
professor_id
subject_id
day (lunes, martes, miércoles, jueves, viernes, sábado, domingo)
start_at
end_at
shift (mañana, tarde, noche)
created_at
updated_at
```

### Configuración de pagos (settings)

```txt
id (UUID)
pay_per_hour
created_at
updated_at
```

---

## Relación entre entidades

- Un **profesor** puede tener múltiples **horarios**.
- Una **asignatura** puede estar en múltiples **horarios**.
- Cada **horario** pertenece a un **periodo académico**.
- La configuración de **pagos** se aplica a todos los profesores.

---

## Flujo de información

1. El usuario crea profesores, carreras, asignaturas, periodos y horarios.  
2. Los horarios se almacenan en **IndexedDB**.  
3. Al calcular pagos:
   - Se consultan los horarios de un profesor en un periodo.  
   - Se calculan las horas trabajadas.  
   - Se multiplica por el valor por hora de la configuración de pagos.  
4. El resultado se muestra en la interfaz, y puede exportarse si se agrega esa funcionalidad en el futuro.

---

## Decisiones técnicas clave

| Aspecto | Decisión |
|---------|---------|
| Persistencia | IndexedDB (Dexie) |
| Configuraciones ligeras | localStorage |
| Identificadores | UUID |
| Arquitectura | Modular por dominio, capas separadas (UI → Hooks → Servicios → Repositorios → DB) |
| UI | Componentes React reutilizables y hooks |
| Cálculos de negocio | Servicios dedicados, aislados de UI |
| Manejo de fechas | Librería confiable (Dayjs o Luxon) |
| Estilos | Estrategia consistente, evitar mezcla de metodologías |

---

## Buenas prácticas recomendadas

- Componentes pequeños y con una sola responsabilidad.  
- Hooks reutilizables para lógica compartida.  
- Acceso a base de datos solo mediante repositorios y servicios.  
- Mantener lógica de negocio y cálculos fuera de los componentes.  
- Evitar duplicación de código y lógica.  
- Entidades normalizadas usando IDs, no objetos anidados.  
- Documentar claramente cada módulo y función importante.  

---

## Futuras extensiones

- Exportación de reportes a PDF o Excel.  
- Dashboard de métricas de pagos y horarios.  
- Soporte multiusuario y roles (administrador, profesor).  
- Sincronización eventual con la nube para backup.  
- Notificaciones o alertas de horarios y pagos.  

---

## Resumen

El **PROJECT.md** sirve como guía funcional para nuevos desarrolladores:

- Explica el propósito de la app.  
- Describe el dominio y las entidades.  
- Detalla relaciones y flujo de datos.  
- Señala decisiones técnicas clave y buenas prácticas.  
- Facilita la escalabilidad futura de la aplicación.
