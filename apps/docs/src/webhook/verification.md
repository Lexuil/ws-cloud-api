# Webhook Verification

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

When you register a webhook URL, Meta sends a `GET` request to verify ownership. The request includes a verification token; you must echo back the `challenge` query parameter if the token matches.

`ws-cloud-api` does not include a verification helper — the handshake is a few lines of your own code. Compare the incoming token to a value you control (typically loaded from an environment variable or your own config).

## What to implement

```ts
import express from 'express'

const app = express()
const VERIFY_TOKEN = process.env.WS_VERIFY_TOKEN ?? 'your-verify-token'

app.get('/whatsapp-webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Forbidden')
  }
})
```

## Loading the verify token

You can use `WS_VERIFY_TOKEN` as an environment variable name, but it's not read by `ws-cloud-api` itself — the library only reads `WS_CA_VERSION`, `WS_PHONE_NUMBER_ID`, `WS_BUSINESS_ID`, and `WS_TOKEN`. Pick whatever env name fits your app and compare against it in your handler.

For consistency with the rest of the library, you can also read the verify token from your `WsConfig` and pass it to the route handler:

```ts
import { WsApi, type WsConfig } from 'ws-cloud-api'

const config: WsConfig & { verifyToken: string } = {
  phoneNumberId: process.env.WS_PHONE_NUMBER_ID!,
  token: process.env.WS_TOKEN!,
  verifyToken: process.env.WS_VERIFY_TOKEN!
}

const ws = new WsApi(config)
const { verifyToken } = config
```
