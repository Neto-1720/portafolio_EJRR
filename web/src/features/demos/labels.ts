export const shipmentStatuses = [
  { value: 'created', label: 'Created', tone: 'neutral' },
  { value: 'picked_up', label: 'Picked up', tone: 'info' },
  { value: 'in_transit', label: 'In transit', tone: 'info' },
  { value: 'out_for_delivery', label: 'Out for delivery', tone: 'warning' },
  { value: 'delivered', label: 'Delivered', tone: 'success' },
  { value: 'exception', label: 'Exception', tone: 'danger' },
] as const

export const notificationChannels = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const

export const notificationStatuses = [
  { value: 'pending', label: 'Pending', tone: 'warning' },
  { value: 'sent', label: 'Sent', tone: 'success' },
  { value: 'failed', label: 'Failed', tone: 'danger' },
] as const

export const conversationStatuses = [
  { value: 'open', label: 'Open', tone: 'info' },
  { value: 'pending', label: 'Pending', tone: 'warning' },
  { value: 'closed', label: 'Closed', tone: 'neutral' },
] as const

export const senderLabels: Record<string, string> = {
  customer: 'Customer',
  agent: 'Agent',
  bot: 'Bot',
  system: 'System',
}

type Labeled = readonly { value: string; label: string }[]

export function labelFor(options: Labeled, value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

export function toneFor(
  options: readonly { value: string; tone: StatusTone }[],
  value: string,
): StatusTone {
  return options.find((option) => option.value === value)?.tone ?? 'neutral'
}

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
