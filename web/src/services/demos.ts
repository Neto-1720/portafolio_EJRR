import { ApiError, requestJson, sendJson } from './api.ts'
import {
  isRecord,
  readData,
  readDataRecord,
  readNullableString,
  readNumber,
  readString,
} from './parse.ts'

export type DemoShipment = {
  id: number
  tracking_number: string
  customer: string
  origin: string
  destination: string
  carrier: string
  status: string
  estimated_delivery: string | null
}

export type ShipmentDashboard = {
  shipments: DemoShipment[]
  total: number
  inTransit: number
  delivered: number
  exceptions: number
  carriers: string[]
}

export type DemoNotification = {
  id: number
  event: string
  channel: string
  recipient: string
  status: string
  sent_at: string | null
}

export type DemoConversation = {
  id: number
  customer_name: string
  customer_identifier: string | null
  status: string
  assigned_to: string | null
  last_message_at: string | null
  preview: string | null
}

export type DemoMessage = {
  id: number
  sender_type: string
  content: string
  sent_at: string | null
}

export type DemoConversationDetail = Omit<DemoConversation, 'preview'> & {
  messages: DemoMessage[]
}

export function getDemoShipments(
  query: string,
  signal?: AbortSignal,
): Promise<ShipmentDashboard> {
  const path = query ? `/api/demo/shipments?${query}` : '/api/demo/shipments'

  return requestJson(path, signal).then(readShipmentDashboard)
}

export function getDemoNotifications(
  query: string,
  signal?: AbortSignal,
): Promise<DemoNotification[]> {
  const path = query
    ? `/api/demo/notifications?${query}`
    : '/api/demo/notifications'

  return requestJson(path, signal).then((body) =>
    readData(body).map(readNotification),
  )
}

export function simulateDemoNotification(
  id: number,
  signal?: AbortSignal,
): Promise<DemoNotification> {
  return sendJson(
    `/api/demo/notifications/${id}/simulate`,
    'POST',
    {},
    signal,
  ).then((body) => readNotification(readDataRecord(body)))
}

export function getDemoConversations(
  query: string,
  signal?: AbortSignal,
): Promise<DemoConversation[]> {
  const path = query
    ? `/api/demo/conversations?${query}`
    : '/api/demo/conversations'

  return requestJson(path, signal).then((body) =>
    readData(body).map(readConversation),
  )
}

export function getDemoConversation(
  id: number,
  signal?: AbortSignal,
): Promise<DemoConversationDetail> {
  return requestJson(`/api/demo/conversations/${id}`, signal).then((body) =>
    readConversationDetail(readDataRecord(body)),
  )
}

export function updateDemoConversationStatus(
  id: number,
  status: string,
  signal?: AbortSignal,
): Promise<DemoConversationDetail> {
  return sendJson(
    `/api/demo/conversations/${id}`,
    'PATCH',
    { status },
    signal,
  ).then((body) => readConversationDetail(readDataRecord(body)))
}

function readShipmentDashboard(body: unknown): ShipmentDashboard {
  if (!isRecord(body) || !isRecord(body.meta)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  const carriers = body.meta.carriers

  if (
    !Array.isArray(carriers) ||
    carriers.some((item) => typeof item !== 'string')
  ) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    shipments: readData(body).map(readShipment),
    total: readNumber(body.meta.total),
    inTransit: readNumber(body.meta.in_transit),
    delivered: readNumber(body.meta.delivered),
    exceptions: readNumber(body.meta.exceptions),
    carriers,
  }
}

function readShipment(value: unknown): DemoShipment {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    tracking_number: readString(row.tracking_number),
    customer: readString(row.customer),
    origin: readString(row.origin),
    destination: readString(row.destination),
    carrier: readString(row.carrier),
    status: readString(row.status),
    estimated_delivery: readNullableString(row.estimated_delivery),
  }
}

function readNotification(value: unknown): DemoNotification {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    event: readString(row.event),
    channel: readString(row.channel),
    recipient: readString(row.recipient),
    status: readString(row.status),
    sent_at: readNullableString(row.sent_at),
  }
}

function readConversation(value: unknown): DemoConversation {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    customer_name: readString(row.customer_name),
    customer_identifier: readNullableString(row.customer_identifier),
    status: readString(row.status),
    assigned_to: readNullableString(row.assigned_to),
    last_message_at: readNullableString(row.last_message_at),
    preview: readNullableString(row.preview),
  }
}

function readConversationDetail(
  row: Record<string, unknown>,
): DemoConversationDetail {
  if (!Array.isArray(row.messages)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return {
    id: readNumber(row.id),
    customer_name: readString(row.customer_name),
    customer_identifier: readNullableString(row.customer_identifier),
    status: readString(row.status),
    assigned_to: readNullableString(row.assigned_to),
    last_message_at: readNullableString(row.last_message_at),
    messages: row.messages.map(readMessage),
  }
}

function readMessage(value: unknown): DemoMessage {
  const row = readRow(value)

  return {
    id: readNumber(row.id),
    sender_type: readString(row.sender_type),
    content: readString(row.content),
    sent_at: readNullableString(row.sent_at),
  }
}

function readRow(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ApiError('La respuesta del backend no tiene el formato esperado.')
  }

  return value
}
