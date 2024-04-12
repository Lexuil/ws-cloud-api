import { handleWebhook } from '../dist/webhook'
import textBody from './bodyExamples/messageText.json'
import replyButtonBody from './bodyExamples/messageFromButton.json'
import replyListBody from './bodyExamples/messageFromList.json'

console.log('Text message')
console.log(handleWebhook(textBody))

console.log('\nReply button message')
console.log(handleWebhook(replyButtonBody))

console.log('\nReply list message')
console.log(handleWebhook(replyListBody))
