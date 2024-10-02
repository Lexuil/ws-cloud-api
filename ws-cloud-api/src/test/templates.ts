import 'dotenv/config'
import {
  sendMediaTemplate,
  sendTextTemplate,
  getTemplates
} from '../../dist/templates'
import { ParametersTypes } from '../../dist'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const templateType = process.argv[2]

const messageFunctions: Record<string, () => Promise<boolean>> = {
  text: async () => await sendTextTemplate({
    to: phoneNumberToTest,
    templateName: 'hello_world',
    language: 'en_US'
  }),
  'text-parameters': async () => await sendTextTemplate({
    to: phoneNumberToTest,
    templateName: 'hello_world_parameters',
    language: 'en',
    parameters: [
      {
        type: ParametersTypes.Text,
        text: 'John'
      },
      {
        type: ParametersTypes.Text,
        text: 'Michael'
      }
    ]
  }),
  'media-image': async () => await sendMediaTemplate({
    to: phoneNumberToTest,
    templateName: 'hello_world_image',
    headerParameters: {
      type: ParametersTypes.Image,
      image: {
        link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
      }
    },
    bodyParameters: [
      {
        type: ParametersTypes.Text,
        text: 'Joel'
      }
    ],
    language: 'en_US'
  }),
  'get-all': async () => {
    console.log(await getTemplates())
    return true
  }
}

if (templateType in messageFunctions) {
  messageFunctions[templateType]()
    .then((success) => { if (success) console.log('Message sent') })
    .catch(console.error)
} else if (templateType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' +
    Object.keys(messageFunctions).join('\n -')
  )
} else {
  console.error(`Message type ${templateType} not found`)
}
