# Send Media Template

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `sendMediaTemplate` method sends a template whose header carries an image, video, or document.

```ts
async sendMediaTemplate({
  to,
  data
}: {
  to: string
  data: {
    name: string
    language: { code: string; policy?: 'deterministic' }
    components: [HeaderComponent, BodyComponent]
  }
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_MEDIA_TEMPLATE_ERROR' }>>>
```

`HeaderComponent` is `{ type: 'header', parameters: Array<{ type: 'image' | 'video' | 'document', ... }> }`. `BodyComponent` is `{ type: 'body', parameters?: TemplateParameter[] }`.

## Parameters

- `to`: Recipient phone number.
- `data.name`: The pre-configured template name.
- `data.language`: Template language code (e.g. `{ code: 'en_US' }`).
- `data.components`: A two-element tuple: a header component (with image/video/document parameters) and an optional body component (with text parameters).

## Return

A `Result`.

- **Ok** — `MessageResponse`.
- **Err** — `code: 'SEND_MEDIA_TEMPLATE_ERROR'`.

## Example usage

### Image header, no body parameters

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.sendMediaTemplate({
  to: '573123456789',
  data: {
    name: 'media_template',
    language: { code: 'en_US' },
    components: [
      {
        type: 'header',
        parameters: [{ type: 'image', image: { link: 'https://example.com/image.jpg' } }]
      },
      { type: 'body' }
    ]
  }
})

if (result.isErr()) {
  console.error('Template send failed:', result.error.code)
}
```

### Image header plus body parameters

```ts
const result = await ws.sendMediaTemplate({
  to: '573123456789',
  data: {
    name: 'media_template_with_body',
    language: { code: 'en_US' },
    components: [
      {
        type: 'header',
        parameters: [{ type: 'image', image: { link: 'https://example.com/image.jpg' } }]
      },
      {
        type: 'body',
        parameters: [
          { type: 'text', text: 'John Doe' },
          { type: 'text', text: '123456' }
        ]
      }
    ]
  }
})
```
