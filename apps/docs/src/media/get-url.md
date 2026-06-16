# Get Media URL

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#retrieve-media-url)

The `getMediaUrl` method retrieves the download URL of an uploaded media asset using its WhatsApp-side media ID.

```ts
async getMediaUrl({
  mediaId
}: {
  mediaId: string
}): Promise<Result<{ mediaUrl: string }, ErrorBuilder<{ code: 'GET_MEDIA_URL_ERROR' }>>>
```

## Parameters

- `mediaId`: The media ID returned by `uploadMedia` (or included on an incoming message).

## Return

A `Result`.

- **Ok** — `{ mediaUrl: string }`. The URL is short-lived; download with `getMedia` quickly.
- **Err** — `code: 'GET_MEDIA_URL_ERROR'` if the request fails (network, 401, etc.).

## Example usage

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.getMediaUrl({ mediaId: 'MEDIA_ID' })

result.match(
  ({ mediaUrl }) => console.log('Media URL:', mediaUrl),
  (error) => console.error('Lookup failed:', error.code)
)
```
