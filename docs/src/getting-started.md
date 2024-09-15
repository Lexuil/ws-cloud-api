---
outline: deep
---

# Getting Started

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Install

::: code-group

```sh [npm]
$ npm add ws-cloud-api
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

## Usage

### Send text message

```ts
import { sendText } from 'ws-cloud-api/messaging'

sendText({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  message: 'This is a test message'
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log('Message sent')
    }
  })
  .catch(console.error)
```

### Send text template

```ts
import { sendTextTemplate } from 'ws-cloud-api/templates'

sendTextTemplate({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  templateName: 'hello_world',
  language: 'en_US',
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log('Template sent')
    }
  })
  .catch(console.error);
```

### Handle webhook events

```ts
import { handleWebhook } from 'ws-cloud-api/webhook'
import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.post('/whatsapp-webhook', async (req, res) => {
  try {
    const event = handleWebhook(req.body)

    if (event?.type === 'message') {
      console.log(`New message from ${event.from}: ${event.message}`)
    }

    if (event?.type === 'voiceAudio') {
      console.log(`New voice message from ${event.from}: ${event.audio.id}`)
    }

    if (event?.type === 'flowReply') {
      console.log(
        `New flow reply from ${event.from}:\n\n`,
        JSON.stringify(event.flow, null, 2)
      )
    }

    res.status(200)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal server error')
  }
})

app.listen(port, () => {
  console.log(`Server start`)
});
```