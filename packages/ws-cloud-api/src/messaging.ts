import type { WsConfig } from './types/config'
import type { Button, Contact, WSBody } from './types/messages'

import { WsApi } from './ws-api'

type LocalSendMessageResponse = Awaited<ReturnType<WsApi['sendMessageRequest']>>

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export type SendMessageResponse = LocalSendMessageResponse

export async function sendMessageRequest({
  to,
  body,
  config
}: {
  to: string
  body: WSBody
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendMessageRequest({ body, to })
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
}): Promise<SendMessageResponse> {
  return await getClient(config).sendText({ message, previewUrl, to })
}

export async function sendContact({
  to,
  contacts,
  config
}: {
  to: string
  contacts: Contact[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendContact({ contacts, to })
}

export async function sendImage({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendImage({ link, to })
}

export async function sendVideo({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendVideo({ link, to })
}

export async function sendDocument({
  to,
  link,
  filename,
  caption,
  config
}: {
  to: string
  link: string
  filename: string
  caption?: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendDocument({ caption, filename, link, to })
}

export async function sendAudio({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendAudio({ link, to })
}

export async function sendFile({
  to,
  file,
  config
}: {
  to: string
  file: Blob
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendFile({ file, to })
}

export async function sendButtonMessage({
  to,
  message,
  config
}: {
  to: string
  message: { text: string; buttons: Button[] }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendButtonMessage({ message, to })
}

export async function sendCTAButtonMessage({
  to,
  message,
  config
}: {
  to: string
  message: { text: string; buttonText: string; url: string }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendCTAButtonMessage({ message, to })
}

export async function sendInteractiveListMessage({
  to,
  list,
  config
}: {
  to: string
  list: { text: string; buttonText: string; list: { title: string; description: string }[] }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendInteractiveListMessage({ list, to })
}

export async function sendInteractiveSectionListMessage({
  to,
  list,
  config
}: {
  to: string
  list: {
    text: string
    buttonText: string
    sections: { sectionTitle: string; list: { title: string; description: string }[] }[]
  }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendInteractiveSectionListMessage({ list, to })
}

export async function sendFlowMessage({
  to,
  flow,
  draft,
  config
}: {
  to: string
  flow: {
    id: string
    text: string
    token: string
    ctaText: string
    defaultScreen: string
    initDataExchange?: boolean
  }
  draft?: boolean
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendFlowMessage({ draft, flow, to })
}

export async function sendTypingIndicator({
  input,
  config
}: {
  input: { messageId: string }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendTypingIndicator({ input })
}
