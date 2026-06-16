# Send Text Template

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `sendTextTemplate` method sends a template that has only a body component (no header, no buttons).

```ts
async sendTextTemplate({
  to,
  data
}: {
  to: string
  data: {
    name: string
    language: { code: string; policy?: 'deterministic' }
    components?: [{ type: 'body'; parameters?: TemplateParameter[] }]
  }
}): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TEXT_TEMPLATE_ERROR' }>>>
```

`TemplateParameter` is the discriminated union of `currency` / `date_time` / `text` / etc. parameter objects, exported as types.

## Parameters

- `to`: Recipient phone number (with country code).
- `data.name`: The pre-configured template name.
- `data.language`: Template language — `{ code: 'en_US' }` (or whatever the template was created for). The `policy: 'deterministic'` flag is optional.
- `data.components`: Optional array containing a single body component. Its `parameters` are positional placeholders for the body text.

## Return

A `Result`.

- **Ok** — `MessageResponse` containing the sent message's `id` and metadata.
- **Err** — `code: 'SEND_TEXT_TEMPLATE_ERROR'` on failure.

## Example usage

### Send a template with no parameters

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.sendTextTemplate({
  to: '573123456789',
  data: { name: 'hello_world', language: { code: 'en_US' } }
})

if (result.isErr()) {
  console.error('Template send failed:', result.error.code)
}
```

### Send a template with body parameters

```ts
const result = await ws.sendTextTemplate({
  to: '573123456789',
  data: {
    name: 'login_code',
    language: { code: 'en_US' },
    components: [
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
