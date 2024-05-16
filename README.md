# Simple WhatsApp Cloud API library

A simple-to-use library for sending messages and templates to WhatsApp numbers and detecting message events via webhook using [cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api).

## Features

### [Webhook](#webhook-2)

Functions to verify webhook token and handle message webhook notifications to get messages content of from:

- Text message
- Button reply
- List reply
- Voice audio
- Flow reply

### Send messages

You can send messages of the following types:

#### Messages

- [Text](#send-text)
- [Image (URL)](#send-image)
- [Video (URL)](#send-video)
- [Document (URL)](#send-document)
- [Audio (URL)](#send-audio)
- [File (Blob)](#send-file)
- [Text message with CTA Button](#send-text-with-cta-button)
- [Text message with buttons](#send-text-with-buttons)
- [Text message with unique section list](#send-text-with-unique-section-list)
- [Text message with a list of multiple sections](#send-text-with-a-list-of-multiple-sections)
- [Text message with WhatsApp flow](#send-text-with-whatsapp-flow)

#### Templates

- [Send simple text template](#send-text-template)

#### Media

Functions to handle WhatsApp media

- [Upload media](#upload-media)
- [Get media Url](#get-media-url)
- [Get media as Blob](#get-medias-as-blob)

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
})
```

### Messages

#### Send Text

```ts
import { sendText } from 'ws-cloud-api/messaging'

sendText(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message sent') }
}).catch(console.error)
```

#### Send Image

```ts
import { sendImage } from 'ws-cloud-api/messaging'

sendImage(
  process.env.PHONE_NUMBER_RECIPIENT,
  'https://example.com/image.jpg'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Image sent') }
}).catch(console.error)
```

#### Send Video

```ts
import { sendVideo } from 'ws-cloud-api/messaging'

sendVideo(
  process.env.PHONE_NUMBER_RECIPIENT,
  'https://example.com/video.mp4'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Video sent') }
}).catch(console.error)
```

#### Send Document

```ts
import { sendDocument } from 'ws-cloud-api/messaging'

sendDocument(
  process.env.PHONE_NUMBER_RECIPIENT,
  'https://example.com/document.pdf'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Document sent') }
}).catch(console.error)
```

#### Send Audio

```ts
import { sendAudio } from 'ws-cloud-api/messaging'

sendAudio(
  process.env.PHONE_NUMBER_RECIPIENT,
  'https://example.com/audio.mp3'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Audio sent') }
}).catch(console.error)
```

#### Send File

Supported files:

- Images:
  - image/jpeg
  - image/png
- Documents:
  - text/plain
  - application/pdf
  - application/vnd.ms-powerpoint
  - application/msword
  - application/vnd.ms-excel
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - application/vnd.openxmlformats-officedocument.presentationml.presentation
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- Audio:
  - audio/aac
  - audio/mp4
  - audio/mpeg
  - audio/amr
  - audio/ogg
  - audio/opus
- Video:
  - video/mp4
  - video/3gp

```ts
import { sendFile } from 'ws-cloud-api/messaging'

const image = new Blob(
  [fs.readFileSync(path.join(__dirname, '/image.jpg'))],
  { type: 'image/jpeg' }
)

return await sendFile({
  to: phoneNumberToTest,
  file: image
}).then((sentSuccess) => {
  if (sentSuccess) { console.log('Audio sent') }
}).catch(console.error)
```

#### Send Text with CTA Button

```ts
import { sendTextWithCTAButton } from 'ws-cloud-api/messaging'

sendTextWithCTAButton(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message',
  'https://example.com/button'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message with CTA button sent') }
}).catch(console.error)
```

#### Send Text with Buttons

```ts
import { sendTextWithButtons } from 'ws-cloud-api/messaging'

sendTextWithButtons(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message',
  [
    {
      title: 'Button 1',
      payload: 'button_1',
    },
    {
      title: 'Button 2',
      payload: 'button_2',
    },
  ]
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message with buttons sent') }
}).catch(console.error)
```

#### Send Text with Unique Section List

```ts
import { sendTextWithUniqueSectionList } from 'ws-cloud-api/messaging'

sendTextWithUniqueSectionList(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message',
  {
    title: 'Section 1',
    subtitle: 'Subtitle 1',
    image: 'https://example.com/image.jpg',
    cta: {
      title: 'Button 1',
      payload: 'button_1',
    },
  }
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message with unique section list sent') }
}).catch(console.error)
```

#### Send Text with a List of Multiple Sections

```ts
import { sendTextWithMultipleSectionsList } from 'ws-cloud-api/messaging'

sendTextWithMultipleSectionsList(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message',
  [
    {
      title: 'Section 1',
      subtitle: 'Subtitle 1',
      image: 'https://example.com/image.jpg',
      cta: {
        title: 'Button 1',
        payload: 'button_1',
      },
    },
    {
      title: 'Section 2',
      subtitle: 'Subtitle 2',
      image: 'https://example.com/image.jpg',
      cta: {
        title: 'Button 2',
        payload: 'button_2',
      },
    },
  ]
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message with multiple sections list sent') }
}).catch(console.error)
```

#### Send Text with WhatsApp Flow

```ts
import { sendTextWithWhatsAppFlow } from 'ws-cloud-api/messaging'

sendTextWithWhatsAppFlow(
  process.env.PHONE_NUMBER_RECIPIENT,
  'This is a test message',
  'flow_id'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Message with WhatsApp flow sent') }
}).catch(console.error)
```

### Templates

#### Send text template

To send a template, you have to create it first. You will need the name and the language code.

```ts
import { sendTextTemplate } from 'ws-cloud-api/templates'

sendTextTemplate(
  process.env.PHONE_NUMBER_RECIPIENT,
  'hello_world',
  'en_US'
).then((sentSuccess) => {
  if (sentSuccess) { console.log('Template sent') }
}).catch(console.error)
```

### Media

#### Upload Media

```ts
import { uploadMedia } from 'ws-cloud-api/media'

const blob = new Blob(
  [fs.readFileSync(path.join(__dirname, '/image.jpg'))],
  { type: 'image/jpeg' }
)

uploadMedia({ media: blob }).then((mediaId) => {
  if (mediaId) { console.log('console media id: ' + mediaId) }
}).catch(console.error)
```

#### Get Media Url

```ts
import { getMediaUrl } from 'ws-cloud-api/media'

getMediaUrl('mediaId').then((url) => {
  if (url) { console.log('console media url: ' + url) }
}).catch(console.error)
```

#### Get Medias as Blob

```ts
import { getMedia } from 'ws-cloud-api/media'

getMedia('mediaUrl').then((blob) => {
  if (blob) { console.log('console media blob: ' + blob) }
}).catch(console.error)
```
