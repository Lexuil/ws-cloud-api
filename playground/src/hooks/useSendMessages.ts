import { Message } from "@/stores/messagesStore"
import { sendText, sendImage, sendVideo } from '../../../dist/messaging'
import { useConfigStore } from "@/stores/configStore"

export default function () {
  const config = useConfigStore()

  async function sendMessages (messages: Message[]) {
    for (const message of messages) {
      switch (message.type) {
        case 'text':
          await sendText({
            message: message.text,
            to: config.phoneNumberTo,
            config: {
              phoneNumberId: config.phoneNumberId,
              token: config.token
            }
          })
          break
        case 'image':
          await sendImage({
            link: message.link,
            to: config.phoneNumberTo,
            config: {
              phoneNumberId: config.phoneNumberId,
              token: config.token
            }
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          break
        case 'video':
          await sendVideo({
            link: message.link,
            to: config.phoneNumberTo,
            config: {
              phoneNumberId: config.phoneNumberId,
              token: config.token
            }
          })
          await new Promise(resolve => setTimeout(resolve, 3000))
          break
      }
    }
  }

  return { sendMessages };
}
