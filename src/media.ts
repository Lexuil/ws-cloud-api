import { type wsConfig } from './types/config'

export async function mediaRequest ({
  body,
  config
}: {
  body: any // TODO: Define media body type
  config?: wsConfig
}): Promise<any> { // TODO: Define media response type
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
      body
    }
  )

  if (!response.ok) {
    console.error('Failed to make media request')
    console.error(JSON.stringify(await response.json(), null, 2))
    return false
  } else {
    return await response.json()
  }
}

export async function uploadMedia ({
  media,
  config
}: {
  media: Blob
  config?: wsConfig
}): Promise<string> {
  const formData = new FormData()
  formData.append('file', media)
  formData.append('type', media.type)
  formData.append('messaging_product', 'whatsapp')

  return (await mediaRequest({
    body: formData,
    config
  })).id
}
