import 'dotenv/config'
import { ParametersTypes } from 'ws-cloud-api'
import {
  createTemplate,
  getTemplates,
  sendAuthTemplate,
  sendFlowTemplate,
  sendMediaTemplate,
  sendTextTemplate
} from 'ws-cloud-api/templates'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const templateType = process.argv[2]

const messageFunctions: Record<string, () => Promise<boolean>> = {
  'auth-code': async () => {
    const response = await sendAuthTemplate({
      code: '123',
      language: 'es',
      templateName: 'auth_code',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'create-template': async () => {
    const response = await createTemplate({
      template: {
        category: 'MARKETING',
        components: [
          {
            example: { body_text: ['Juan'] },
            text: 'Hola {{1}}, esto es una prueba',
            type: 'BODY'
          },
          {
            buttons: [{ text: 'Ver más', type: 'URL', url: 'https://www.google.com' }],
            type: 'BUTTONS'
          }
        ],
        language: 'es',
        name: `test_${Date.now()}`
      }
    })

    if (!response.success) {
      console.error('Error:', response.error)
      return false
    }

    console.log(response.data)

    return true
  },
  flow: async () => {
    const response = await sendFlowTemplate({
      flow: {},
      language: 'es',
      templateName: 'flow_test',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'get-2': async () => {
    const response = await getTemplates({ limit: 2 })
    if (!response.success) {
      console.error('Error:', response.error)
      return false
    }
    console.log(response.data)
    return true
  },
  'get-all': async () => {
    const response = await getTemplates()
    if (!response.success) {
      console.error('Error:', response.error)
      return false
    }
    console.log(response.data)
    return true
  },
  'get-names': async () => {
    const response = await getTemplates({ fields: ['name'] })
    if (!response.success) {
      console.error('Error:', response.error)
      return false
    }
    console.log(response.data)
    return true
  },
  'get-pagination': async () => {
    const page1 = await getTemplates({ limit: 2 })
    if (!page1.success) {
      console.error('Error:', page1.error)
      return false
    }
    console.log('page1', page1.data)
    const page2 = await getTemplates({ after: page1.data.paging.cursors.after, limit: 2 })
    if (!page2.success) {
      console.error('Error:', page2.error)
      return false
    }
    console.log('page2', page2.data)
    return true
  },
  'media-image': async () => {
    const response = await sendMediaTemplate({
      bodyParameters: [{ text: 'Joel', type: ParametersTypes.Text }],
      headerParameters: {
        image: {
          link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
        },
        type: ParametersTypes.Image
      },
      language: 'en_US',
      templateName: 'hello_world_image',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  text: async () => {
    const response = await sendTextTemplate({
      language: 'en_US',
      templateName: 'hello_world',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response.messages[0].id)
    }

    return response.success
  },
  'text-named-parameters': async () => {
    const response = await sendTextTemplate({
      language: 'es',
      parameters: [
        { parameter_name: 'username', text: 'John', type: ParametersTypes.Text },
        { parameter_name: 'agent', text: 'Michael', type: ParametersTypes.Text }
      ],
      templateName: 'named_parameters_test',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'text-parameters': async () => {
    const response = await sendTextTemplate({
      language: 'en',
      parameters: [
        { text: 'John', type: ParametersTypes.Text },
        { text: 'Michael', type: ParametersTypes.Text }
      ],
      templateName: 'hello_world_parameters',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  }
}

if (templateType in messageFunctions) {
  messageFunctions[templateType]()
    .then((success) => {
      if (success) {
        console.log('Test end')
      }
    })
    .catch(console.error)
} else if (templateType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' + Object.keys(messageFunctions).join('\n -')
  )
} else {
  console.error(`Message type ${templateType} not found`)
}
