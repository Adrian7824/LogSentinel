# ADR-001 - Kafka para ingestión

## Estado

Propuesto.

## Contexto

LogSentinel requiere recibir eventos de múltiples aplicaciones y procesarlos de forma desacoplada.

## Decisión

Utilizar Kafka como mecanismo principal de ingestión de eventos.

## Razones

- Escalabilidad.
- Procesamiento en tiempo real.
- Desacoplamiento entre productores y consumidores.
- Integración natural con tecnologías de procesamiento distribuido.

## Consecuencias

Será necesario gestionar topics, particiones, retención y consumidores.
