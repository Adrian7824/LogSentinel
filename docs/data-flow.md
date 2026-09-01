# Flujo de datos

## Flujo esperado

1. Una aplicación genera un log.
2. El evento es enviado al sistema de ingestión.
3. Kafka recibe el evento.
4. El proceso de análisis transforma y clasifica el log.
5. Se calculan métricas y posibles alertas.
6. Los resultados se almacenan.
7. FastAPI expone los datos.
8. El frontend los visualiza.

## Estructura conceptual de un log

```json
{
  "timestamp": "2026-08-28T12:00:00Z",
  "application": "payments-api",
  "severity": "ERROR",
  "message": "Connection timeout",
  "user_id": "optional",
  "trace_id": "optional",
  "metadata": {}
}
```

## Consideraciones

- Los eventos deben incluir timestamp.
- Se debe conservar el origen del log.
- El trace_id debe aprovecharse cuando exista.
- Los datos de usuario deben tratarse de acuerdo con las políticas de seguridad aplicables.
