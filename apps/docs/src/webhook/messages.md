# Webhook messages

The `handleWebhook` method on `WsApi` processes incoming messages from WhatsApp and returns a discriminated union describing the event.

```ts
async handleWebhook(
  input: WsRequest
): Promise<
  Result<
    | {
        type: 'statusUpdate'
        messageId: string
        userId: string
        status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed
      }
    | { type: 'message'; from: string; id: string; message: string; source: Source }
    | {
        type: 'media'
        from: string
        id: string
        blob: Blob
        mimeType: string
        message: string // caption, or '' if no caption
        source: 'user'
      }
    | { type: 'flowReply'; from: string; id: string; data: Record<string, unknown> }
    | { type: 'reaction'; from: string; id: string; emoji: string }
    | undefined,
    ErrorBuilder<{ code: 'GET_MEDIA_URL_ERROR' | 'GET_MEDIA_ERROR' | 'INVALID_FLOW_REPLY' }>
  >
>
```

## Parameters

- `input`: The incoming message from WhatsApp. Must satisfy the `WsRequest` shape — see the `WhatsApp Webhooks` payload format.

## Return

A `Result` from `neverthrow`. Always check `isErr()` first.

- **Err branch** carries an `ErrorBuilder` with one of:
  - `GET_MEDIA_URL_ERROR` — failed to look up the media URL for an incoming image/video/document/sticker/audio message.
  - `GET_MEDIA_ERROR` — failed to download the media bytes.
  - `INVALID_FLOW_REPLY` — the `nfm_reply.response_json` field was not a valid JSON object.

- **Ok branch** carries one of these event shapes (or `undefined` if the event didn't match the configured `phoneNumberId`):

### `statusUpdate`

- `type`: `'statusUpdate'`
- `messageId`: The message ID whose status changed.
- `userId`: The recipient's WhatsApp ID.
- `status`: `'read' | 'delivered' | 'sent' | 'failed'`.

### `message`

Text, button reply, or list reply. Source distinguishes them.

- `type`: `'message'`
- `from`: The sender's phone number.
- `id`: The message ID.
- `message`: The body (text), or the button/list reply ID.
- `source`: `'user' | 'button' | 'list' | 'flow'`.

### `media`

- `type`: `'media'`
- `from`: The sender's phone number.
- `id`: The media ID on the WhatsApp side.
- `blob`: The downloaded binary content as a `Blob`.
- `mimeType`: The MIME type as reported by WhatsApp (e.g. `image/jpeg`, `audio/ogg; codecs=opus`).
- `message`: The caption if any, or `''`.
- `source`: always `'user'`.

### `flowReply`

- `type`: `'flowReply'`
- `from`: The sender's phone number.
- `id`: The message ID.
- `data`: The flow's response payload, parsed from the `response_json` field. Validated as a non-null JSON object — anything else returns `INVALID_FLOW_REPLY`.

### `reaction`

- `type`: `'reaction'`
- `from`: The sender's phone number.
- `id`: The ID of the message that was reacted to.
- `emoji`: The emoji used in the reaction.

## Example usage

```ts
import express from 'express'
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()
const app = express()

app.use(express.json())

app.post('/whatsapp-webhook', async (req, res) => {
  const result = await ws.handleWebhook(req.body)

  if (result.isErr()) {
    console.error('Webhook processing failed:', result.error.code)
    res.status(500).send('Internal error')
    return
  }

  const event = result.value
  if (event === undefined) {
    res.status(200).send('OK')
    return
  }

  switch (event.type) {
    case 'statusUpdate':
      console.log('Status update:', event.messageId, event.status)
      break
    case 'message':
      console.log(`New message from ${event.from}: ${event.message}`)
      break
    case 'media':
      console.log(`New ${event.mimeType} from ${event.from}, ${event.blob.size} bytes`)
      break
    case 'flowReply':
      console.log('Flow reply from', event.from, 'data:', event.data)
      break
    case 'reaction':
      console.log(`${event.from} reacted with ${event.emoji}`)
      break
  }

  res.status(200).send('OK')
})
```

## Voice audio — handling media on the receive side

The `media` event has already downloaded the blob for you. If you need the original URL or want to re-download separately, use `getMediaUrl` and `getMedia` on the same `WsApi` instance.

```ts
app.post('/whatsapp-webhook', async (req, res) => {
  const result = await ws.handleWebhook(req.body)

  if (result.isOk() && result.value?.type === 'media') {
    console.log('Got media:', result.value.mimeType, result.value.blob)
  }

  res.status(200).send('OK')
})
```
