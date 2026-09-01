# API - Diseño inicial

## Prefijo

`/api/v1`

## Endpoints propuestos

### Dashboard

`GET /api/v1/dashboard/summary`

Retorna métricas agregadas.

### Logs

`GET /api/v1/logs`

Filtros sugeridos:

- application
- severity
- user
- start_date
- end_date
- query

### Incidentes

`GET /api/v1/incidents`

`GET /api/v1/incidents/{id}`

### Aplicaciones

`GET /api/v1/applications`

### Usuarios

`GET /api/v1/users`

### Alertas

`GET /api/v1/alerts`

### Health

`GET /health`

## Nota

Este archivo describe contratos iniciales y no debe considerarse definitivo.
Cualquier cambio de contrato debe documentarse aquí.
