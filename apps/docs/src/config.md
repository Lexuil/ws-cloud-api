---
outline: deep
---

# Configuration

The `ws-cloud-api` library reads configuration from environment variables, optionally overridden by a config object passed to the `WsApi` constructor.

## Environment Variables

| Variable             | Description                                                                                | Required |
| -------------------- | ------------------------------------------------------------------------------------------ | -------- |
| `WS_CA_VERSION`      | WhatsApp Cloud API version (e.g. `v24.0`). Defaults to `v24.0` if not set.                 | No       |
| `WS_PHONE_NUMBER_ID` | The phone number ID that will send and receive messages.                                   | Yes      |
| `WS_TOKEN`           | The access token used to authenticate API requests.                                        | Yes      |
| `WS_BUSINESS_ID`     | Your WhatsApp Business account ID. Required for some endpoints (e.g. template management). | No       |

## Programmatic Configuration

You can pass a config object to the `WsApi` constructor to override or supplement the environment variables. Anything you don't pass falls back to the environment.

```ts
interface WsConfig {
  apiVersion?: string // e.g. 'v24.0'
  businessId?: string
  phoneNumberId?: string
  token?: string
  logger?: Logger // optional pino-compatible logger
}
```

```ts
import { WsApi } from 'ws-cloud-api'

const ws = new WsApi({
  apiVersion: 'v24.0',
  phoneNumberId: '987654321098765',
  token: 'EAAJZ...nRZCQZB'
})
```

`WsConfig` is partial: only the keys you provide override the environment. The constructor throws if any required key (`phoneNumberId`, `token`) is missing from both the environment and the passed config.

## Default instance

For convenience, a lazy `defaultWsApi` is exported. It defers construction until the first method call, so importing the package never throws on missing env.

```ts
import { defaultWsApi } from 'ws-cloud-api'

const result = await defaultWsApi.sendText({ to: '...', message: 'hi' })
```

The `defaultWsApi` is suitable for scripts and single-instance apps. Prefer `new WsApi({...})` in tests and any context where you need explicit config or to inject a mocked `HttpClient`.
