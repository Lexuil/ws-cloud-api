// oxlint-disable typescript/no-unsafe-type-assertion
// oxlint-disable promise/prefer-await-to-then
// oxlint-disable max-statements
import { err, ok } from 'neverthrow'

import { WsApi } from 'ws-cloud-api'
import type { HttpClient, WsRequest } from 'ws-cloud-api'

import replyButtonBody from './bodyExamples/messageFromButton.json'
import replyListBody from './bodyExamples/messageFromList.json'
import textBody from './bodyExamples/messageText.json'
import voiceAudioBody from './bodyExamples/messageVoiceAudio.json'

const TEST_PHONE_NUMBER_ID = 'PHONE_NUMBER_ID'
const fakeAudioBlob = new Blob(['fake-audio-data'], { type: 'audio/ogg; codecs=opus' })

const mockHttp = {
  fetch: async () => fakeAudioBlob,
  request: async ({ id, method }: { id: string; method: string }) => {
    if (id === 'AUDIO_ID' && method === 'GET') {
      return ok({ response: { id: 'AUDIO_ID', url: 'https://example.com/audio.ogg' } })
    }
    return err({ code: 'UNEXPECTED_ERROR', extraParams: { id, method } })
  }
} as unknown as HttpClient

const wsApi = new WsApi(
  { phoneNumberId: TEST_PHONE_NUMBER_ID, token: 'test-token' },
  { http: mockHttp }
)

async function runWebhook(label: string, body: unknown) {
  console.log(`\n${label}`)
  const result = await wsApi.handleWebhook(body as WsRequest)
  if (result.isErr()) {
    console.error('Error:', result.error)
    return
  }
  if (result.value === undefined) {
    console.log('(not for this phone number)')
    return
  }
  if (result.value.type === 'media') {
    const { blob, ...rest } = result.value
    console.log({ ...rest, blobSize: blob.size, blobType: blob.type })
    return
  }
  console.log(result.value)
}

await runWebhook('Text message', textBody)
await runWebhook('Reply button message', replyButtonBody)
await runWebhook('Reply list message', replyListBody)
await runWebhook('Voice audio message', voiceAudioBody)
