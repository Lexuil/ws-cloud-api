# Text with WhatsApp Flow

[<Badge type="tip" text="api docs" />](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-flow-messages)

The `sendFlowMessage` function allows you to send a text message that starts a WhatsApp flow to a WhatsApp number.

```ts
async function sendFlowMessage({
  to,
  flow,
  draft,
  config,
}: {
  to: string;
  flow: {
    id: string;
    text: string;
    token: string;
    ctaText: string;
    defaultScreen: string;
  };
  draft?: boolean;
  config?: WsConfig;
}): Promise<boolean>;
```

## Parameters:

- `to`: The WhatsApp phone number recipient, including country code.
- `flow.id`: The ID of the WhatsApp flow to start.
- `flow.text`: The text message content.
- `flow.token`: The token for the flow.
- `flow.ctaText`: The text displayed on the CTA button to view the flow.
- `flow.defaultScreen`: The default screen to display in the flow.
- `draft`: Optional flag to send the message as a draft.
- `config`: Optional configuration settings.

## Return

- **Success:** True for success, false for fail.


## Example usage

```ts
import { sendFlowMessage } from "ws-cloud-api/messaging";

sendFlowMessage({
  to: "573123456789",
  flow: {
    id: process.env.FLOW_MESSAGE_ID ?? "",
    text: "Test flow message",
    token: "exampleToken",
    ctaText: "View Flow",
    defaultScreen: process.env.FLOW_MESSAGE_DEFAULT_SCREEN ?? "",
  },
  draft: false,
})
  .then((sentSuccess) => {
    if (sentSuccess) {
      console.log("Message with WhatsApp flow sent");
    }
  })
  .catch(console.error);
```
