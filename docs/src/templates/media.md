# Send Media Template

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `sendMediaTemplate` function allows you to send a template with media on header to WhatsApp number.

```ts
async function sendMediaTemplate({
  to,
  templateName,
  language,
  headerParameters,
  bodyParameters,
  config,
}: {
  to: string;
  templateName: string;
  language: string;
  headerParameters: TemplateHeaderParameter;
  bodyParameters?: TemplateBodyParameter[];
  config?: WsConfig;
}): Promise<SendMessageResponse>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `templateName`: The name of the pre-configured template to send.
- `language`: The language code for the template (e.g., en_US).
- `headerParameters`: Parameters for the header of the template.
- `bodyParameters`: Optional parameters to customize the body of the template.
- `config`: Optional configuration settings.

## Return

- **Success:** True for success, false for fail.
- **Response:** Information about the message sent, like the message ID, delivery status, and more.

## Example usage

### Send a media template

```ts
import { sendMediaTemplate } from 'ws-cloud-api/templates'

sendMediaTemplate({
  to: '573123456789',
  templateName: 'media_template',
  language: 'en_US',
  headerParameters: {
    type: 'image',
    image: {
      link: 'https://example.com/image.jpg'
    }
  }
})
  .then((response) => {
    if (response.success) {
      console.log('Template message sent')
    }
  })
  .catch(console.error)
```

### Send a media template with body parameters

```ts
import { sendMediaTemplate } from 'ws-cloud-api/templates'
import { ParametersTypes } from 'ws-cloud-api'

sendMediaTemplate({
  to: '573123456789',
  templateName: 'media_template_with_body',
  language: 'en_US',
  headerParameters: {
    type: 'image',
    image: {
      link: 'https://example.com/image.jpg'
    }
  },
  bodyParameters: [
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
  .then((response) => {
    if (response.success) {
      console.log('Template message sent')
    }
  })
  .catch(console.error)
```