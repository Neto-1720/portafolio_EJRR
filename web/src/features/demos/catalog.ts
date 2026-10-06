export const demos = [
  {
    id: 'logistics',
    path: '/demo/logistics',
    projectSlug: 'saas-logistics-platform',
    title: 'Logistics dashboard',
    summary:
      'Counts and a filterable table over the fictional shipments already stored for this portfolio.',
  },
  {
    id: 'notifications',
    path: '/demo/notifications',
    projectSlug: 'multichannel-notifications',
    title: 'Notification desk',
    summary:
      'A list of fictional notices. Simulate send only updates the record. Nothing leaves this app.',
  },
  {
    id: 'tracking',
    path: '/demo/tracking',
    projectSlug: 'white-label-tracking',
    title: 'White-label tracking',
    summary:
      'One tracking layout. The brand, accent, and message come from a local configuration.',
  },
  {
    id: 'support',
    path: '/demo/support',
    projectSlug: 'customer-support-desk',
    title: 'Support desk',
    summary:
      'Pick a fictional conversation, read the thread, and change its status.',
  },
  {
    id: 'legacy',
    path: '/demo/legacy',
    projectSlug: 'legacy-modernization',
    title: 'Legacy and modern',
    summary:
      'The same screen list, shown as a classic table and as a component-based view.',
  },
] as const

export type DemoEntry = (typeof demos)[number]

export function demoForProject(slug: string): DemoEntry | null {
  return demos.find((demo) => demo.projectSlug === slug) ?? null
}
