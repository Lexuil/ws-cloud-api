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

    if (event?.type === "voiceAudio") {
      console.log(`New voice message from ${event.from}: ${event.audio.id}`);
    }

    if (event?.type === "flowReply") {
      console.log(
        `New flow reply from ${event.from}:\n\n`,
        JSON.stringify(event.flow, null, 2)
      );
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

### Messages

#### Send Text

```ts
import { sendText } from "ws-cloud-api/messaging";

sendText({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  message: "This is a test message",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message sent");
    }
  })
  .catch(console.error);
```

#### Send Image

```ts
import { sendImage } from "ws-cloud-api/messaging";

sendImage({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  link: "https://example.com/image.jpg",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Image sent");
    }
  })
  .catch(console.error);
```

#### Send Video

```ts
import { sendVideo } from "ws-cloud-api/messaging";

sendVideo({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  link: "https://example.com/video.mp4",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Video sent");
    }
  })
  .catch(console.error);
```

#### Send Document

```ts
import { sendDocument } from "ws-cloud-api/messaging";

sendDocument({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  link: "https://example.com/document.pdf",
  filename: "document.pdf",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Document sent");
    }
  })
  .catch(console.error);
```

#### Send Audio

```ts
import { sendAudio } from "ws-cloud-api/messaging";

sendAudio({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  link: "https://example.com/audio.mp3",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Audio sent");
    }
  })
  .catch(console.error);
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
import { sendFile } from "ws-cloud-api/messaging";

const image = new Blob([fs.readFileSync(path.join(__dirname, "/image.jpg"))], {
  type: "image/jpeg",
});

return await sendFile({
  to: phoneNumberToTest,
  file: image,
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Audio sent");
    }
  })
  .catch(console.error);
```

#### Send Text with CTA Button

```ts
import { sendTextWithCTAButton } from "ws-cloud-api/messaging";

sendTextWithCTAButton({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  message: {
    text: "This is a test message",
    buttonText: "CTA button",
    url: "https://www.google.com",
  },
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with CTA button sent");
    }
  })
  .catch(console.error);
```

#### Send Text with Buttons

```ts
import { sendTextWithButtons } from "ws-cloud-api/messaging";

sendTextWithButtons({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  message: {
    text: "This is a test message",
    buttons: [
      {
        title: "Button 1",
        id: "1",
      },
      {
        title: "Button 2",
        id: "2",
      },
    ],
  },
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with buttons sent");
    }
  })
  .catch(console.error);
```

#### Send Text with Unique Section List

```ts
import { sendInteractiveListMessage } from "ws-cloud-api/messaging";

sendInteractiveListMessage({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  list: {
    text: "Test list",
    buttonText: "List button",
    list: [
      {
        title: "Element 1",
        description: "Description 1",
      },
      {
        title: "Element 2",
        description: "Description 2",
      },
    ],
  },
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with unique section list sent");
    }
  })
  .catch(console.error);
```

#### Send Text with a List of Multiple Sections

```ts
import { sendInteractiveSectionListMessage } from "ws-cloud-api/messaging";

sendInteractiveSectionListMessage({
  to: phoneNumberToTest,
  list: {
    text: "Test section list",
    buttonText: "Section list button",
    sections: [
      {
        sectionTitle: "Section 1",
        list: [
          {
            title: "Element 1",
            description: "Description 1",
          },
          {
            title: "Element 2",
            description: "Description 2",
          },
        ],
      },
      {
        sectionTitle: "Section 2",
        list: [
          {
            title: "Element 3",
            description: "Description 3",
          },
          {
            title: "Element 4",
            description: "Description 4",
          },
        ],
      },
    ],
  },
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with multiple sections list sent");
    }
  })
  .catch(console.error);
```

#### Send Text with WhatsApp Flow

```ts
import { sendFlowMessage } from "ws-cloud-api/messaging";

sendFlowMessage({
  to: phoneNumberToTest,
  flow: {
    id: process.env.FLOW_MESSAGE_ID ?? "",
    text: "Test flow",
    token: "token",
    ctaText: "View flow",
    defaultScreen: process.env.FLOW_MESSAGE_DEFAULT_SCREEN ?? "",
  },
  draft: true,
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with WhatsApp flow sent");
    }
  })
  .catch(console.error);
```

### Templates

#### Send text template

To send a template, you have to create it first. You will need the name and the language code.

```ts
import { sendTextTemplate } from "ws-cloud-api/templates";

sendTextTemplate({
  to: process.env.PHONE_NUMBER_RECIPIENT,
  templateName: "hello_world",
  language: "en_US",
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Template sent");
    }
  })
  .catch(console.error);
```

### Media

#### Upload Media

```ts
import { uploadMedia } from "ws-cloud-api/media";

const blob = new Blob([fs.readFileSync(path.join(__dirname, "/image.jpg"))], {
  type: "image/jpeg",
});

uploadMedia({ media: blob })
  .then((mediaId) => {
    if (mediaId) {
      console.log("console media id: " + mediaId);
    }
  })
  .catch(console.error);
```

#### Get Media Url

```ts
import { getMediaUrl } from "ws-cloud-api/media";

getMediaUrl({ mediaId: "mediaId" })
  .then((url) => {
    if (url) {
      console.log("console media url: " + url);
    }
  })
  .catch(console.error);
```

#### Get Medias as Blob

```ts
import { getMedia } from "ws-cloud-api/media";

getMedia({ mediaUrl: "mediaUrl" })
  .then((blob) => {
    if (blob) {
      console.log("console media blob: " + blob);
    }
  })
  .catch(console.error);
```
