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
  'text': async () => {
    const response = await sendTextTemplate({
      to: phoneNumberToTest,
      templateName: 'hello_world',
      language: 'en_US'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response.messages[0].id)
    }

    return response.success
  },
  'text-parameters': async () => {
    const response = await sendTextTemplate({
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
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'media-image': async () => {
    const response = await sendMediaTemplate({
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
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'get-all': async () => {
    const response = await getTemplates()
    if (!response.success) {
      console.error('Error: ', response.error)
      return false
    }
    console.log(response.templates)
    return true
  },
  'get-names': async () => {
    const response = await getTemplates({ fields: ['name'] })
    if (!response.success) {
      console.error('Error: ', response.error)
      return false
    }
    console.log(response.templates)
    return true
  },
  'get-2': async () => {
    const response = await getTemplates({ limit: 2 })
    if (!response.success) {
      console.error('Error: ', response.error)
      return false
    }
    console.log(response.templates)
    return true
  },
  'get-pagination': async () => {
    const page1 = await getTemplates({ limit: 2 })
    if (!page1.success) {
      console.error('Error: ', page1.error)
      return false
    }
    console.log('page1', page1.templates)
    const page2 = await getTemplates({
      limit: 2,
      after: page1.templates.paging.cursors.after
    })
    if (!page2.success) {
      console.error('Error: ', page2.error)
      return false
    }
    console.log('page2', page2.templates)
    return true
  }
}

if (templateType in messageFunctions) {
  messageFunctions[templateType]()
    .then((success) => { if (success) console.log('Test end') })
    .catch(console.error)
}
else if (templateType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' +
    Object.keys(messageFunctions).join('\n -')
  )
}
else {
  console.error(`Message type ${templateType} not found`)
}
