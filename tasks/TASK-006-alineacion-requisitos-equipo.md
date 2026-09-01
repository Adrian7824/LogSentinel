# TASK-006 - Alineación de requisitos del equipo

## Tipo

Épica de análisis y planificación. Esta tarea no autoriza implementar todos los puntos en un único cambio.

## Objetivo

Incorporar al backlog de LogSentinel los requisitos compartidos por el equipo, identificar dependencias y contradicciones con la arquitectura actual, y dividir posteriormente el alcance en tareas pequeñas y verificables.

## Requisitos funcionales por planificar

### Autenticación y autorización

- Crear una pantalla de inicio de sesión.
- Administrar sesiones de usuario.
- Definir control de acceso basado en roles (RBAC) y permisos granulares.

### Conexión con fuentes de logs

- Permitir registrar una URL de origen.
- Permitir configurar una conexión SSH.
- Mostrar un botón para iniciar la conexión.
- Mostrar el resultado y estado de la conexión.
- Permitir configurar uno o varios servidores como fuentes de logs.
- No guardar contraseñas, tokens o claves SSH en texto plano.

### Integración con inteligencia artificial

- Integrar mediante API un motor de IA que interprete logs en texto plano.
- Permitir consultas de diagnóstico en lenguaje natural.
- Devolver el fragmento exacto del log que sustenta cada respuesta.
- Incluir referencias al servidor, archivo, fecha y rango del evento utilizado.
- Permitir configurar la sensibilidad de detección de anomalías en niveles Bajo, Medio y Alto.
- Definir el comportamiento cuando el proveedor de IA no esté disponible, alcance su cuota o exceda el tiempo máximo de respuesta.

### Trazabilidad automatizada

- Correlacionar registros procedentes de uno o varios servidores.
- Generar una línea de tiempo unificada de eventos relacionados.
- Respetar la configuración de fuentes y servidores seleccionados.
- Conservar la referencia al log original para facilitar la auditoría.

### Auditoría inteligente

- Permitir que el sistema genere una auditoría a partir de una situación detectada.
- Registrar evidencia, periodo analizado, fuentes consultadas, hallazgos y conclusión.
- Permitir que un usuario revise el resultado antes de considerarlo definitivo.

### Retención de datos

- Permitir configurar periodos de retención de logs procesados e indexados.
- Considerar inicialmente opciones de 30, 60 y 90 días.
- Definir si los datos vencidos deben archivarse o eliminarse.
- Mostrar el impacto estimado de la configuración sobre el almacenamiento.

### Canales de alertas

- Registrar y administrar múltiples canales de notificación.
- Admitir Webhooks para integraciones como Slack o Microsoft Teams.
- Admitir SMTP para notificaciones por correo electrónico.
- Permitir activar, desactivar y probar cada canal.
- Evitar exponer secretos o credenciales en la interfaz y en los logs.

### Respaldo de configuraciones

- Exportar la configuración del sistema a un archivo.
- Importar y validar un archivo de respaldo antes de aplicarlo.
- Incluir servidores registrados, reglas de alertas y umbrales.
- Excluir credenciales en texto plano del archivo exportado.
- Definir versionado y compatibilidad del formato de respaldo.

### Reportes

- Evaluar la generación de reportes ejecutivos automáticos para usuarios técnicos, gerentes y responsables de toma de decisiones.
- Definir contenido, periodicidad, formatos y destinatarios antes de implementar.

## Requisitos no funcionales por definir

### Disponibilidad

- Diseñar la solución para análisis continuo 24/7.
- Definir un objetivo medible de disponibilidad, recuperación y tolerancia a fallos.

### Backend

- El documento del equipo solicita que el backend se desarrolle íntegramente en Java.
- La arquitectura actual del proyecto define Python y FastAPI.
- Antes de implementar backend, el equipo debe seleccionar una alternativa y registrar la decisión en `docs/decisions/`.
- No mezclar ambos stacks ni modificar contratos hasta resolver esta decisión.

### Rendimiento

- Definir un tiempo máximo medible para las consultas a la API de IA.
- Procesar e indexar archivos de logs superiores a 1 GB sin bloquear la interfaz.
- Evitar cargar archivos completos en memoria cuando pueda utilizarse procesamiento por bloques o streaming.
- Definir pruebas de carga, volumen esperado y criterios de capacidad.

### Seguridad

- Cifrar credenciales, contraseñas y claves SSH almacenadas.
- Definir gestión y rotación de claves de cifrado.
- Proteger secretos durante el tránsito y en reposo.
- Evitar que datos sensibles aparezcan en logs, respuestas de error, respaldos o datos mock.
- Definir expiración de sesiones, roles y permisos.

### Experiencia de usuario

- Mantener el dashboard y las pantallas de configuración completamente responsive.
- Mostrar estados de carga, éxito, vacío y error en operaciones remotas.
- Reducir la complejidad de la configuración inicial mediante mensajes y validaciones claras.

### Testabilidad

- Preparar la arquitectura para pruebas automatizadas unitarias, de integración y End-to-End.
- Cubrir como mínimo login, conexión SSH y consultas a la API de IA.
- Simular servicios externos en pruebas para no depender de credenciales o proveedores reales.

## Riesgos identificados

- Consumo elevado de memoria, CPU y almacenamiento al procesar archivos mayores a 1 GB.
- Dependencia de disponibilidad, latencia, cuotas y costos del proveedor de IA.
- Complejidad de configuración para usuarios sin perfil administrativo.
- Pérdida temporal de eventos o falsos positivos debido a conexiones inestables.
- Diversidad de formatos de logs, especialmente en sistemas heredados.
- Exposición de credenciales mediante conexiones, respaldos o mensajes de error.

## Decisiones pendientes

- Backend Java o Python/FastAPI.
- Proveedor y modelo de IA.
- Política de envío de logs y datos sensibles al proveedor de IA.
- Objetivos de disponibilidad y tiempos máximos de respuesta.
- Roles, permisos y flujo de autenticación.
- Estrategia de cifrado y administración de claves.
- Mecanismo de ingestión para archivos grandes y conexiones SSH.
- Política de archivo, eliminación y recuperación de logs.
- Formato y protección de los respaldos.

## Descomposición requerida

Antes de implementar, esta épica debe dividirse como mínimo en tareas independientes para:

1. Login, sesiones y RBAC.
2. Registro de servidores y conexiones URL/SSH.
3. Ingestión segura y procesamiento de archivos grandes.
4. Integración con el proveedor de IA.
5. Búsqueda de logs mediante lenguaje natural y evidencia de respuesta.
6. Correlación de eventos y línea de tiempo.
7. Auditoría inteligente.
8. Retención y archivado de datos.
9. Canales de alertas mediante Webhooks y SMTP.
10. Sensibilidad de detección de anomalías.
11. Importación y exportación de configuraciones.
12. Estrategia de pruebas automatizadas y End-to-End.

Cada tarea resultante debe indicar contratos, datos, seguridad, pruebas y criterios de aceptación propios.

## Fuera de alcance de esta tarea

- Implementar interfaces o servicios.
- Conectarse a servidores reales.
- Consumir una API de IA real.
- Almacenar credenciales.
- Cambiar el backend o la arquitectura existente.
- Presentar estos requisitos como funcionalidad terminada.

## Criterios de aceptación

- Todos los requisitos compartidos por el equipo están registrados en el backlog.
- La contradicción entre Java y Python/FastAPI está identificada y no se resuelve sin decisión del equipo.
- Los requisitos no funcionales pendientes de métricas están señalados para su definición.
- Los riesgos de IA, seguridad, red, formatos y archivos grandes están documentados.
- La épica queda lista para descomponerse en tareas implementables.
- Ningún punto de esta tarea se considera implementado por el solo hecho de estar documentado.
