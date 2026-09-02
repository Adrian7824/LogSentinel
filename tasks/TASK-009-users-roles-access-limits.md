# TASK-009 - Usuarios, roles, permisos y límites de acceso

## Objetivo

Completar la sección de usuarios de LogSentinel incorporando administración visual de usuarios, roles, permisos y restricciones de acceso.

Toda la funcionalidad será mock mientras no exista backend y sistema de autenticación.

---

## Alcance

Completar `/usuarios`.

Mostrar:

- Lista de usuarios.
- Nombre.
- Correo.
- Rol.
- Estado.
- Último acceso.
- Tipo de acceso.
- Permisos.
- Acciones disponibles.

---

## Estados de usuario

Soportar visualmente:

- Activo.
- Inactivo.
- Suspendido.

Los cambios se almacenarán únicamente en memoria.

---

## Roles

Crear una representación mock de roles.

Ejemplos:

### Administrador

Acceso completo a la plataforma.

### Operador / Analista

Puede consultar logs, incidentes y alertas.

### Visualizador

Acceso principalmente de lectura.

Los nombres definitivos podrán modificarse posteriormente cuando el equipo defina el modelo RBAC real.

---

## Permisos

Permitir visualizar o modificar permisos por módulo:

- Dashboard.
- Logs.
- Incidentes.
- Alertas.
- Aplicaciones.
- Usuarios.
- Configuración.

Cuando sea útil, distinguir:

- Ver.
- Crear.
- Editar.
- Administrar.

---

## Restricciones de acceso

Agregar configuración visual para indicar si un usuario tiene:

### Acceso 24/7

Puede acceder sin restricción horaria.

### Acceso restringido

Permitir seleccionar:

- Días permitidos.
- Hora inicial.
- Hora final.

Ejemplo:

Lunes a viernes  
08:00 - 18:00

---

## Vista de detalle

Al seleccionar un usuario mostrar:

- Información general.
- Rol.
- Estado.
- Permisos.
- Política de acceso.
- Actividad reciente mock.

---

## Acciones

Simular:

- Crear usuario.
- Editar usuario.
- Activar usuario.
- Desactivar usuario.
- Cambiar rol.
- Modificar permisos.
- Cambiar política de acceso.

No realizar persistencia real.

---

## Consideración arquitectónica

Esta interfaz representa el comportamiento esperado de RBAC.

No implementar todavía:

- Login real.
- JWT.
- OAuth.
- Sesiones.
- Autorización backend.
- Middleware de seguridad.

La implementación definitiva dependerá del backend seleccionado.

---

## Criterios de aceptación

- `/usuarios` presenta información útil.
- Los usuarios pueden filtrarse o buscarse.
- Existe vista de detalle.
- Se pueden visualizar roles.
- Se pueden modificar permisos de manera local.
- Se puede configurar acceso 24/7 o restringido.
- Los cambios permanecen únicamente durante la sesión.
- La UI comunica que se utilizan datos mock.
- La interfaz funciona correctamente en móvil y desktop.
- `typecheck`, `lint` y `build` finalizan correctamente.