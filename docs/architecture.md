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
