# Webhook messages

The `handleWebhook` function processes the incoming messages from WhatsApp and returns the message type.

```ts
function handleWebhook (input: WsRequest): {
  type: 'statusUpdate'
  messageId: string
  userId: string
  status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed
} | {
  type: 'message'
  from: string
  message: string
  source: Source
} | {
  type: 'voiceAudio'
  from: string
  audio: {
    id: string
    mimeType: string
  }
} | {
  type: 'flowReply'
  from: string
  data: Record<string, unknown>
} | undefined
```

## Parameters

- `input`: The incoming message from WhatsApp.

## Return

### `statusUpdate`

- `type`: statusUpdate
- `messageId`: The message ID.
- `userId`: The user ID.
- `status`: The status of the message.

### `message`

- `type`: message
- `from`: The phone number of the sender.
- `message`: The text message.
- `source`: The source of the message.

### `voiceAudio`

- `type`: voiceAudio
- `from`: The phone number of the sender.
- `audio`: The audio message.
- `mimeType`: The MIME type of the audio.

### `flowReply`

- `type`: flowReply
- `from`: The phone number of the sender.
- `data`: The data of the flow reply.

## Example usage

```ts
import { handleWebhook } from 'ws-cloud-api/webhook'

app.post('/whatsapp-webhook', (req, res) => {
  const message = handleWebhook(req.body)

  if (message === undefined) {
    res.status(200).send('OK')
    return
  }

  if (message.type === 'statusUpdate') {
    console.log('Status update from WhatsApp:', message.messageId, ' --- ', message.status)
  }

  if (message.type === 'message') {
    console.log('New message from WhatsApp:', message.from, ' --- ', message.message)
  }

  if (message.type === 'voiceAudio') {
    console.log('New voice audio from WhatsApp:', message.from, ' --- ', message.audio.id)
  }

  if (message.type === 'flowReply') {
    console.log('Flow reply from WhatsApp:', message.from, ' --- ', message.data)
  }

  res.status(200).send('OK')
})
```

## Voice audio full example

```ts
import { handleWebhook } from 'ws-cloud-api/webhook'

app.post('/whatsapp-webhook', async (req, res) => {
  const message = handleWebhook(req.body)

  if (message === undefined) {
    res.status(200).send('OK')
    return
  }

  if (message.type === 'voiceAudio') {
    const audioUrl = await getMediaUrl({
      mediaId: message.audio.id
    })

    const audioFile = await getMedia({
      mediaUrl: audioUrl
    })

    console.log('New voice message', message.from, ' --- ', audioFile)
  }

  res.status(200).send('OK')
})
```