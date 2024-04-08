# Simple WhatsApp Cloud API library

A simple to use library to send messages to WhatsApp number using [cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api).

## Features

With this package you can send messages of the following types:

- Text
- Image
- Video
- Document
- Audio
- CTA Button
- text message with buttons
- text message with unique section list

## Config

To use the library you can add the next env variables to your env file.

```
WS_CA_VERSION='19.0'
WS_PHONE_NUMBER_ID=
WS_TOKEN=
```

## Usage

How to send text

```ts
import {sendText} from 'ws-cloud-api'

sendText(
  '573201234567',
  'This is a test message'
).catch(console.error)
```