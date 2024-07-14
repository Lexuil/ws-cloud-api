import 'dotenv/config'
import { sendTextTemplate } from '../../dist/templates'

sendTextTemplate({
  to: process.env.PHONE_NUMBER_RECIPIENT ?? '',
  templateName: 'hello_world',
  language: 'en_US'
}).catch(console.error)
