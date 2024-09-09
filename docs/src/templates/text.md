# Send Text Template

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `sendTextTemplate` function allows you to send a text message template to a WhatsApp number.

```ts
async function sendTextTemplate({
  to,
  templateName,
  language,
  config,
}: {
  to: string;
  templateName: string;
  language: string;
  config?: WsConfig;
}): Promise<boolean>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `templateName`: The name of the pre-configured template to send.
- `language`: The language code for the template (e.g., en_US).
- `config`: Optional configuration settings.

## Return

- Success: True for success, false for fail.

## Example usage

```ts
import { sendTextTemplate } from 'ws-cloud-api/templates'

sendTextTemplate({
  to: '573123456789',
  templateName: 'hello_world',
  language: 'en_US',
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log('Template message sent')
    }
  })
  .catch(console.error)
```