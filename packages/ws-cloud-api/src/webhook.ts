import { WsApi } from './ws-api'
import type { WsConfig } from './types/config'
import type { MessageStatus } from './types/enums'
import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export function verifyWebhook(input: WebhookSubscribeQuery): { statusCode: 200 | 401, body?: string } {
  return getClient().verifyWebhook(input)
}

export async function handleWebhook(input: WsRequest, config?: WsConfig): Promise<
  | { type: 'statusUpdate', messageId: string, userId: string, status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed } |
  { type: 'message', from: string, id: string, message: string, source: 'user' | 'button' | 'list' | 'flow' } |
  { type: 'media', from: string, id: string, blob: Blob, mimeType: string, message: string, source: 'user' | 'button' | 'list' | 'flow' } |
  { type: 'flowReply', from: string, id: string, data: Record<string, unknown> } |
  { type: 'reaction', from: string, id: string, emoji: string } |
  undefined
> {
  return await getClient(config).handleWebhook(input)
}
