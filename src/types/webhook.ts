export interface WebhookSubscribeQuery {
  'hub.mode': 'subscribe'
  'hub.challenge': string
  'hub.verify_token': string
}
