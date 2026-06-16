# Image

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/image-messages)

![image message](img/image.png)

The `sendImage` method sends an image by either media ID (after `uploadMedia`) or a direct URL.

```ts
async sendImage({
  to,
  data
}: {
  to: string
  data: { id?: string; link?: string; caption?: string }
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_IMAGE_MESSAGE_ERROR' }>>>
```

Provide exactly one of `id` or `link`. `caption` is optional.

## Parameters

- `to`: Recipient phone number.
- `data.id`: Media ID returned by `uploadMedia`.
- `data.link`: Direct URL to the image (downloaded by WhatsApp).
- `data.caption`: Optional caption shown beneath the image.

## Return

A `Result`.

- **Ok** — `MessageResponse`.
- **Err** — `code: 'SEND_IMAGE_MESSAGE_ERROR'`.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

// Using a direct URL
await ws.sendImage({ to: '573123456789', data: { link: 'https://example.com/image.jpg' } })

// Using an uploaded media ID, with caption
await ws.sendImage({ to: '573123456789', data: { id: 'MEDIA_ID', caption: 'Look at this' } })
```
