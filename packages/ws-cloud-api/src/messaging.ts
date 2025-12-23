import { WsApi } from './ws-api'
import type { WsConfig } from './types/config'
import type { Button, Contact, WSBody } from './types/messages'

type LocalSendMessageResponse = Awaited<ReturnType<WsApi['sendMessageRequest']>>

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export type SendMessageResponse = LocalSendMessageResponse

export async function sendMessageRequest({ to, body, config }: { to: string, body: WSBody, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendMessageRequest({ to, body })
}

export async function sendText({ to, message, previewUrl, config }: { to: string, message: string, previewUrl?: boolean, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendText({ to, message, previewUrl })
}

export async function sendContact({ to, contacts, config }: { to: string, contacts: Contact[], config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendContact({ to, contacts })
}

export async function sendImage({ to, link, config }: { to: string, link: string, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendImage({ to, link })
}

export async function sendVideo({ to, link, config }: { to: string, link: string, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendVideo({ to, link })
}

export async function sendDocument({ to, link, filename, caption, config }: { to: string, link: string, filename: string, caption?: string, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendDocument({ to, link, filename, caption })
}

export async function sendAudio({ to, link, config }: { to: string, link: string, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendAudio({ to, link })
}

export async function sendFile({ to, file, config }: { to: string, file: Blob, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendFile({ to, file })
}

export async function sendButtonMessage({ to, message, config }: { to: string, message: { text: string, buttons: Button[] }, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendButtonMessage({ to, message })
}

export async function sendCTAButtonMessage({ to, message, config }: { to: string, message: { text: string, buttonText: string, url: string }, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendCTAButtonMessage({ to, message })
}

export async function sendInteractiveListMessage({ to, list, config }: { to: string, list: { text: string, buttonText: string, list: Array<{ title: string, description: string }> }, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendInteractiveListMessage({ to, list })
}

export async function sendInteractiveSectionListMessage({ to, list, config }: { to: string, list: { text: string, buttonText: string, sections: Array<{ sectionTitle: string, list: Array<{ title: string, description: string }> }> }, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendInteractiveSectionListMessage({ to, list })
}

export async function sendFlowMessage({ to, flow, draft, config }: { to: string, flow: { id: string, text: string, token: string, ctaText: string, defaultScreen: string, initDataExchange?: boolean }, draft?: boolean, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendFlowMessage({ to, flow, draft })
}

export async function sendTypingIndicator({ input, config }: { input: { messageId: string }, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendTypingIndicator({ input })
}
