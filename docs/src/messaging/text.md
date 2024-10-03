# Text

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages)

![text message](img/text.png)

The `sendText` function allows you to send a simple text message to a WhatsApp number.

```ts
async function sendText({
  to,
  message,
  previewUrl,
  config,
}: {
  to: string;
  message: string;
  previewUrl?: boolean;
  config?: WsConfig;
}): Promise<SendMessageResponse>;
```

## Parameters:

- `to:` The WhatsApp phone number recipient, including country code.
- `message:` The text message to send.
- `previewUrl:` Set to true if the message contains a link and you want to include a link preview.

## Return:

- **Success:** True for success, false for fail.
- **Response:** Information about the message sent, like the message ID, delivery status, and more.

## Example Usage:

```ts
import { sendText } from 'ws-cloud-api/messaging'

sendText({
  to: '573123456789,
  message: 'This is a test message'
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message sent")
    }
  })
  .catch(console.error)

// Preview URL
sendText({
  to: '573123456789,
  message: 'https://www.youtube.com/watch?v=L9jpMYn8q0g&pp=ygUjeW91IHRvIHlvdSBhc2lhbiBrdW5nIGZ1IGdlbmVyYXRpb24%3D',
  previewUrl: true
})
  .then((response) => {
    if (response.success) {
      console.log('Message with preview sent')
    }
  })
  .catch(console.error)
```
