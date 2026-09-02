# TASK-011 - Servidores y conexiones

## Objetivo

Crear la interfaz para administrar las fuentes desde las cuales LogSentinel recibiría logs.

La funcionalidad será completamente simulada y no realizará conexiones reales.

---

## Alcance

Permitir visualizar y administrar conexiones mock hacia servidores y aplicaciones.

Tipos iniciales:

- URL / HTTP.
- SSH.

---

## Listado de conexiones

Mostrar:

- Nombre.
- Tipo.
- Host.
- Aplicación relacionada.
- Estado.
- Última verificación.
- Acciones.

---

## Estados

Utilizar estados visuales como:

- Conectado.
- Desconectado.
- Error.
- Pendiente.

Estos estados provienen exclusivamente de datos mock.

---

## Crear conexión

Permitir abrir un formulario para registrar una conexión.

### URL / HTTP

Campos posibles:

- Nombre.
- URL.
- Aplicación.
- Tipo de logs.
- Frecuencia.

### SSH

Campos posibles:

- Nombre.
- Host.
- Puerto.
- Usuario.
- Ruta de logs.

No solicitar ni almacenar credenciales reales.

Para contraseña o llave SSH utilizar únicamente valores ficticios o campos de demostración.

---

## Probar conexión

Agregar acción:

`Probar conexión`

La prueba debe ser simulada.

Mostrar estados:

1. Verificando.
2. Resultado.

Ejemplos:

`Conexión establecida correctamente · Simulación`

o

`No fue posible establecer conexión · Simulación`

---

## Detalle de conexión

Mostrar:

- Información.
- Aplicación relacionada.
- Tipo.
- Estado.
- Última actividad.
- Archivos o fuentes simuladas.
- Historial de conexión mock.

---

## Acciones

Permitir simular:

- Crear.
- Editar.
- Activar.
- Desactivar.
- Eliminar.
- Probar conexión.

---

## Consideraciones de seguridad

No incluir:

- Contraseñas reales.
- Tokens.
- Private keys.
- Credenciales.
- Conexiones SSH reales.
- Solicitudes contra infraestructura externa.

---

## Consideración arquitectónica

Esta tarea únicamente define la experiencia frontend.

La conexión real con servidores deberá implementarse después de definir oficialmente la tecnología del backend.

Actualmente existe una decisión pendiente entre:

- Python + FastAPI.
- Backend Java requerido por el equipo.

Esta tarea no debe resolver ni asumir dicha decisión.

---

## Criterios de aceptación

- Se pueden visualizar conexiones.
- Se puede crear una conexión mock.
- Se soportan visualmente URL y SSH.
- Se puede simular una prueba de conexión.
- Se muestran estados de conexión.
- Se puede consultar el detalle.
- Ninguna operación establece conexiones reales.
- No existen credenciales reales en el código.
- La interfaz es responsive.
- `typecheck`, `lint` y `build` finalizan correctamente.