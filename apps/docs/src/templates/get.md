# Get Templates

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)

The `getTemplates` method retrieves a paginated list of message templates from the WhatsApp Cloud API.

```ts
async getTemplates({
  fields,
  limit,
  after,
  before
}?: {
  fields?: TemplateFields[]
  limit?: number
  after?: string
  before?: string
}): Promise<Result<{ response: GetTemplatesResponse }, ErrorBuilder<{ code: 'GET_TEMPLATE_ERROR' }>>>
```

`TemplateFields` accepts any subset of: `id`, `category`, `components`, `correct_category`, `cta_url_link_tracking_opted_out`, `language`, `library_template_name`, `message_send_ttl_seconds`, `name`, `previous_category`, `quality_score`, `rejected_reason`, `status`, `sub_category`.

## Parameters

- `fields`: Optional array of fields to include in each template object.
- `limit`: Optional page size.
- `after`: Cursor from a previous response — returns templates after that point.
- `before`: Cursor from a previous response — returns templates before that point.

## Return

A `Result`.

- **Ok** — `{ response: GetTemplatesResponse }`. The response carries the templates array and the `paging.cursors` for the next/previous page.
- **Err** — `code: 'GET_TEMPLATE_ERROR'` if the request fails.

## Example usage

### Retrieve all templates

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.getTemplates()
if (result.isErr()) {
  console.error('Failed to retrieve templates:', result.error.code)
  return
}

console.log('Templates:', result.value.response.data)
```

### Retrieve templates with specific fields and limit

```ts
const result = await ws.getTemplates({ fields: ['name', 'language'], limit: 10 })
if (result.isOk()) {
  console.log('Templates:', result.value.response.data)
}
```

### Retrieve templates with pagination

```ts
import type { Result } from 'neverthrow'

async function paginate() {
  const ws = new WsApi()

  const page1 = await ws.getTemplates({ limit: 2 })
  if (page1.isErr()) return
  console.log('page1:', page1.value.response.data)

  if (page1.value.response.paging?.cursors?.after) {
    const page2 = await ws.getTemplates({
      limit: 2,
      after: page1.value.response.paging.cursors.after
    })
    if (page2.isErr()) return
    console.log('page2:', page2.value.response.data)
  }
}
```
