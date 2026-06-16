# Get Media as Blob

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#get-media)

The `getMedia` method downloads the binary content of a media asset as a `Blob` from the URL returned by `getMediaUrl`.

```ts
async getMedia({
  mediaUrl
}: {
  mediaUrl: string
}): Promise<Result<Blob, ErrorBuilder<{ code: 'GET_MEDIA_ERROR' }>>>
```

## Parameters

- `mediaUrl`: The short-lived URL returned by `getMediaUrl`.

## Return

A `Result`.

- **Ok** — a `Blob` containing the binary content. The `Blob.type` is whatever the server returns.
- **Err** — `code: 'GET_MEDIA_ERROR'` if the download fails (network, expired URL, etc.).

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const urlResult = await ws.getMediaUrl({ mediaId: 'MEDIA_ID' })
if (urlResult.isErr()) return

const blobResult = await ws.getMedia({ mediaUrl: urlResult.value.mediaUrl })
if (blobResult.isErr()) {
  console.error('Download failed:', blobResult.error.code)
  return
}

console.log('Downloaded', blobResult.value.size, 'bytes')
```
