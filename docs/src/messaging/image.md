# Image

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/image-messages)

![image message](img/image.png)

The `sendImage` function allows you to send an image to a WhatsApp number using a direct URL.

```ts
async function sendImage({
  to,
  link,
  config,
}: {
  to: string;
  link: string;
  config?: WsConfig;
}): Promise<SendMessageResponse>;
```

> [!NOTE]
> Support for **caption** coming soon.

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `link`: The URL of the image to send.
- `config`: Optional configuration settings.

## Return

- **Success:** True for success, false for fail.
- **Response:** Information about the message sent, like the message ID, delivery status, and more.

## Example usage

```ts
import { sendImage } from "ws-cloud-api/messaging";

sendImage({
  to: "573123456789",
  link: "https://example.com/image.jpg",
})
  .then((response) => {
    if (response.success) {
      console.log("Image sent");
    }
  })
  .catch(console.error);
```
