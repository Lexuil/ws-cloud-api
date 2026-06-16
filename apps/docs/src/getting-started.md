---
outline: deep
---

# Getting Started

## Install

::: code-group

```sh [npm]
$ npm install ws-cloud-api
```

```sh [pnpm]
$ pnpm add ws-cloud-api
```

```sh [yarn]
$ yarn add ws-cloud-api
```

```sh [bun]
$ bun add ws-cloud-api
```

:::

## Set up environment variables

```sh [.env]
WS_PHONE_NUMBER_ID=123456789012345
WS_TOKEN=EAAJZ...nRZCQZB
```

See [Configuration](./config) for the full list.

## Send a text message

`WsApi` methods return a `Result<T, E>` from `neverthrow`. Always handle both branches.

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.sendText({ to: '573123456789', message: 'This is a test message' })

result.match(
  (response) => console.log('Message sent:', response.messages[0].id),
  (error) => console.error('Failed to send:', error.code, error.data)
)
```

The `error.code` is one of a small union per method — see the individual API pages.

## Send a template

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()

const result = await ws.sendTextTemplate({
  to: '573123456789',
  templateName: 'hello_world',
  language: 'en_US'
})

if (result.isErr()) {
  console.error('Template send failed:', result.error.code)
}
```

## Handle webhook events

`handleWebhook` returns a `Result`. The success branch carries a discriminated union of event types; the error branch carries a media-fetch or `INVALID_FLOW_REPLY` error code.

```ts
import express from 'express'
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi()
const app = express()

app.use(express.json())

app.post('/whatsapp-webhook', async (req, res) => {
  const result = await ws.handleWebhook(req.body)

  if (result.isErr()) {
    console.error('Webhook processing failed:', result.error.code)
    res.status(500).send('Internal error')
    return
  }

  const event = result.value
  if (event === undefined) {
    res.status(200).send('OK')
    return
  }

  switch (event.type) {
    case 'message':
      console.log(`New message from ${event.from}: ${event.message}`)
      break
    case 'media':
      console.log(`New ${event.mimeType} from ${event.from}, ${event.blob.size} bytes`)
      break
    case 'flowReply':
      console.log(`Flow reply from ${event.from}:`, event.data)
      break
    case 'reaction':
      console.log(`${event.from} reacted with ${event.emoji}`)
      break
    case 'statusUpdate':
      console.log(`Status: ${event.status} (${event.messageId})`)
      break
  }

  res.status(200).send('OK')
})

app.listen(3000)
```

For the webhook verification handshake, see [Webhook Verification](./webhook/verification).
