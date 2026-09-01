import type { Incident } from '../types/incident'

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const mockIncidents: Incident[] = [
  {
    id: 'INC-0042',
    title: 'Tiempo de espera agotado en procesamiento de pagos',
    description:
      'Las solicitudes de pago superan el umbral de cinco segundos y el gateway devuelve respuestas 504.',
    severity: 'CRITICAL',
    application: 'API Gateway',
    detectedAt: minutesAgo(18),
    updatedAt: minutesAgo(4),
    status: 'INVESTIGATING',
    assignee: 'Mariana Rojas',
    source: 'Regla: upstream-timeout',
    relatedLogIds: ['log-2091'],
    updates: [
      {
        id: 'upd-4202',
        timestamp: minutesAgo(4),
        author: 'Mariana Rojas',
        description: 'Se inició la revisión del servicio de pagos y sus dependencias.',
      },
      {
        id: 'upd-4201',
        timestamp: minutesAgo(18),
        author: 'LogSentinel',
        description: 'Incidente creado al superar el umbral de latencia configurado.',
      },
    ],
  },
  {
    id: 'INC-0041',
    title: 'User API devuelve errores 503 consecutivos',
    description:
      'El gateway detectó indisponibilidad intermitente del servicio de usuarios durante tres solicitudes consecutivas.',
    severity: 'ERROR',
    application: 'User API',
    detectedAt: minutesAgo(31),
    updatedAt: minutesAgo(12),
    status: 'OPEN',
    assignee: 'Sin asignar',
    source: 'Regla: consecutive-5xx',
    relatedLogIds: ['log-2087'],
    updates: [
      {
        id: 'upd-4101',
        timestamp: minutesAgo(31),
        author: 'LogSentinel',
        description: 'Incidente creado después de tres respuestas 503 consecutivas.',
      },
    ],
  },
  {
    id: 'INC-0040',
    title: 'Incremento anómalo de accesos fallidos',
    description:
      'La cantidad de intentos de inicio de sesión fallidos excedió el límite esperado para una ventana de cinco minutos.',
    severity: 'WARNING',
    application: 'Auth Service',
    detectedAt: minutesAgo(46),
    updatedAt: minutesAgo(21),
    status: 'INVESTIGATING',
    assignee: 'Carlos Vega',
    source: 'Regla: failed-login-spike',
    relatedLogIds: ['log-2086'],
    updates: [
      {
        id: 'upd-4002',
        timestamp: minutesAgo(21),
        author: 'Carlos Vega',
        description: 'Se revisan las direcciones de origen y el patrón de las solicitudes.',
      },
      {
        id: 'upd-4001',
        timestamp: minutesAgo(46),
        author: 'LogSentinel',
        description: 'El volumen observado superó el umbral de seguridad.',
      },
    ],
  },
  {
    id: 'INC-0039',
    title: 'Evento de pago enviado a la cola de errores',
    description:
      'Un evento de conciliación agotó sus reintentos y fue movido a la cola de mensajes fallidos.',
    severity: 'ERROR',
    application: 'Billing Worker',
    detectedAt: minutesAgo(1630),
    updatedAt: minutesAgo(1510),
    status: 'RESOLVED',
    assignee: 'Ana Santos',
    source: 'Regla: reconciliation-failed',
    relatedLogIds: ['log-2076'],
    updates: [
      {
        id: 'upd-3902',
        timestamp: minutesAgo(1510),
        author: 'Ana Santos',
        description: 'El evento fue corregido, reprocesado y conciliado correctamente.',
      },
      {
        id: 'upd-3901',
        timestamp: minutesAgo(1630),
        author: 'LogSentinel',
        description: 'Incidente creado al agotarse cinco intentos de conciliación.',
      },
    ],
  },
  {
    id: 'INC-0038',
    title: 'Proveedores de notificaciones no disponibles',
    description:
      'Ninguno de los proveedores configurados aceptó mensajes; las notificaciones permanecieron en cola.',
    severity: 'CRITICAL',
    application: 'Notification Service',
    detectedAt: minutesAgo(4420),
    updatedAt: minutesAgo(4300),
    status: 'RESOLVED',
    assignee: 'Luis Gómez',
    source: 'Regla: providers-unavailable',
    relatedLogIds: ['log-2074'],
    updates: [
      {
        id: 'upd-3802',
        timestamp: minutesAgo(4300),
        author: 'Luis Gómez',
        description: 'El proveedor principal se recuperó y la cola pendiente fue procesada.',
      },
      {
        id: 'upd-3801',
        timestamp: minutesAgo(4420),
        author: 'LogSentinel',
        description: 'Incidente creado al fallar las tres rutas de entrega configuradas.',
      },
    ],
  },
  {
    id: 'INC-0037',
    title: 'Uso elevado del pool de conexiones',
    description:
      'El servicio de usuarios mantiene más del 75% de las conexiones de base de datos ocupadas.',
    severity: 'WARNING',
    application: 'User API',
    detectedAt: minutesAgo(7200),
    updatedAt: minutesAgo(6840),
    status: 'RESOLVED',
    assignee: 'Mariana Rojas',
    source: 'Regla: database-pool-usage',
    relatedLogIds: ['log-2078'],
    updates: [
      {
        id: 'upd-3702',
        timestamp: minutesAgo(6840),
        author: 'Mariana Rojas',
        description: 'Se ajustaron conexiones inactivas y la utilización regresó a niveles normales.',
      },
      {
        id: 'upd-3701',
        timestamp: minutesAgo(7200),
        author: 'LogSentinel',
        description: 'Incidente creado por uso sostenido del pool durante diez minutos.',
      },
    ],
  },
  {
    id: 'INC-0036',
    title: 'Latencia elevada en endpoints públicos',
    description:
      'La latencia del percentil 95 permaneció sobre 900 ms durante el periodo de evaluación.',
    severity: 'WARNING',
    application: 'API Gateway',
    detectedAt: minutesAgo(10120),
    updatedAt: minutesAgo(9960),
    status: 'RESOLVED',
    assignee: 'Carlos Vega',
    source: 'Regla: latency-p95',
    relatedLogIds: ['log-2083'],
    updates: [
      {
        id: 'upd-3602',
        timestamp: minutesAgo(9960),
        author: 'Carlos Vega',
        description: 'La latencia se normalizó después de ampliar las réplicas del gateway.',
      },
      {
        id: 'upd-3601',
        timestamp: minutesAgo(10120),
        author: 'LogSentinel',
        description: 'Incidente creado por incumplimiento del umbral de latencia.',
      },
    ],
  },
  {
    id: 'INC-0035',
    title: 'Configuración remota inaccesible',
    description:
      'La aplicación web utilizó su configuración local porque el servicio remoto no respondió a tiempo.',
    severity: 'ERROR',
    application: 'Web App',
    detectedAt: minutesAgo(12600),
    updatedAt: minutesAgo(12510),
    status: 'RESOLVED',
    assignee: 'Ana Santos',
    source: 'Regla: remote-config-failed',
    relatedLogIds: ['log-2081'],
    updates: [
      {
        id: 'upd-3502',
        timestamp: minutesAgo(12510),
        author: 'Ana Santos',
        description: 'Se restauró el acceso al servicio y se validó la configuración aplicada.',
      },
      {
        id: 'upd-3501',
        timestamp: minutesAgo(12600),
        author: 'LogSentinel',
        description: 'Incidente creado después de múltiples tiempos de espera agotados.',
      },
    ],
  },
  {
    id: 'INC-0034',
    title: 'Duración anormal del proceso de limpieza',
    description:
      'La limpieza programada de sesiones superó en más de 50 segundos el tiempo esperado.',
    severity: 'WARNING',
    application: 'Auth Service',
    detectedAt: minutesAgo(14800),
    updatedAt: minutesAgo(14620),
    status: 'OPEN',
    assignee: 'Sin asignar',
    source: 'Regla: scheduled-job-duration',
    relatedLogIds: ['log-2072'],
    updates: [
      {
        id: 'upd-3401',
        timestamp: minutesAgo(14800),
        author: 'LogSentinel',
        description: 'Incidente creado por duración fuera del rango esperado.',
      },
    ],
  },
]
