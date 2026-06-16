# Text

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages)

![text message](img/text.png)

The `sendText` method sends a plain text message.

```ts
async sendText({
  to,
  message,
  previewUrl
}: {
  to: string
  message: string
  previewUrl?: boolean
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TEXT_MESSAGE_ERROR' }>>>
```

## Parameters

- `to`: Recipient phone number, including country code.
- `message`: The text to send.
- `previewUrl`: Set to `true` if `message` contains a URL and you want a link preview rendered.

## Return

A `Result`.

- **Ok** — `MessageResponse` containing the sent message's `id` and metadata.
- **Err** — `code: 'SEND_TEXT_MESSAGE_ERROR'`.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.sendText({ to: '573123456789', message: 'This is a test message' })

result.match(
  (response) => console.log('Sent:', response.messages[0].id),
  (error) => console.error('Failed:', error.code)
)
```

### With link preview

```ts
await ws.sendText({ to: '573123456789', message: 'https://example.com/article', previewUrl: true })
```
