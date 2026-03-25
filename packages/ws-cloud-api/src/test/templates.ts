// oxlint-disable promise/prefer-await-to-then
// oxlint-disable max-statements
import { WsApi, ParametersTypes } from 'ws-cloud-api'

const JSON_PARSE_SPACE = 2

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const [__, ___, templateType] = process.argv

const wsApi = new WsApi()

function strJson(json: object) {
  try {
    return JSON.stringify(json, undefined, JSON_PARSE_SPACE)
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return
  }
}

const messageFunctions: Record<string, () => Promise<boolean>> = {
  'auth-code': async () => {
    const response = await wsApi.sendAuthTemplate({
      data: { code: '123456', language: 'es', name: 'authentication_code' },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }

    console.log(response.value)

    return true
  },
  'create-template': async () => {
    const response = await wsApi.createTemplate({
      template: {
        category: 'marketing',
        components: [
          {
            example: { body_text: ['Juan'] },
            text: 'Hola {{1}}, esto es una prueba',
            type: 'body'
          },
          {
            buttons: [{ text: 'Ver más', type: 'url', url: 'https://www.google.com' }],
            type: 'buttons'
          }
        ],
        language: { code: 'es' },
        name: `test_${Date.now()}`
      }
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }

    console.log(response.value)

    return true
  },
  flow: async () => {
    const response = await wsApi.sendFlowTemplate({
      data: {
        components: [
          {
            index: '0',
            parameters: [{ action: { flow_token: '123456' }, type: 'action' }],
            sub_type: 'flow',
            type: 'button'
          }
        ],
        language: { code: 'es' },
        name: 'mental_health_flow_test'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }
    console.log(strJson(response.value))
    return true
  },
  'get-2': async () => {
    const response = await wsApi.getTemplates({ limit: 2 })
    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }
    console.log(strJson(response.value))
    return true
  },
  'get-all': async () => {
    const response = await wsApi.getTemplates()
    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }
    console.log(strJson(response.value))
    return true
  },
  'get-names': async () => {
    const response = await wsApi.getTemplates({ fields: ['name'] })
    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }
    console.log(strJson(response.value))
    return true
  },
  'get-pagination': async () => {
    const page1 = await wsApi.getTemplates({ limit: 2 })
    if (page1.isErr()) {
      console.error('Error:', page1.error)
      return false
    }
    console.log('page1', strJson(page1.value))
    const page2 = await wsApi.getTemplates({
      after: page1.value.response.paging.cursors.after,
      limit: 2
    })
    if (page2.isErr()) {
      console.error('Error:', page2.error)
      return false
    }
    console.log('page2', strJson(page2.value))
    return true
  },
  'media-image': async () => {
    const response = await wsApi.sendMediaTemplate({
      data: {
        components: [
          {
            parameters: [
              {
                image: {
                  link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
                },
                type: 'image'
              }
            ],
            type: 'header'
          },
          { parameters: [{ text: 'Joel', type: 'text' }], type: 'body' }
        ],
        language: { code: 'en_US' },
        name: 'hello_world_image'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(strJson(response.value))
    }

    return !response.isErr()
  },
  text: async () => {
    const response = await wsApi.sendTextTemplate({
      data: { language: { code: 'en_US' }, name: 'hello_world' },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
      return false
    }
    console.log(strJson(response.value))
    return true
  },
  'text-named-parameters': async () => {
    const response = await wsApi.sendTextTemplate({
      data: {
        components: [
          {
            parameters: [
              { parameter_name: 'username', text: 'John', type: 'text' },
              { parameter_name: 'agent', text: 'Michael', type: 'text' }
            ],
            type: 'body'
          }
        ],
        language: { code: 'es' },
        name: 'named_parameters_test'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return !response.isErr()
  },
  'text-parameters': async () => {
    const response = await wsApi.sendTextTemplate({
      data: {
        components: [
          {
            parameters: [
              { text: 'John', type: ParametersTypes.Text },
              { text: 'Michael', type: ParametersTypes.Text }
            ],
            type: 'body'
          }
        ],
        language: { code: 'en' },
        name: 'hello_world_parameters'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return !response.isErr()
  }
}

if (templateType in messageFunctions) {
  messageFunctions[templateType]()
    .then((success) => {
      if (success) {
        console.log('Test end')
      }
      return
    })
    .catch(console.error)
} else if (templateType === undefined) {
  console.error(
    `Message type not provided\n\nAvailable types:\n -${Object.keys(messageFunctions).join('\n -')}`
  )
} else {
  console.error(`Message type ${templateType} not found`)
}
