# Get Templates

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)

The `getTemplates` function allows you to retrieve a list of message templates from the WhatsApp Cloud API.

```ts
async function getTemplates({
  fields,
  limit,
  after,
  before,
  config,
}: {
  fields?: templateFields[];
  limit?: number;
  after?: string;
  before?: string;
  config?: WsConfig;
} = {}): Promise<SendTemplateRequestResponse>;
```

## Parameters:

- `fields`: Optional array of fields to include in the response.
- `limit`: Optional limit on the number of templates to retrieve.
- `after`: Optional cursor for pagination to retrieve templates after a specific point.
- `before`: Optional cursor for pagination to retrieve templates before a specific point.
- `config`: Optional configuration settings.

## Return

- **Success**: True for success, false for fail.
- **Templates**: An array of message templates.

## Example usage

### Retrieve all templates

```ts
import { getTemplates } from 'ws-cloud-api/templates'

getTemplates()
  .then((response) => {
    if (!response.success) {
      console.error('Failed to retrieve templates')
      return
    }
    console.log('Templates retrieved:', response.templates)
  })
  .catch(console.error)
```

### Retrieve templates with specific fields and limit

```ts
import { getTemplates } from 'ws-cloud-api/templates'

getTemplates({
  fields: ['name', 'language'],
  limit: 10,
})
  .then((response) => {
    if (!response.success) {
      console.error('Failed to retrieve templates')
      return
    }
    console.log('Templates retrieved:', response.templates)
  })
  .catch(console.error)
```

### Retrieve templates with pagination

```ts
import { getTemplates } from 'ws-cloud-api/templates'

const page1 = await getTemplates({ limit: 2 })
if (!page1.success) {
  Throw new Error('Failed to retrieve templates')
}
console.log('page1', page1.templates)

const page2 = await getTemplates({
  limit: 2,
  after: page1.paging.cursors.after
})
if (!page2.success) {
  Throw new Error('Failed to retrieve templates')
}
console.log('page2', page2.templates)
```