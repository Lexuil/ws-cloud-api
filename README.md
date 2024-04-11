# Simple WhatsApp Cloud API library

A simple to use library to send messages to WhatsApp number and detect message events on webhook using [cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api).

## Features

### Webhook

Functions to verify webhook token and handle message webhook notifications to get messages content of from:

- Text message
- Button reply
- List reply

### Send messages

You can send messages of the following types:

- Text
- Image
- Video
- Document
- Audio
- CTA Button
- text message with buttons
- text message with unique section list

## Config

To use the library you have to add the next env variables to your env file.

### Messaging
```
WS_CA_VERSION='19.0'
WS_PHONE_NUMBER_ID=
WS_TOKEN=
```

### Webhook
```
WS_VERIFY_TOKEN=
```

## Usage

### Webhook

How to handle messages events

```ts
import { handleWebhook } from 'ws-cloud-api'
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

    res.status(200)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal server error')
  }
})

app.listen(port, () => {
  console.log(`Server start`)
})
```

### Send messages

How to send text

```ts
import { sendText } from 'ws-cloud-api'

const sentSuccess = sendText(
  '573201234567',
  'This is a test message'
).catch(console.error)

if (sentSuccess) {
  console.log('Message sent')
}
```