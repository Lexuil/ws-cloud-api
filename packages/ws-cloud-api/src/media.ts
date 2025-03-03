import { type WsConfig } from './types/config'
import nodeFetch from 'cross-fetch'

const supportedFiles = {
  image: ['image/jpeg', 'image/png'],
  document: [
    'text/plain',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg', 'audio/opus'],
  video: ['video/mp4', 'video/3gp']
}

export async function mediaRequest({
  body,
  config
}: {
  body: unknown // TODO: Define media body type
  config?: WsConfig
}): Promise<unknown> { // TODO: Define media response type
  // Config
  const apiVersion = typeof process !== 'undefined'
    ? process.env.WS_CA_VERSION ?? config?.apiVersion ?? '19.0'
    : config?.apiVersion ?? '19.0'
  const phoneNumberId = typeof process !== 'undefined'
    ? process.env.WS_PHONE_NUMBER_ID ?? config?.phoneNumberId
    : config?.phoneNumberId
  const token = typeof process !== 'undefined'
    ? process.env.WS_TOKEN ?? config?.token
    : config?.token

  const response = await fetch(
    `https://graph.facebook.com/v${apiVersion}/${phoneNumberId}/media`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: body as BodyInit
    }
  )

  if (!response.ok) {
    console.error('Failed to make media request')
    console.error(JSON.stringify(await response.json(), null, 2))
    return false
  }
  else {
    return await response.json()
  }
}

export async function uploadMedia({
  media,
  config
}: {
  media: Blob
  config?: WsConfig
}): Promise<string> {
  if (!supportedFiles.image.includes(media.type) &&
    !supportedFiles.document.includes(media.type) &&
    !supportedFiles.audio.includes(media.type) &&
    !supportedFiles.video.includes(media.type)) {
    throw new Error('Unsupported media type')
  }

  const formData = new FormData()
  formData.append('file', media)
  formData.append('type', media.type)
  formData.append('messaging_product', 'whatsapp')

  const mediaRequestResponse = (await mediaRequest({
    body: formData,
    config
  })) as {
    id: string
  }
  return mediaRequestResponse.id
}

export async function getMediaUrl({
  mediaId,
  config
}: {
  mediaId: string
  config?: WsConfig
}): Promise<string> {
  // Config
  const apiVersion = typeof process !== 'undefined'
    ? process.env.WS_CA_VERSION ?? config?.apiVersion ?? '19.0'
    : config?.apiVersion ?? '19.0'
  const token = typeof process !== 'undefined'
    ? process.env.WS_TOKEN ?? config?.token
    : config?.token

  const response = await fetch(
    `https://graph.facebook.com/v${apiVersion}/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    console.error('Failed to make media request')
    console.error(JSON.stringify(await response.json(), null, 2))
    return ''
  }
  else {
    return (await response.json() as {
      // TODO: Define media response type
      id: string
      url: string
    }).url
  }
}

export async function getMedia({
  mediaUrl,
  config
}: {
  mediaUrl: string
  config?: WsConfig
}): Promise<Blob> {
  // Config
  const token = typeof process !== 'undefined'
    ? process.env.WS_TOKEN ?? config?.token
    : config?.token

  const response = await nodeFetch(mediaUrl, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return await response.blob()
}
