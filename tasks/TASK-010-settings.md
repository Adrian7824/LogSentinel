# TASK-010 - Configuración de LogSentinel

## Objetivo

Completar la pantalla `/configuracion` para representar las principales opciones de administración de LogSentinel.

La configuración será únicamente visual y utilizará estado local.

---

## Alcance

Organizar la configuración mediante secciones.

Secciones propuestas:

- General.
- Observabilidad.
- Retención.
- Notificaciones.
- Seguridad.
- Conexiones.

---

## Configuración general

Permitir representar opciones como:

- Nombre del entorno.
- Zona horaria.
- Idioma.
- Formato de fecha.
- Nivel de log predeterminado.

---

## Observabilidad

Opciones mock relacionadas con:

- Severidades visibles.
- Actualización automática.
- Intervalo de actualización.
- Cantidad de eventos mostrados.
- Comportamiento del Dashboard.

---

## Retención

Representar configuración de retención de logs.

Ejemplos:

- 7 días.
- 30 días.
- 90 días.
- Personalizado.

No eliminar información realmente.

---

## Notificaciones

Representar configuración para:

- Webhooks.
- SMTP.

Debe quedar claro que no existe una integración activa.

Mostrar estados como:

`No configurado`

`Configuración demo`

---

## Seguridad

Mostrar configuraciones relacionadas con:

- Sesiones.
- Acceso.
- Roles.
- Auditoría.

No implementar mecanismos reales de autenticación.

---

## Guardado

Al guardar:

- Mostrar feedback visual.
- Actualizar estado local.
- No realizar solicitudes HTTP.

Ejemplo:

`Configuración actualizada para esta sesión`

---

## Criterios de aceptación

- `/configuracion` deja de ser una pantalla incompleta.
- La información está agrupada de forma comprensible.
- Existen controles adecuados para cada configuración.
- Los cambios se mantienen en memoria.
- Se diferencia claramente configuración real de configuración demo.
- La interfaz permanece responsive.
- `typecheck`, `lint` y `build` finalizan correctamente.