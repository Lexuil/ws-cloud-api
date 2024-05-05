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
  sendFile
} from '../../dist/messaging'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const messageType = process.argv[2]

const messageFunctions: Record<string, () => Promise<boolean>> = {
  text: async () => await sendText({
    to: phoneNumberToTest,
    message: 'Test message from library'
  }),
  image: async () => await sendImage({
    to: phoneNumberToTest,
    link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
  }),
  video: async () => await sendVideo({
    to: phoneNumberToTest,
    link: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  }),
  document: async () => await sendDocument({
    to: phoneNumberToTest,
    link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }),
  audio: async () => await sendAudio({
    to: phoneNumberToTest,
    link: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  }),
  file: async () => {
    const image = new Blob(
      [fs.readFileSync(path.join(__dirname, '/assets/kirby.jpg'))],
      { type: 'image/jpeg' }
    )

    return await sendFile({
      to: phoneNumberToTest,
      file: image
    })
  },
  buttons: async () => await sendButtonMessage({
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
  }),
  list: async () => await sendInteractiveListMessage({
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
  }),
  'cta-button': async () => await sendCTAButtonMessage({
    to: phoneNumberToTest,
    message: {
      text: 'CTA button',
      buttonText: 'CTA button',
      url: 'https://www.google.com'
    }
  }),
  'section-list': async () => await sendInteractiveSectionListMessage({
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
  }),
  flow: async () => await sendFlowMessage({
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
}

if (messageType in messageFunctions) {
  messageFunctions[messageType]()
    .then((success) => { if (success) console.log('Message sent') })
    .catch(console.error)
} else if (messageType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' +
    Object.keys(messageFunctions).join('\n -')
  )
} else {
  console.error(`Message type ${messageType} not found`)
}
