import 'dotenv/config'
import {
  sendImage,
  sendText,
  sendVideo,
  sendButtonMessage
} from '../dist/index'

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

sendButtonMessage(
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
  },
  phoneNumberToTest
).catch(console.error)
