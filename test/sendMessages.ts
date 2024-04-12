import 'dotenv/config'
import {
  sendImage,
  sendText,
  sendVideo,
  sendDocument,
  sendAudio,
  sendButtonMessage,
  sendCTAButtonMessage,
  sendInteractiveListMessage
} from '../dist/messaging'

const phoneNumberToTest = '573202601178'

sendText(
  phoneNumberToTest,
  'Mensaje de prueba de librería'
).catch(console.error)

sendImage(
  phoneNumberToTest,
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
).catch(console.error)

sendVideo(
  phoneNumberToTest,
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
).catch(console.error)

sendDocument(
  phoneNumberToTest,
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
).catch(console.error)

sendAudio(
  phoneNumberToTest,
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
).catch(console.error)

sendButtonMessage(
  phoneNumberToTest,
  {
    text: 'Botón de prueba',
    buttons: [
      {
        title: 'Botón 1',
        id: '1'
      },
      {
        title: 'Botón 2',
        id: '2'
      }
    ]
  }
).catch(console.error)

sendInteractiveListMessage(
  phoneNumberToTest,
  {
    text: 'Lista de prueba',
    buttonText: 'Botón de lista',
    list: [
      {
        title: 'Elemento 1',
        description: 'Descripción 1'
      },
      {
        title: 'Elemento 2',
        description: 'Descripción 2'
      }
    ]
  }
).catch(console.error)

sendCTAButtonMessage(
  phoneNumberToTest,
  {
    text: 'Botón CTA',
    buttonText: 'Botón CTA',
    url: 'https://www.google.com'
  }
).catch(console.error)
