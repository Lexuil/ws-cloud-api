# Audio

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages)

![audio message](img/audio.png)

The `sendAudio` function allows you to send an audio file to a WhatsApp number using a direct URL.

```ts
async function sendAudio({
  to,
  link,
  config,
}: {
  to: string;
  link: string;
  config?: WsConfig;
}): Promise<SendMessageResponse>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `link`: The URL of the audio file to send.
- `config`: Optional configuration settings.


## Return
- **Success:** True for success, false for fail.
- **Response:** Information about the message sent, like the message ID, delivery status, and more.


## Example usage

```ts
import { sendAudio } from "ws-cloud-api/messaging";

sendAudio({
  to: "573123456789",
  link: "https://example.com/audio.mp3",
})
  .then((response) => {
    if (response.success) {
      console.log("Audio sent");
    }
  })
  .catch(console.error);
```