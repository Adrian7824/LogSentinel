# TASK-008 - Análisis inteligente de logs

## Objetivo

Extender el asistente IA mock para permitir análisis contextual de logs, incidentes y eventos dentro de LogSentinel.

La funcionalidad debe demostrar cómo un asistente inteligente podría reducir el tiempo necesario para diagnosticar problemas.

---

## Alcance

Agregar acciones de análisis sobre la información mock existente.

El usuario debe poder solicitar análisis desde:

- Explorador de logs.
- Detalle de un log.
- Incidentes.
- Asistente IA.

---

## Acciones principales

### Explicar log

Agregar una acción:

`Explicar con IA`

La respuesta simulada debe mostrar información como:

- Qué ocurrió.
- Aplicación involucrada.
- Severidad.
- Posible significado del mensaje.
- Metadata relevante.
- Trace ID.
- Posibles elementos a revisar.

---

### Resumir eventos

Permitir solicitar:

`Resumir eventos`

El resultado puede incluir:

- Cantidad de eventos.
- Errores encontrados.
- Aplicaciones afectadas.
- Severidades predominantes.
- Eventos relevantes.

---

### Detectar patrones

Simular identificación de patrones como:

- Errores repetidos.
- Incremento de errores.
- Eventos similares.
- Aplicaciones con mayor cantidad de fallas.
- Trace IDs relacionados.

---

### Buscar información mediante lenguaje natural

Permitir consultas simuladas como:

- Muéstrame errores críticos.
- Errores de payments-service.
- ¿Qué pasó con este trace ID?
- Busca errores 500.
- ¿Qué aplicación tiene más errores?
- Encuentra eventos relacionados.

La interpretación puede realizarse mediante reglas simples sobre palabras clave.

No es necesario implementar procesamiento real de lenguaje natural.

---

## Resultado del análisis

Las respuestas pueden mostrarse estructuradas en bloques como:

### Resumen

Descripción breve del problema.

### Evidencia encontrada

Logs o eventos relacionados.

### Posible causa

Explicación simulada basada únicamente en la información disponible.

### Recomendación

Posibles puntos que un operador podría investigar.

---

## Navegación contextual

Cuando sea posible, las respuestas del asistente deben permitir navegar hacia:

- Log relacionado.
- Incidente.
- Aplicación.
- Trace ID.

Reutilizar las rutas existentes.

---

## Seguridad de la demostración

No afirmar que una causa es definitiva.

Utilizar lenguaje como:

- "Posible causa".
- "Podría estar relacionado con".
- "Los eventos disponibles sugieren".
- "Sería recomendable revisar".

---

## Fuera de alcance

No implementar:

- Machine Learning real.
- Detección de anomalías real.
- LLM.
- RAG.
- Correlación distribuida real.
- Procesamiento de logs en backend.
- Predicciones.

---

## Criterios de aceptación

- Un log puede enviarse al asistente para ser explicado.
- El asistente puede mostrar eventos relacionados.
- Puede resumir información mock.
- Puede detectar patrones básicos mediante reglas.
- Puede responder ciertas consultas escritas en lenguaje natural.
- El usuario puede navegar desde los resultados hacia elementos relacionados.
- No se realizan llamadas externas.
- Toda la funcionalidad se identifica como simulación.
- La interfaz sigue siendo responsive.
- `typecheck`, `lint` y `build` finalizan correctamente.