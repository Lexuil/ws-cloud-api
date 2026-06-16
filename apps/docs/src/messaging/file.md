# File

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media)

The `sendFile` method takes a `Blob` directly, uploads it to WhatsApp, and then sends it as the appropriate message type (image, video, audio, or document) based on the blob's MIME type. This is a one-call alternative to `uploadMedia` followed by `sendImage` / `sendVideo` / `sendAudio` / `sendDocument`.

```ts
async sendFile({
  to,
  data
}: {
  to: string
  data: { file: Blob; caption?: string; filename?: string }
}): Promise<
  Result<
    MessageResponse,
    ErrorBuilder<{ code: 'UNSUPPORTED_MEDIA_TYPE' | 'UPLOAD_MEDIA_ERROR' | 'SEND_FILE_MESSAGE_ERROR' }>
  >
>
```

## Parameters

- `to`: Recipient phone number.
- `data.file`: A `Blob` representing the file. Its `type` (MIME) determines whether it's sent as image/video/audio/document.
- `data.caption`: Optional caption (used for image/video/document).
- `data.filename`: Optional filename (used for document).

## Return

A `Result`.

- **Ok** — `MessageResponse`.
- **Err** — `code` is one of:
  - `UNSUPPORTED_MEDIA_TYPE` — the blob's MIME type is not in the supported list.
  - `UPLOAD_MEDIA_ERROR` — the upload step failed.
  - `SEND_FILE_MESSAGE_ERROR` — the underlying `sendImage` / `sendVideo` / `sendAudio` / `sendDocument` call failed.

> [!IMPORTANT]
> See [Supported files](../limitations/media.md) for the MIME types this method accepts.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'
import { readFileSync } from 'node:fs'

const ws = new WsApi()

const file = new Blob([readFileSync('file.pdf')], { type: 'application/pdf' })

const result = await ws.sendFile({ to: '573123456789', data: { file, filename: 'file.pdf' } })

result.match(
  (response) => console.log('File sent:', response.messages[0].id),
  (error) => console.error('Failed:', error.code)
)
```
