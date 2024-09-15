# Get Media as Blob

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#get-media)

The `getMedia` function allows you to retrieve media content as a Blob using its URL.

```ts
async function getMedia({
  mediaUrl,
  config,
}: {
  mediaUrl: string;
  config?: WsConfig;
}): Promise<Blob>;
```

## Parameters:

- `mediaUrl`: The URL of the media to retrieve.
- `config`: Optional configuration settings.

## Return

- **Success:** Returns the media content as a Blob on successful retrieval.

## Example usage

```ts
import { getMedia } from 'ws-cloud-api/media'

getMedia({ mediaUrl: 'mediaUrl' })
  .then((blob) => {
    if (blob) {
      console.log('Media Blob: ', blob)
    }
  })
  .catch(console.error)
```