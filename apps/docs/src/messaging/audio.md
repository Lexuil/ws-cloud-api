# Audio

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages)

![audio message](img/audio.png)

The `sendAudio` method sends an audio file by media ID or direct URL.

```ts
async sendAudio({
  to,
  data
}: {
  to: string
  data: { id?: string; link?: string; voice?: boolean }
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_AUDIO_MESSAGE_ERROR' }>>>
```

Provide exactly one of `id` or `link`. `voice: true` marks the audio as a voice note in the WhatsApp UI.

## Parameters

- `to`: Recipient phone number.
- `data.id`: Media ID returned by `uploadMedia`.
- `data.link`: Direct URL to the audio file.
- `data.voice`: `true` to render as a voice note in the recipient's client.

## Return

A `Result`.

- **Ok** — `MessageResponse`.
- **Err** — `code: 'SEND_AUDIO_MESSAGE_ERROR'`.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

await ws.sendAudio({ to: '573123456789', data: { link: 'https://example.com/audio.mp3' } })
```
