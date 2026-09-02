# LogSentinel

LogSentinel es una plataforma de observabilidad orientada al análisis centralizado de logs. Su propósito es ayudar a equipos técnicos a detectar errores, revisar el rendimiento de sus aplicaciones, analizar actividad y reducir el tiempo necesario para diagnosticar incidentes.

## Estado del proyecto

El proyecto se encuentra en fase de maqueta funcional del frontend. La interfaz utiliza datos de demostración y permite recorrer los principales flujos sin depender todavía de un backend, una base de datos o servicios externos.

Actualmente están disponibles:

- Dashboard con métricas, actividad temporal, distribución por severidad y eventos recientes.
- Explorador de logs con búsqueda, filtros, paginación y vista de detalle.
- Gestión visual de incidentes con filtros, estados, actividad y logs relacionados.
- Catálogo de alertas con búsqueda, filtros y activación o desactivación local.
- Asistente conversacional mock con análisis estructurado de logs e incidentes, consultas por reglas, resúmenes y detección simulada de patrones.
- Administración mock de usuarios con roles, permisos por módulo y políticas horarias de acceso.
- Configuración mock organizada por secciones, con preferencias de observabilidad, retención, notificaciones, seguridad y conexiones.
- Layout responsive para escritorio, tablet y móvil.
- Ruta preparada para aplicaciones.

Los datos, estados, conversaciones y cambios mostrados en la interfaz son locales y se reinician al recargar la aplicación. El asistente está identificado como demostración y no consume ningún modelo o API de inteligencia artificial.

## Funcionalidades previstas

El alcance futuro contempla autenticación y RBAC real en backend, conexiones URL/SSH, ingestión de archivos grandes, integración real con inteligencia artificial, análisis avanzado en backend, correlación distribuida de eventos, auditorías, retención efectiva de datos, canales de notificación activos y respaldo de configuraciones.

Estos puntos permanecen documentados como trabajo pendiente en [TASK-006](tasks/TASK-006-alineacion-requisitos-equipo.md). Su presencia en el backlog no significa que estén implementados.

## Tecnologías actuales

- React 18.
- TypeScript con tipado estricto.
- Vite.
- Tailwind CSS.
- React Router.

La implementación actual corresponde únicamente al frontend. La tecnología del backend continúa pendiente de una decisión del equipo: la arquitectura original propone Python con FastAPI, mientras los requisitos consolidados solicitan Java. La decisión debe registrarse antes de iniciar esa capa.

## Arquitectura propuesta

```text
Fuentes de logs
      |
      v
Ingesta y procesamiento
      |
      +-----> Detección y alertas
      |
      v
Persistencia e indexación
      |
      v
     API
      |
      v
React + TypeScript
```

La descripción técnica completa se encuentra en [docs/architecture.md](docs/architecture.md).

## Estructura del repositorio

```text
LogSentinel/
├── src/
│   ├── components/
│   │   ├── ai-assistant/ Asistente conversacional de demostración
│   │   ├── alerts/       Componentes propios de alertas
│   │   ├── dashboard/    Componentes del dashboard
│   │   ├── incidents/    Componentes de incidentes
│   │   ├── layout/       Sidebar, header y layout principal
│   │   ├── logs/         Componentes propios del visor de logs
│   │   ├── settings/     Configuración visual de la plataforma
│   │   ├── users/        Administración mock de usuarios y permisos
│   │   └── ui/           Componentes compartidos
│   ├── data/             Datos mock separados de la interfaz
│   ├── hooks/            Estado reutilizable de la interfaz
│   ├── pages/            Pantallas asociadas a las rutas
│   ├── services/         Reglas locales y simulación de respuestas
│   ├── styles/           Estilos globales
│   └── types/            Tipos de dominio
├── docs/                 Arquitectura y documentación funcional
├── tasks/                Alcance implementado y backlog pendiente
├── index.html
├── package.json
└── vite.config.ts
```

Los directorios `node_modules/` y `dist/` son generados localmente y no forman parte del código fuente.

## Requisitos para ejecutar la maqueta

- Node.js LTS.
- npm, incluido con Node.js.

Comprueba la instalación con:

```powershell
node --version
npm.cmd --version
```

## Instalación y ejecución

Desde la raíz del proyecto:

```powershell
npm.cmd install
npm.cmd run dev
```

Vite mostrará la dirección local de la aplicación, normalmente:

```text
http://localhost:5173
```

El uso de `npm.cmd` permite ejecutar el proyecto en Windows aunque PowerShell tenga deshabilitada la ejecución de scripts `.ps1`.

## Rutas disponibles

| Ruta | Contenido |
| --- | --- |
| `/dashboard` | Resumen general del sistema |
| `/logs` | Exploración y detalle de logs |
| `/incidentes` | Seguimiento de incidentes |
| `/alertas` | Administración visual de reglas de alerta |
| `/aplicaciones` | Espacio preparado para aplicaciones |
| `/usuarios` | Administración mock de usuarios, roles y acceso |
| `/configuracion` | Configuración mock general y administrativa |

## Validaciones

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Actualmente no existe una suite de pruebas automatizadas configurada.

## Documentación

- [Arquitectura](docs/architecture.md)
- [Requisitos](docs/requirements.md)
- [Especificación de interfaz](docs/ui.md)
- [Flujo de datos](docs/data-flow.md)
- [API propuesta](docs/api.md)
- [Decisiones técnicas](docs/decisions/README.md)
