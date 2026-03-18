import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import {
  sendAudio,
  sendButtonMessage,
  sendCTAButtonMessage,
  sendContact,
  sendDocument,
  sendFile,
  sendFlowMessage,
  sendImage,
  sendInteractiveListMessage,
  sendInteractiveSectionListMessage,
  sendText,
  sendTypingIndicator,
  sendVideo
} from 'ws-cloud-api/messaging'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const messageType = process.argv[2]

const messageFunctions: Record<string, () => Promise<boolean>> = {
  audio: async () => {
    const response = await sendAudio({
      link: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  buttons: async () => {
    const response = await sendButtonMessage({
      message: {
        buttons: [
          { id: '1', title: 'Button 1' },
          { id: '2', title: 'Button 2' }
        ],
        text: 'Test button'
      },
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  contact: async () => {
    const response = await sendContact({
      contacts: [
        {
          name: { first_name: 'Test', formatted_name: 'Test 1', last_name: 'Test 1' },
          phones: [{ phone: '+57123456789', type: 'Mobile', wa_id: '57123456789' }]
        },
        {
          name: { first_name: 'Test', formatted_name: 'Test 2', last_name: 'Test 2' },
          phones: [{ phone: '+57123456780', type: 'Mobile', wa_id: '57123456780' }]
        }
      ],
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'cta-button': async () => {
    const response = await sendCTAButtonMessage({
      message: { buttonText: 'CTA button', text: 'CTA button', url: 'https://www.google.com' },
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  document: async () => {
    const response = await sendDocument({
      caption: 'Test document',
      filename: 'dummy.pdf',
      link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  file: async () => {
    const image = new Blob([fs.readFileSync(path.join(__dirname, '/assets/kirby.jpg'))], {
      type: 'image/jpeg'
    })

    const response = await sendFile({ file: image, to: phoneNumberToTest })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  flow: async () => {
    const response = await sendFlowMessage({
      draft: true,
      flow: {
        ctaText: 'View flow',
        defaultScreen: process.env.FLOW_MESSAGE_DEFAULT_SCREEN ?? '',
        id: process.env.FLOW_MESSAGE_ID ?? '',
        text: 'Test flow',
        token: 'token'
      },
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  image: async () => {
    const response = await sendImage({
      link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  list: async () => {
    const response = await sendInteractiveListMessage({
      list: {
        buttonText: 'List button',
        list: [
          { description: 'Description 1', title: 'Element 1' },
          { description: 'Description 2', title: 'Element 2' }
        ],
        text: 'Test list'
      },
      to: phoneNumberToTest
    })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'section-list': async () => {
    const response = await sendInteractiveSectionListMessage({
      list: {
        buttonText: 'Section list button',
        sections: [
          {
            list: [
              { description: 'Description 1', title: 'Element 1' },
              { description: 'Description 2', title: 'Element 2' }
            ],
            sectionTitle: 'Section 1'
          },
          {
            list: [
              { description: 'Description 3', title: 'Element 3' },
              { description: 'Description 4', title: 'Element 4' }
            ],
            sectionTitle: 'Section 2'
          }
        ],
        text: 'Test section list'
      },
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
    const response = await sendText({ message: 'Test message from library', to: phoneNumberToTest })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  'typing-indicator': async (): Promise<boolean> => {
    const response = await sendTypingIndicator({ input: { messageId: 'wamid.HBgMNTczM' } })

    if (!response.success) {
      console.error('Error:', response.error)
    } else {
      console.log(response.response)
    }

    return response.success
  },
  video: async () => {
    const response = await sendVideo({
      link: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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

if (messageType in messageFunctions) {
  messageFunctions[messageType]()
    .then((success) => {
      if (success) {
        console.log('Message sent')
      }
    })
    .catch(console.error)
} else if (messageType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' + Object.keys(messageFunctions).join('\n -')
  )
} else {
  console.error(`Message type ${messageType} not found`)
}
