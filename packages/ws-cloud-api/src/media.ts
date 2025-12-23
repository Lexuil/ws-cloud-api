import { WsApi } from './ws-api'
import type { WsConfig } from './types/config'

const getClient = (config?: WsConfig): WsApi => new WsApi(config)

export async function mediaRequest({ body, config }: { body: BodyInit, config?: WsConfig }): Promise<unknown> {
  return await getClient(config).mediaRequest(body)
}

export async function uploadMedia({ media, config }: { media: Blob, config?: WsConfig }): Promise<string> {
  return await getClient(config).uploadMedia({ media })
}

export async function getMediaUrl({ mediaId, config }: { mediaId: string, config?: WsConfig }): Promise<string> {
  return await getClient(config).getMediaUrl({ mediaId })
}

export async function getMedia({ mediaUrl, config }: { mediaUrl: string, config?: WsConfig }): Promise<Blob> {
  return await getClient(config).getMedia({ mediaUrl })
}
