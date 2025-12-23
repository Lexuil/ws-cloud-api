import { WsApi } from './ws-api'
import type { WsConfig } from './types/config'
import type {
  TemplateBodyParameter,
  TemplateFlowParameter,
  TemplateHeaderParameter
} from './types/messages'
import type {
  templateFields,
  CreateTemplate,
  Templates,
  CreateTemplateResponse
} from './types/templates'

type LocalSendMessageResponse = ReturnType<WsApi['sendMessageRequest']>

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export type SendMessageResponse = Awaited<LocalSendMessageResponse>

export type SendTemplateRequestResponse<T> =
  | { success: true, data: T } |
  { success: false, error: unknown }

export async function sendTextTemplate({ to, templateName, language, parameters, config }: { to: string, templateName: string, language: string, parameters?: TemplateBodyParameter[], config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendTextTemplate({ to, templateName, language, parameters })
}

export async function sendMediaTemplate({ to, templateName, language, headerParameters, bodyParameters, config }: { to: string, templateName: string, language: string, headerParameters: TemplateHeaderParameter, bodyParameters?: TemplateBodyParameter[], config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendMediaTemplate({ to, templateName, language, headerParameters, bodyParameters })
}

export async function sendFlowTemplate({ to, templateName, language, flow, bodyParameters, config }: { to: string, templateName: string, language: string, flow: TemplateFlowParameter['action'], bodyParameters?: TemplateBodyParameter[], config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendFlowTemplate({ to, templateName, language, flow, bodyParameters })
}

export async function sendAuthTemplate({ to, templateName, language, code, config }: { to: string, templateName: string, language: string, code: string, config?: WsConfig }): Promise<SendMessageResponse> {
  return await getClient(config).sendAuthTemplate({ to, templateName, language, code })
}

export async function sendTemplateRequest<T>({ query, body, method = 'GET', config }: { query?: string, body?: string, method?: string, config?: WsConfig }): Promise<SendTemplateRequestResponse<T>> {
  return await getClient(config).sendTemplateRequest<T>({ query, body, method })
}

export async function getTemplates({ fields, limit, after, before, config }: { fields?: templateFields[], limit?: number, after?: string, before?: string, config?: WsConfig } = {}): Promise<SendTemplateRequestResponse<Templates>> {
  return await getClient(config).getTemplates({ fields, limit, after, before })
}

export async function createTemplate({ template, config }: { template: CreateTemplate, config?: WsConfig }): Promise<SendTemplateRequestResponse<CreateTemplateResponse>> {
  return await getClient(config).createTemplate({ template })
}
