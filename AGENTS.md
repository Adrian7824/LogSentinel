# LogSentinel - Instrucciones para agentes de IA

## Objetivo del proyecto

Construir una plataforma de análisis de logs en tiempo real para:

- Detectar errores y fallas.
- Analizar rendimiento.
- Analizar actividad de usuarios.
- Generar alertas.
- Facilitar diagnóstico de incidentes.

## Principios

- Priorizar código claro, modular y mantenible.
- No duplicar componentes ni lógica.
- No modificar contratos o arquitectura sin documentarlo.
- Evitar dependencias innecesarias.
- No hardcodear secretos, tokens, contraseñas o endpoints sensibles.
- Mantener separación de responsabilidades.

## Stack propuesto

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Python
- FastAPI

### Datos y procesamiento
- Kafka
- Apache Spark

### Persistencia
- PostgreSQL

### Cloud
- AWS

> El stack puede evolucionar. Toda modificación importante debe registrarse en `docs/decisions/`.

## Convenciones

### Frontend
- Componentes: PascalCase.
- Hooks: `useNombre`.
- Servicios: `nombreService.ts`.
- Tipado estricto con TypeScript.
- Componentes reutilizables.
- Separar presentación, estado y acceso a datos.

### Backend
- snake_case.
- Endpoints REST.
- Separación por capas:
  - routers
  - services
  - repositories
  - models
  - schemas

## Antes de programar

1. Leer `README.md`.
2. Revisar `docs/architecture.md`.
3. Revisar el archivo de tarea correspondiente.
4. Inspeccionar el código existente.
5. Evitar crear una solución paralela si ya existe algo reutilizable.

## Después de programar

1. Ejecutar tests disponibles.
2. Ejecutar lint.
3. Verificar errores de TypeScript.
4. Verificar imports y rutas.
5. Actualizar documentación si cambió arquitectura o comportamiento.
6. Resumir archivos modificados y decisiones tomadas.

## Restricciones

- No borrar funcionalidad existente sin una razón explícita.
- No cambiar nombres públicos arbitrariamente.
- No introducir credenciales reales.
- No inventar endpoints o contratos productivos sin documentarlos.
- No implementar tareas fuera del alcance solicitado.

## Flujo recomendado

Trabajar una tarea por vez desde `tasks/`.

Ejemplo:

> Lee `AGENTS.md` y `tasks/TASK-001-layout-principal.md`. Implementa únicamente esa tarea y respeta los criterios de aceptación.
