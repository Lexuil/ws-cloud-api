import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import {
  sendImage,
  sendText,
  sendVideo,
  sendDocument,
  sendAudio,
  sendButtonMessage,
  sendCTAButtonMessage,
  sendInteractiveListMessage,
  sendInteractiveSectionListMessage,
  sendFlowMessage,
  sendFile,
  sendContact
} from '../../dist/messaging'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const messageType = process.argv[2]

const messageFunctions: Record<string, () => Promise<boolean>> = {
  'text': async () => {
    const response = await sendText({
      to: phoneNumberToTest,
      message: 'Test message from library'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'contact': async () => {
    const response = await sendContact({
      to: phoneNumberToTest,
      contacts: [{
        name: {
          formatted_name: 'Test 1',
          first_name: 'Test',
          last_name: 'Test 1'
        },
        phones: [
          {
            phone: '+57123456789',
            type: 'Mobile',
            wa_id: '57123456789'
          }
        ]
      }, {
        name: {
          formatted_name: 'Test 2',
          first_name: 'Test',
          last_name: 'Test 2'
        },
        phones: [
          {
            phone: '+57123456780',
            type: 'Mobile',
            wa_id: '57123456780'
          }
        ]
      }]
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'image': async () => {
    const response = await sendImage({
      to: phoneNumberToTest,
      link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'video': async () => {
    const response = await sendVideo({
      to: phoneNumberToTest,
      link: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'document': async () => {
    const response = await sendDocument({
      to: phoneNumberToTest,
      link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      filename: 'dummy.pdf',
      caption: 'Test document'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'audio': async () => {
    const response = await sendAudio({
      to: phoneNumberToTest,
      link: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'file': async () => {
    const image = new Blob(
      [fs.readFileSync(path.join(__dirname, '/assets/kirby.jpg'))],
      { type: 'image/jpeg' }
    )

    const response = await sendFile({
      to: phoneNumberToTest,
      file: image
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'buttons': async () => {
    const response = await sendButtonMessage({
      to: phoneNumberToTest,
      message: {
        text: 'Test button',
        buttons: [
          {
            title: 'Button 1',
            id: '1'
          },
          {
            title: 'Button 2',
            id: '2'
          }
        ]
      }
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'list': async () => {
    const response = await sendInteractiveListMessage({
      to: phoneNumberToTest,
      list: {
        text: 'Test list',
        buttonText: 'List button',
        list: [
          {
            title: 'Element 1',
            description: 'Description 1'
          },
          {
            title: 'Element 2',
            description: 'Description 2'
          }
        ]
      }
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'cta-button': async () => {
    const response = await sendCTAButtonMessage({
      to: phoneNumberToTest,
      message: {
        text: 'CTA button',
        buttonText: 'CTA button',
        url: 'https://www.google.com'
      }
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'section-list': async () => {
    const response = await sendInteractiveSectionListMessage({
      to: phoneNumberToTest,
      list: {
        text: 'Test section list',
        buttonText: 'Section list button',
        sections: [
          {
            sectionTitle: 'Section 1',
            list: [
              {
                title: 'Element 1',
                description: 'Description 1'
              },
              {
                title: 'Element 2',
                description: 'Description 2'
              }
            ]
          },
          {
            sectionTitle: 'Section 2',
            list: [
              {
                title: 'Element 3',
                description: 'Description 3'
              },
              {
                title: 'Element 4',
                description: 'Description 4'
              }
            ]
          }
        ]
      }
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  },
  'flow': async () => {
    const response = await sendFlowMessage({
      to: phoneNumberToTest,
      flow: {
        id: process.env.FLOW_MESSAGE_ID ?? '',
        text: 'Test flow',
        token: 'token',
        ctaText: 'View flow',
        defaultScreen: process.env.FLOW_MESSAGE_DEFAULT_SCREEN ?? ''
      },
      draft: true
    })

    if (!response.success) {
      console.error('Error: ', response.error)
    }
    else {
      console.log(response.response)
    }

    return response.success
  }
}

if (messageType in messageFunctions) {
  messageFunctions[messageType]()
    .then((success) => { if (success) console.log('Message sent') })
    .catch(console.error)
}
else if (messageType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' +
    Object.keys(messageFunctions).join('\n -')
  )
}
else {
  console.error(`Message type ${messageType} not found`)
}
