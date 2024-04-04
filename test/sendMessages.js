import { sendImage, sendText, sendVideo } from '../dist/index.mjs'

const phoneNumberToTest = '573202601178'

sendText(
  phoneNumberToTest,
  'Mensaje de prueba de librería'
)

sendImage(
  phoneNumberToTest,
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
)

sendVideo(
  phoneNumberToTest,
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
)