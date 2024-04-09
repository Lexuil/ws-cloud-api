import { type WebhookSubscribeQuery } from './types/webhook'

export function verifyWebhook (input: WebhookSubscribeQuery): {
  statusCode: 200 | 401
  body?: string
} {
  if (input['hub.mode'] !== 'subscribe' &&
  input['hub.verify_token'] !== process.env.WS_VERIFY_TOKEN) {
    return {
      statusCode: 401
    }
  }

  return {
    statusCode: 200,
    body: input['hub.challenge']
  }
}
