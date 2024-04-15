# Simple WhatsApp Cloud API library

A simple-to-use library for sending messages and templates to WhatsApp numbers and detecting message events via webhook using [cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api).

## Features

### Webhook

Functions to verify webhook token and handle message webhook notifications to get messages content of from:

- Text message
- Button reply
- List reply

### Send messages

You can send messages of the following types:

#### Messages

- Text
- Image
- Video
- Document
- Audio
- CTA Button
- text message with buttons
- text message with unique section list

#### Templates

- Send simple text template

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
import { handleWebhook } from "ws-cloud-api/webhook";
import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/whatsapp-webhook", async (req, res) => {
  try {
    const event = handleWebhook(req.body);

    if (event?.type === "message") {
      console.log(`New message from ${event.from}: ${event.message}`);
    }

    res.status(200);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server start`);
});
```

### Send messages

How to send text

```ts
import { sendText } from "ws-cloud-api/messaging";

const sentSuccess = sendText(
  process.env.PHONE_NUMBER_RECIPIENT,
  "This is a test message"
).catch(console.error);

if (sentSuccess) {
  console.log("Message sent");
}
```

### Send template

To send a template, you have to create it first. You will need the name and the language code.

```ts
import { sendTextTemplate } from "ws-cloud-api/templates";

const sentSuccess = sendTextTemplate(
  process.env.PHONE_NUMBER_RECIPIENT,
  "hello_world",
  "en_US"
).catch(console.error);

if (sentSuccess) {
  console.log("Template sent");
}
```
