import 'dotenv/config'
import { handleWebhook } from '../../dist/webhook'
import textBody from './bodyExamples/messageText.json'
import replyButtonBody from './bodyExamples/messageFromButton.json'
import replyListBody from './bodyExamples/messageFromList.json'
import voiceAudioBody from './bodyExamples/messageVoiceAudio.json'
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
console.log(audioResponse)