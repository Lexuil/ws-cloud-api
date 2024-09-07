# File

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media)

The `sendFile` function allows you to send various types of files to a WhatsApp number using a Blob (binary data).

```ts
async function sendFile({
  to,
  file,
  config,
}: {
  to: string;
  file: Blob;
  config?: WsConfig;
}): Promise<boolean>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `file`: A Blob object representing the file to send (e.g., images, documents, audio, or video).
- `config`: Optional configuration settings.

## Return

- **Success:** True for success, false for fail.

## [Supported files](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media/?locale=es_ES#supported-media-types):

- Images:
  - image/jpeg
  - image/png
- Documents:
  - text/plain
  - application/pdf
  - application/vnd.ms-powerpoint
  - application/msword
  - application/vnd.ms-excel
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - application/vnd.openxmlformats-officedocument.presentationml.presentation
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Audio:
  - audio/aac
  - audio/mp4
  - audio/mpeg
  - audio/amr
  - audio/ogg
  - audio/opus
- Video:
  - video/mp4
  - video/3gp

## Example usage

```ts
import { sendFile } from "ws-cloud-api/messaging";
import fs from "fs";
import path from "path";

const file = new Blob([fs.readFileSync(path.join(__dirname, "/file.pdf"))], {
  type: "application/pdf",
});

sendFile({
  to: "573123456789",
  file: file,
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("File sent");
    }
  })
  .catch(console.error);
```