import { Message } from "@/stores/messagesStore"
import {
  sendText,
  sendImage,
  sendVideo,
  sendFile
} from '../../../dist/messaging'
import { useConfigStore } from "@/stores/configStore"
import { toast } from 'vue-sonner'
import { ref } from "vue"

export default function () {
  const config = useConfigStore()

  const sendingMessages = ref(false)

  async function sendMessages (messages: Message[]) {
    if (sendingMessages.value) return

    sendingMessages.value = true
    const paymentToast = toast.loading('Sending messages...')

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
        case 'file':
          await sendFile({
            file: message.file,
            to: config.phoneNumberTo,
            config: {
              phoneNumberId: config.phoneNumberId,
              token: config.token
            }
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          break
      }
    }

    toast.success('Messages sent!', {
      id: paymentToast
    })
    sendingMessages.value = false
  }

  return {
    sendingMessages,
    sendMessages
  };
}
