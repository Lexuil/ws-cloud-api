// TODO: Remove any type in body
export async function sendMessageRequest (
  to: string,
  body: any
): Promise<void> {
  const postBody = JSON.stringify({
    messaging_product: 'whatsapp',
    to,
    ...body
  })

  const response = await fetch(
    `https://graph.facebook.com/v${process.env.WS_CA_VERSION ?? '19.0'}/${process.env.WS_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: postBody
    }
  )

  console.log(JSON.stringify(await response.json(), null, 2))

  if (!response.ok) {
    console.error('Failed to send message')
  } else {
    console.log('Message sent successfully to user')
  }
}

export async function sendText (
  to: string,
  message: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'text',
      text: {
        body: message
      }
    }
  )
}

export async function sendImage (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'image',
      image: {
        link
      }
    }
  )
}

export async function sendVideo (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'video',
      video: {
        link
      }
    }
  )
}
