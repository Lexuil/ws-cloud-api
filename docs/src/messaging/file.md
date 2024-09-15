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

> [!IMPORTANT]
> You can see the supported files types in [limitations section](../limitations/media.md).

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