# Arquitectura de LogSentinel

## Visión general

LogSentinel estará dividido inicialmente en cuatro capas principales:

1. Interfaz web.
2. API backend.
3. Procesamiento y análisis de logs.
4. Persistencia y consulta.

## Arquitectura propuesta

```text
Fuentes de logs
      |
      v
   Kafka
      |
      v
Procesamiento / Spark
      |
      +--------> Alertas
      |
      v
PostgreSQL / almacenamiento
      |
      v
 FastAPI
      |
      v
React + TypeScript
```

## Frontend

Responsable de:

- Dashboard.
- Consulta de logs.
- Visualización de incidentes.
- Aplicaciones monitoreadas.
- Actividad de usuarios.
- Alertas.
- Configuración.

### Implementación actual de la maqueta

El frontend incluye un asistente global compartido mediante contexto de React. Las pantallas de logs e incidentes pueden abrirlo con una consulta contextual sin duplicar el estado de conversación.

El análisis mostrado en la maqueta se genera en servicios locales mediante reglas deterministas sobre los datos mock. Las respuestas pueden incluir resumen, evidencia, posible causa, recomendación y enlaces a rutas existentes. Esta capa no realiza llamadas externas, no utiliza un LLM y no confirma causalidad real.

La sección de usuarios representa visualmente el modelo RBAC esperado mediante tipos y datos mock. La lista de usuarios, sus roles, permisos y políticas horarias se administran en estado de React respaldado por un servicio local en memoria para conservar los cambios durante la navegación; todo se pierde al recargar. Esta representación no protege rutas ni implementa login, sesiones, tokens o autorización real; esas responsabilidades corresponden al backend futuro.

La pantalla de configuración utiliza el mismo patrón de sesión local: mantiene un borrador en React y solo actualiza el servicio mock en memoria cuando el usuario guarda. Las secciones de retención, notificaciones, seguridad y conexiones representan contratos visuales futuros; no eliminan datos, envían mensajes, abren conexiones ni ejecutan controles de seguridad reales.

El catálogo de aplicaciones conserva su metadata en un servicio local en memoria y calcula el contexto de observabilidad cruzando por nombre los logs, incidentes y alertas mock existentes. Registrar o pausar una aplicación solo modifica la representación visual; no crea agentes, fuentes de datos ni conexiones de red. La administración de conexiones permanece separada para su alcance posterior.

## Backend

FastAPI será responsable de:

- Exponer endpoints REST.
- Consultar datos procesados.
- Administrar filtros.
- Gestionar incidentes y alertas.
- Proveer métricas agregadas al dashboard.

## Procesamiento

Kafka recibirá eventos de logs.

Spark podrá utilizarse para:

- Transformación.
- Enriquecimiento.
- Agregación.
- Detección de patrones.
- Cálculo de métricas.

## Persistencia

PostgreSQL almacenará inicialmente:

- Aplicaciones.
- Logs indexados o metadatos.
- Incidentes.
- Alertas.
- Usuarios.
- Configuración.

## Evolución

La arquitectura debe mantenerse modular para permitir sustituir componentes sin reescribir todo el sistema.
