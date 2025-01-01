# Get Media URL

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#retrieve-media-url)

The `getMediaUrl` function allows you to retrieve the URL of uploaded media using its media ID.

```ts
async function getMediaUrl({
  mediaId,
  config,
}: {
  mediaId: string;
  config?: WsConfig;
}): Promise<string>;
```

## Parameters:

- `mediaId`: The ID of the media to retrieve the URL for.
- `config`: Optional configuration settings.

## Return

- **Success:** Returns the URL of the media as a string on successful retrieval.

## Example usage

```ts
import { getMediaUrl } from 'ws-cloud-api/media'

getMediaUrl({ mediaId: 'mediaId' })
  .then((url) => {
    if (url) {
      console.log('Media URL: ' + url)
    }
  })
  .catch(console.error)
```