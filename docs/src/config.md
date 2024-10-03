---
outline: deep
---

# Configuration

To use the `ws-cloud-api` library, you need to set up a few environment variables in your configuration file. Here’s a detailed guide on what each variable is for:

## Messaging Configuration

- **`WS_CA_VERSION`**:
  - **Description**: Specifies the version of the WhatsApp Cloud API that you are using.
  - **Example**: `'19.0'`
  - **Note**: Make sure to set this to the version that matches your API setup. You can find the latest version in the [WhatsApp Cloud API documentation](https://developers.facebook.com/docs/whatsapp/cloud-api).

- **`WS_PHONE_NUMBER_ID`**:
  - **Description**: The unique identifier for your WhatsApp phone number. This ID is associated with the phone number that will be used to send and receive messages.
  - **Example**: `123456789012345`
  - **Note**: Obtain this ID from your WhatsApp Business Account settings.

- **`WS_TOKEN`**:
  - **Description**: The access token used to authenticate API requests. This token should be kept secure as it grants access to your WhatsApp Business Account.
  - **Example**: `'EAAJZ...nRZCQZB'`
  - **Note**: You can generate or find your token in the [WhatsApp Business Account settings](https://developers.facebook.com/docs/whatsapp/getting-started).

## Webhook Configuration

- **`WS_VERIFY_TOKEN`**:
  - **Description**: A token used to verify the authenticity of incoming webhook requests. This helps ensure that requests to your webhook endpoint are from WhatsApp.
  - **Example**: `'your-verify-token'`
  - **Note**: Set this to a secure, unique string and use it in your webhook verification process. This token should be configured in your webhook settings on the [Facebook for Developers portal](https://developers.facebook.com/docs/whatsapp/webhooks).

## Optional Configuration Parameter

In addition to setting environment variables, `ws-cloud-api` functions allow for optional configuration through a `config` parameter. This parameter lets you override the default configuration or provide specific settings for individual API requests.

### Using the `config` Parameter

Many functions in `ws-cloud-api` accept an optional `config` parameter. This allows you to specify configuration settings directly within your function call, providing flexibility and control over your API interactions.

**Example Function Signature:**

```typescript
interface WsConfig {
  apiVersion?: string
  phoneNumberId?: string
  token?: string
}

export async function sendText({
  to,
  message,
  previewUrl,
  config
}: {
  to: string
  message: string
  previewUrl?: boolean
  config?: WsConfig
}): Promise<SendMessageResponse>
```

### Configuration Options:

- **apiVersion:**
  - **Description:** Specifies the version of the WhatsApp Cloud API to use for the request.
  - **Default:** Uses the version specified by the WS_CA_VERSION environment variable if not provided.
  - **Example:** `'19.0'`

- **phoneNumberId:**
  - **Description:** Allows you to specify a different phone number ID for the request, overriding the one set in the environment variable.
  - **Default:** Uses the WS_PHONE_NUMBER_ID environment variable if not provided.
  - **Example:** `123456789012345`

- **token:**
  - **Description:** Provides an alternative access token for the API request, overriding the token set in the environment variables.
  - **Default:** Uses the WS_TOKEN environment variable if not provided.
  - **Example:** `'EAAJZ...nRZCQZB'`

### Example usage:

```ts
import { sendText } from 'ws-cloud-api/messaging';

sendText({
  to: 'recipient_phone_number',
  message: 'Hello, this is a test message!',
  config: {
    apiVersion: '19.0',
    phoneNumberId: '987654321098765',
    token: 'your-optional-token'
  }
})
  .then((response) => {
    if (response.success) {
      console.log('Message sent successfully');
    }
  })
  .catch(console.error);
```