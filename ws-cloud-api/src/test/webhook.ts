import 'dotenv/config'
import { handleWebhook } from '../../dist/webhook'
import textBody from './bodyExamples/messageText.json'
import replyButtonBody from './bodyExamples/messageFromButton.json'
import replyListBody from './bodyExamples/messageFromList.json'
import voiceAudioBody from './bodyExamples/messageVoiceAudio.json'
import { getMedia, getMediaUrl } from '../../dist/media'
import fs from 'fs'
import type { WsRequest } from '../../dist'

console.log('Text message')
console.log(handleWebhook(textBody as WsRequest))

console.log('\nReply button message')
console.log(handleWebhook(replyButtonBody as WsRequest))

console.log('\nReply list message')
console.log(handleWebhook(replyListBody as WsRequest))

// Test audio message
console.log('\nVoice audio message')
const audioResponse = handleWebhook(voiceAudioBody as WsRequest)
if (audioResponse?.type === 'voiceAudio') {
  getMediaUrl({ mediaId: audioResponse.audio.id })
    .then(mediaUrl => {
      console.log(mediaUrl)
      getMedia({ mediaUrl })
        .then(media => {
          // Save blob media to file
          media.arrayBuffer()
            .then(arrayBuffer => {
              const array = new Uint8Array(arrayBuffer)
              fs.writeFileSync('audio.ogg', Buffer.from(array))
            })
            .catch(console.error)
        })
        .catch(console.error)
    })
    .catch(console.error)
}
