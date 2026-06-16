# Text with WhatsApp Flow

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-flow-messages)

The `sendFlowMessage` method sends a text message that starts a [WhatsApp Flow](https://developers.facebook.com/docs/whatsapp/flows) when tapped. The recipient's response comes back as a `flowReply` event in `handleWebhook`.

```ts
async sendFlowMessage({
  to,
  data
}: {
  to: string
  data: {
    text: string
    parameters: {
      flow_id?: string
      flow_token?: string
      flow_cta?: string
      flow_action_payload?: Record<string, unknown>
    }
  }
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_FLOW_MESSAGE_ERROR' }>>>
```

## Parameters

- `to`: Recipient phone number.
- `data.text`: The body text shown above the flow CTA.
- `data.parameters`: Flow launch parameters — `flow_id`, `flow_token`, `flow_cta` (button text), and an optional `flow_action_payload` for prefilled data.

## Return

A `Result`.

- **Ok** — `MessageResponse`.
- **Err** — `code: 'SEND_FLOW_MESSAGE_ERROR'`.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

await ws.sendFlowMessage({
  to: '573123456789',
  data: {
    text: 'Test flow message',
    parameters: {
      flow_id: process.env.FLOW_ID ?? '',
      flow_token: 'exampleToken',
      flow_cta: 'View Flow'
    }
  }
})
```

## Receiving the reply

When the user completes the flow, `handleWebhook` returns an event with `type: 'flowReply'`. The `data` field carries whatever JSON the flow returned. See [Webhook messages](../webhook/messages#flowreply).
