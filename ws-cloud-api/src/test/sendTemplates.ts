import 'dotenv/config'
import { sendTextTemplate } from '../../dist/templates'
import { ParametersTypes } from '../../dist'

sendTextTemplate({
  to: process.env.PHONE_NUMBER_RECIPIENT ?? '',
  templateName: 'hello_world',
  language: 'en_US'
}).catch(console.error)

sendTextTemplate({
  to: process.env.PHONE_NUMBER_RECIPIENT ?? '',
  templateName: 'hello_world',
  language: 'en_US',
  parameters: [
    {
      type: ParametersTypes.Text,
      text: 'Hello World'
    }
  ]
}).catch(console.error)
