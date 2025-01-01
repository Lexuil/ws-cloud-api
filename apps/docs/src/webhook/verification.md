# Webhook Verification

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

The `verifyWebhook` function verifies the webhook by ensuring that the token received in the request matches the one defined in your environment variables.

```ts
async function verifyWebhook({
  mode,
  token,
  challenge,
}: {
  mode: string;
  token: string;
  challenge: string;
}): {
  statusCode: 200 | 401
  body?: string
};
```

## Parameters

- `mode`: The mode of the webhook verification request.
- `token`: The token defined in your environment variables.
- `challenge`: The challenge string received in the request.

## Return

- `statusCode`: The status code to return in the response.
- `body`: The body to return in the response. It is the challenge string if the verification is successful.

## Example usage

```ts
import { verifyWebhook } from 'ws-cloud-api/webhook'

app.get('/whatsapp-webhook', (req, res) => {
  const response = verifyWebhook({
    mode: req.query['hub.mode'],
    token: req.query['hub.verify_token'],
    challenge: req.query['hub.challenge'],
  })

  if (response.statusCode === 200) {
    res.status(200).send(response.body)
  } else {
    res.status(401).send('Verification failed')
  }
})
```