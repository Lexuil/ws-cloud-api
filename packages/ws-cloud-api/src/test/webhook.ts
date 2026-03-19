import 'dotenv/config'
import replyButtonBody from './bodyExamples/messageFromButton.json'
import replyListBody from './bodyExamples/messageFromList.json'
import textBody from './bodyExamples/messageText.json'
import voiceAudioBody from './bodyExamples/messageVoiceAudio.json'

console.log('Text message')
console.log(handleWebhook(textBody))

console.log('\nReply button message')
console.log(handleWebhook(replyButtonBody))

console.log('\nReply list message')
console.log(handleWebhook(replyListBody))

// Test audio message
console.log('\nVoice audio message')
const audioResponse = handleWebhook(voiceAudioBody)
console.log(audioResponse)
