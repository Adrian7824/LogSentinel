# TASK-007 - Asistente IA / Chatbot

## Objetivo

Incorporar a LogSentinel un asistente conversacional orientado al análisis de logs que permita al usuario interactuar con la plataforma mediante lenguaje natural.

En esta etapa la funcionalidad será completamente mock y no realizará llamadas a servicios externos de inteligencia artificial.

El objetivo es representar cómo se integraría un asistente de IA en una versión productiva de LogSentinel.

---

## Alcance

Implementar la interfaz del asistente IA dentro del frontend existente.

El asistente debe permitir:

- Abrir y cerrar el chatbot.
- Escribir preguntas.
- Mostrar mensajes del usuario.
- Mostrar respuestas simuladas del asistente.
- Mantener el historial de conversación mientras la aplicación permanezca abierta.
- Mostrar estados de carga mientras se genera una respuesta.
- Permitir preguntas sugeridas.
- Diferenciar visualmente mensajes del usuario y del asistente.
- Mantener una experiencia responsive.

---

## Casos de uso de demostración

El chatbot debe poder simular preguntas como:

- ¿Qué errores críticos ocurrieron hoy?
- ¿Qué aplicación está generando más errores?
- Explícame este log.
- ¿Hay errores relacionados con este trace ID?
- Resume los eventos recientes.
- ¿Qué ocurrió antes de este error?
- ¿Qué incidentes parecen estar relacionados?
- ¿Cuáles son los errores más repetidos?
- ¿Hay algún comportamiento anormal?
- ¿Qué debería revisar primero?

---

## Comportamiento mock

No se debe conectar ningún modelo de IA real.

Las respuestas deben generarse utilizando:

- Datos disponibles en `src/data`.
- Reglas predefinidas.
- Respuestas simuladas.
- Información existente de logs, incidentes y aplicaciones.

Cuando una pregunta no pueda resolverse con los datos mock, el asistente debe indicarlo claramente.

Ejemplo:

> "No encontré información suficiente en los datos disponibles para responder esta consulta."

---

## Identificación de la funcionalidad

La interfaz debe dejar claro que se trata de una demostración.

Puede utilizarse una etiqueta como:

`AI Assistant · Demo`

o

`Asistente IA · Mock`

No presentar respuestas simuladas como análisis realizado por un modelo de IA real.

---

## Componentes sugeridos

Reutilizar componentes existentes antes de crear nuevos.

Posibles componentes:

- `AiAssistant`
- `AiChatPanel`
- `AiMessage`
- `AiPromptSuggestions`
- `AiTypingIndicator`

La ubicación final debe respetar la arquitectura actual del proyecto.

---

## Estado

Separar:

- Datos.
- Estado.
- Presentación.

El historial puede mantenerse únicamente en memoria.

No es necesario persistir conversaciones después de recargar la aplicación.

---

## Fuera de alcance

No implementar:

- OpenAI.
- Claude.
- Gemini.
- Amazon Bedrock.
- Modelos locales.
- APIs reales.
- Backend.
- Persistencia de conversaciones.
- Embeddings.
- RAG.
- Bases vectoriales.

---

## Criterios de aceptación

- Existe un chatbot accesible desde la interfaz.
- Permite enviar mensajes.
- Muestra respuestas mock.
- Tiene preguntas sugeridas.
- Tiene indicador de procesamiento.
- Las respuestas pueden utilizar información de los datos mock existentes.
- Se identifica claramente como funcionalidad demo.
- Funciona correctamente en desktop y móvil.
- No contiene credenciales ni llamadas a APIs externas.
- TypeScript permanece en modo estricto.
- `typecheck`, `lint` y `build` finalizan correctamente.