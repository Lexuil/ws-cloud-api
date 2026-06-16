# Upload Media

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media)

The `uploadMedia` method uploads a media `Blob` to WhatsApp and returns the media ID for use in subsequent messages.

```ts
async uploadMedia({
  media
}: {
  media: Blob
}): Promise<
  Result<
    { mediaId: string },
    ErrorBuilder<{ code: 'UNSUPPORTED_MEDIA_TYPE' | 'UPLOAD_MEDIA_ERROR' }>
  >
>
```

## Parameters

- `media`: The `Blob` to upload. The blob's `type` must be one of the [supported MIME types](../limitations/media.md).

## Return

A `Result`.

- **Ok** — `{ mediaId: string }`. The returned ID is the value to use in `image.id`, `video.id`, etc. when sending a media message.
- **Err** — `code` is one of:
  - `UNSUPPORTED_MEDIA_TYPE` — the `Blob.type` is not in the supported list.
  - `UPLOAD_MEDIA_ERROR` — the underlying HTTP request failed.

> [!IMPORTANT]
> See the [limitations](../limitations/media.md) page for the supported MIME types.

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'
import { readFileSync } from 'node:fs'

const ws = new WsApi()

const mediaBlob = new Blob([readFileSync('image.jpg')], { type: 'image/jpeg' })

const result = await ws.uploadMedia({ media: mediaBlob })

result.match(
  ({ mediaId }) => console.log('Uploaded, ID:', mediaId),
  (error) => console.error('Upload failed:', error.code)
)
```
