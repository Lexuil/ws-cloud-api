# Send Text Template

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `sendTextTemplate` function allows you to send a text message template to a WhatsApp number.

```ts
async function sendTextTemplate({
  to,
  templateName,
  language,
  parameters,
  config,
}: {
  to: string;
  templateName: string;
  language: string;
  parameters?:   parameters?: TemplateParameter[];
  config?: WsConfig;
}): Promise<boolean>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `templateName`: The name of the pre-configured template to send.
- `language`: The language code for the template (e.g., en_US).
- `parameters`: Optional parameters to customize the template.
- `config`: Optional configuration settings.

## Return

- **Success:** True for success, false for fail.

## Example usage

### Send a text template

```ts
import { sendTextTemplate } from 'ws-cloud-api/templates'

sendTextTemplate({
  to: '573123456789',
  templateName: 'hello_world',
  language: 'en_US'
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log('Template message sent')
    }
  })
  .catch(console.error)
```

### Send a text template with parameters

```ts
import { sendTextTemplate } from 'ws-cloud-api/templates'
import { ParametersTypes } from 'ws-cloud-api'

sendTextTemplate({
  to: '573123456789',
  templateName: 'login_code',
  language: 'en_US',
  parameters: [
    {
      type: ParametersTypes.Text,
      text: 'John Doe',
    },
    {
      type: ParametersTypes.Text,
      text: '123456',
    },
  ],
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log('Template message sent')
    }
  })
  .catch(console.error)
```