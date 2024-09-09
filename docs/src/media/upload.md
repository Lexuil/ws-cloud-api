# Upload Media

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#upload-media)

The `uploadMedia` function allows you to upload media (such as images, videos, or documents) to WhatsApp using a Blob file.

```ts
async function uploadMedia({
  media,
  config,
}: {
  media: Blob;
  config?: WsConfig;
}): Promise<string>;
```

## Parameters:

- `media`: The Blob file to upload.
- `config`: Optional configuration settings.


## Return

- **Success:** Returns the media ID as a string on successful upload.

> [!IMPORTANT]
> You can see the supported files types in [limitations section](../limitations/media.md).

## Example usage

```ts
import { uploadMedia } from 'ws-cloud-api/media'
import fs from 'fs'
import path from 'path'

const mediaBlob = new Blob([fs.readFileSync(path.join(__dirname, '/image.jpg'))], {
  type: 'image/jpeg',
})

uploadMedia({
  media: mediaBlob,
})
  .then((mediaId) => {
    if (mediaId) {
      console.log('Media uploaded successfully, ID: ' + mediaId)
    }
  })
  .catch(console.error)
```