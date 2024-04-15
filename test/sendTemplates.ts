import 'dotenv/config'
import { sendTextTemplate } from '../dist/templates'

sendTextTemplate(
  process.env.PHONE_NUMBER_RECIPIENT ?? '',
  'hello_world',
  'en_US'
).catch(console.error)
