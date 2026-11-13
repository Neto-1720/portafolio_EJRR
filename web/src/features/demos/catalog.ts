export const demos = [
  {
    id: 'logistics',
    path: '/demo/logistics',
    projectSlug: 'saas-logistics-platform',
    title: 'Panel de logística',
    summary:
      'Vista de conteos y tabla filtrable sobre envíos ficticios. Sirve para mostrar cómo se consulta el ciclo de un envío sin conectar paqueterías reales.',
  },
  {
    id: 'notifications',
    path: '/demo/notifications',
    projectSlug: 'multichannel-notifications',
    title: 'Mesa de notificaciones',
    summary:
      'Lista de avisos ficticios por canal. “Simular envío” solo marca el registro como enviado: no sale correo ni WhatsApp de verdad. El case study cuenta el producto completo.',
  },
  {
    id: 'tracking',
    path: '/demo/tracking',
    projectSlug: 'white-label-tracking',
    title: 'Rastreo white-label',
    summary:
      'Un solo layout de seguimiento. Cambias marca, acento y mensaje desde configuración local para ver cómo se reutiliza la misma pantalla con distinta identidad.',
  },
  {
    id: 'support',
    path: '/demo/support',
    projectSlug: 'customer-support-desk',
    title: 'Mesa de atención',
    summary:
      'Elige una conversación ficticia, lee el hilo y cambia el estado del caso. Es el recorte de la bandeja: lista + conversación, sin WhatsApp en vivo.',
  },
  {
    id: 'legacy',
    path: '/demo/legacy',
    projectSlug: 'legacy-modernization',
    title: 'Legacy y moderno',
    summary:
      'La misma lista de pantallas en vista clásica (tabla) y en vista de componentes. Ilustra una migración por partes sin apagar lo que sigue en producción.',
  },
] as const

export type DemoEntry = (typeof demos)[number]

export function demoForProject(slug: string): DemoEntry | null {
  return demos.find((demo) => demo.projectSlug === slug) ?? null
}
