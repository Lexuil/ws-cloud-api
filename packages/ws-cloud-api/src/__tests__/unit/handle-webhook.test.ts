// oxlint-disable typescript/no-unsafe-type-assertion
// oxlint-disable eslint/no-underscore-dangle
import { err, ok } from 'neverthrow'
import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '@/core/http'
import type { WsRequest } from '@/types/webhook'

import { WsApi } from '@/ws-api'

import buttonReply from '../fixtures/bodyExamples/messageFromButton.json' with { type: 'json' }
import listReply from '../fixtures/bodyExamples/messageFromList.json' with { type: 'json' }
import media from '../fixtures/bodyExamples/messageMedia.json' with { type: 'json' }
import text from '../fixtures/bodyExamples/messageText.json' with { type: 'json' }
import voiceAudio from '../fixtures/bodyExamples/messageVoiceAudio.json' with { type: 'json' }

const PHONE_NUMBER_ID = 'PHONE_NUMBER_ID'

function makeHttp(overrides: Partial<HttpClient> = {}): HttpClient {
  return {
    fetch: vi.fn() as unknown as HttpClient['fetch'],
    request: vi.fn().mockResolvedValue(err({ code: 'UNEXPECTED_ERROR' })),
    ...overrides
  }
}

function makeWsApi(http: HttpClient): WsApi {
  return new WsApi({ phoneNumberId: PHONE_NUMBER_ID, token: 't' }, { http })
}

function asRequest(value: unknown): WsRequest {
  return value as WsRequest
}

describe('handleWebhook', () => {
  it('returns ok(undefined) when phone_number_id does not match', async () => {
    const wsApi = makeWsApi(makeHttp())
    const otherPhoneId = {
      ...text,
      entry: [
        {
          ...text.entry[0],
          changes: [
            {
              ...text.entry[0].changes[0],
              value: {
                ...text.entry[0].changes[0].value,
                metadata: { ...text.entry[0].changes[0].value.metadata, phone_number_id: 'OTHER' }
              }
            }
          ]
        }
      ]
    }
    const result = await wsApi.handleWebhook(asRequest(otherPhoneId))
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBeUndefined()
  })

  it('returns text message for a text payload', async () => {
    const wsApi = makeWsApi(makeHttp())
    const result = await wsApi.handleWebhook(asRequest(text))
    expect(result._unsafeUnwrap()).toEqual({
      from: 'PHONE_NUMBER',
      id: 'wamid.ID',
      message: 'MESSAGE_BODY',
      source: 'user',
      type: 'message'
    })
  })

  it('returns button reply message', async () => {
    const wsApi = makeWsApi(makeHttp())
    const result = await wsApi.handleWebhook(asRequest(buttonReply))
    expect(result._unsafeUnwrap()).toEqual({
      from: 'PHONE_NUMBER_ID',
      id: 'wamid.ID',
      message: 'unique-button-identifier-here',
      source: 'button',
      type: 'message'
    })
  })

  it('returns list reply message', async () => {
    const wsApi = makeWsApi(makeHttp())
    const result = await wsApi.handleWebhook(asRequest(listReply))
    expect(result._unsafeUnwrap()).toEqual({
      from: 'PHONE_NUMBER_ID',
      id: 'wamid.ID',
      message: 'list_reply_id',
      source: 'list',
      type: 'message'
    })
  })

  it('returns media blob for image messages', async () => {
    const fakeBlob = new Blob(['x'])
    const http = makeHttp({
      fetch: vi.fn().mockResolvedValue(fakeBlob) as unknown as HttpClient['fetch'],
      request: vi.fn().mockImplementation(async (opts: { id: string; method: string }) => {
        if (opts.method === 'GET' && opts.id === 'ID') {
          return ok({ response: { url: 'https://example.com/img.jpg' } })
        }
        return err({ code: 'UNEXPECTED_ERROR' })
      })
    })
    const wsApi = makeWsApi(http)
    const result = await wsApi.handleWebhook(asRequest(media))
    expect(result._unsafeUnwrap()).toMatchObject({
      blob: fakeBlob,
      from: 'PHONE_NUMBER',
      id: 'wamid.ID',
      mimeType: 'image/jpeg',
      source: 'user',
      type: 'media'
    })
  })

  it('returns GET_MEDIA_URL_ERROR when the media url lookup fails', async () => {
    const http = makeHttp({
      request: vi.fn().mockResolvedValue(err({ code: 'HTTP_REQUEST_ERROR' }))
    })
    const wsApi = makeWsApi(http)
    const result = await wsApi.handleWebhook(asRequest(media))
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr().code).toBe('GET_MEDIA_URL_ERROR')
  })

  it('returns audio blob with mime type for voice messages', async () => {
    const fakeBlob = new Blob(['audio'])
    const http = makeHttp({
      fetch: vi.fn().mockResolvedValue(fakeBlob) as unknown as HttpClient['fetch'],
      request: vi.fn().mockResolvedValue(ok({ response: { url: 'https://example.com/audio.ogg' } }))
    })
    const wsApi = makeWsApi(http)
    const result = await wsApi.handleWebhook(asRequest(voiceAudio))
    expect(result._unsafeUnwrap()).toMatchObject({
      blob: fakeBlob,
      mimeType: 'audio/ogg; codecs=opus',
      type: 'media'
    })
  })

  it('returns flowReply for nfm_reply interactive messages', async () => {
    const nfmReply = {
      ...text,
      entry: [
        {
          ...text.entry[0],
          changes: [
            {
              ...text.entry[0].changes[0],
              value: {
                ...text.entry[0].changes[0].value,
                messages: [
                  {
                    from: 'PHONE_NUMBER',
                    id: 'wamid.NFM',
                    interactive: {
                      nfm_reply: {
                        body: 'Sent',
                        name: 'flow',
                        response_json: '{"screen":0,"answer":"yes"}'
                      },
                      type: 'nfm_reply'
                    },
                    timestamp: 'TIMESTAMP',
                    type: 'interactive'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
    const wsApi = makeWsApi(makeHttp())
    const result = await wsApi.handleWebhook(asRequest(nfmReply))
    expect(result._unsafeUnwrap()).toEqual({
      data: { answer: 'yes', screen: 0 },
      from: 'PHONE_NUMBER',
      id: 'wamid.NFM',
      type: 'flowReply'
    })
  })

  it('returns INVALID_FLOW_REPLY when response_json is not valid JSON', async () => {
    const bad = {
      ...text,
      entry: [
        {
          ...text.entry[0],
          changes: [
            {
              ...text.entry[0].changes[0],
              value: {
                ...text.entry[0].changes[0].value,
                messages: [
                  {
                    from: 'PHONE_NUMBER',
                    id: 'wamid.NFM',
                    interactive: {
                      nfm_reply: { body: 'Sent', name: 'flow', response_json: '{not json' },
                      type: 'nfm_reply'
                    },
                    timestamp: 'TIMESTAMP',
                    type: 'interactive'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
    const wsApi = makeWsApi(makeHttp())
    const result = await wsApi.handleWebhook(asRequest(bad))
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr().code).toBe('INVALID_FLOW_REPLY')
  })
})
