import type { WsConfig } from './types/config'
import type {
  TemplateBodyParameter,
  TemplateFlowParameter,
  TemplateHeaderParameter
} from './types/messages'
import type {
  CreateTemplate,
  CreateTemplateResponse,
  Templates,
  templateFields
} from './types/templates'

import { WsApi } from './ws-api'

type LocalSendMessageResponse = ReturnType<WsApi['sendMessageRequest']>

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export type SendMessageResponse = Awaited<LocalSendMessageResponse>

export type SendTemplateRequestResponse<T> =
  | { success: true; data: T }
  | { success: false; error: unknown }

export async function sendTextTemplate({
  to,
  templateName,
  language,
  parameters,
  config
}: {
  to: string
  templateName: string
  language: string
  parameters?: TemplateBodyParameter[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendTextTemplate({ language, parameters, templateName, to })
}

export async function sendMediaTemplate({
  to,
  templateName,
  language,
  headerParameters,
  bodyParameters,
  config
}: {
  to: string
  templateName: string
  language: string
  headerParameters: TemplateHeaderParameter
  bodyParameters?: TemplateBodyParameter[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendMediaTemplate({
    bodyParameters,
    headerParameters,
    language,
    templateName,
    to
  })
}

export async function sendFlowTemplate({
  to,
  templateName,
  language,
  flow,
  bodyParameters,
  config
}: {
  to: string
  templateName: string
  language: string
  flow: TemplateFlowParameter['action']
  bodyParameters?: TemplateBodyParameter[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendFlowTemplate({
    bodyParameters,
    flow,
    language,
    templateName,
    to
  })
}

export async function sendAuthTemplate({
  to,
  templateName,
  language,
  code,
  config
}: {
  to: string
  templateName: string
  language: string
  code: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await getClient(config).sendAuthTemplate({ code, language, templateName, to })
}

export async function sendTemplateRequest<T>({
  query,
  body,
  method = 'GET',
  config
}: {
  query?: string
  body?: string
  method?: string
  config?: WsConfig
}): Promise<SendTemplateRequestResponse<T>> {
  return await getClient(config).sendTemplateRequest<T>({ body, method, query })
}

export async function getTemplates({
  fields,
  limit,
  after,
  before,
  config
}: {
  fields?: templateFields[]
  limit?: number
  after?: string
  before?: string
  config?: WsConfig
} = {}): Promise<SendTemplateRequestResponse<Templates>> {
  return await getClient(config).getTemplates({ after, before, fields, limit })
}

export async function createTemplate({
  template,
  config
}: {
  template: CreateTemplate
  config?: WsConfig
}): Promise<SendTemplateRequestResponse<CreateTemplateResponse>> {
  return await getClient(config).createTemplate({ template })
}
