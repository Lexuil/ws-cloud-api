---
outline: deep
---

# What is ws-cloud-api?

`ws-cloud-api` is a user-friendly library designed for interacting with the [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api). It simplifies sending messages, templates, and handling message events through webhooks. Here’s what you can do with `ws-cloud-api`:

## Send Messages

- **Text Messages**: Send plain text messages with or without media previews.
- **Media Messages**: Send images, videos, documents, and audio files. You can also send files as blobs with supported formats.
- **Interactive Messages**: Include CTA (Call-To-Action) buttons, simple buttons, or interactive lists with unique or multiple sections.
- **WhatsApp Flows**: Send messages that initiate or interact with WhatsApp flows.

## Templates

- **Text Templates**: Send pre-defined templates for structured communication, using the template name and language code.

## Media Handling

- **Upload Media**: Upload various types of media files to WhatsApp.
- **Get Media URL**: Retrieve the URL of uploaded media.
- **Get Media as Blob**: Download media in Blob format for further processing.

## Webhooks

- **Verify Tokens**: Verify webhook tokens to ensure secure communication.
- **Handle Notifications**: Process incoming message events including text messages, button replies, list replies, voice messages, and flow replies.

By leveraging these features, `ws-cloud-api` helps streamline the integration with WhatsApp Cloud, making it easier to build interactive and media-rich messaging solutions.
