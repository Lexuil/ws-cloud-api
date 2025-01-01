import { type Message } from '@/stores/messagesStore'
import {
  sendText,
  sendImage,
  sendVideo,
  sendFile,
  sendButtonMessage,
  sendInteractiveListMessage
} from 'ws-cloud-api/messaging'
import { useConfigStore } from '@/stores/configStore'
import { toast } from 'vue-sonner'
import { type Ref, computed, ref, type ComputedRef } from 'vue'

export default function (): {
  sendingMessages: Ref<boolean>
  availableToSend: ComputedRef<boolean>
  sendMessages: (messages: Message[]) => Promise<void>
} {
  const config = useConfigStore()

  const sendingMessages = ref(false)

  const availableToSend = computed(() => {
    return config.phoneNumberId === '' ||
      config.token === '' ||
      config.phoneNumberTo === '' ||
      sendingMessages.value
  })

  async function sendMessages(messages: Message[]): Promise<void> {
    if (sendingMessages.value) return

    sendingMessages.value = true
    const paymentToast = toast.loading('Sending messages...')

    const wsConfig = {
      phoneNumberId: config.phoneNumberId,
      token: config.token
    }

    for (const message of messages) {
      switch (message.type) {
        case 'text':
          await sendText({
            message: message.text,
            to: config.phoneNumberTo,
            previewUrl: true,
            config: wsConfig
          })
          break
        case 'image':
          await sendImage({
            link: message.link,
            to: config.phoneNumberTo,
            config: wsConfig
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          break
        case 'video':
          await sendVideo({
            link: message.link,
            to: config.phoneNumberTo,
            config: wsConfig
          })
          await new Promise(resolve => setTimeout(resolve, 3000))
          break
        case 'file':
          await sendFile({
            file: message.file,
            to: config.phoneNumberTo,
            config: wsConfig
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          break
        case 'button':
          await sendButtonMessage({
            message: {
              text: message.text,
              buttons: message.buttons
                .filter(button => button !== '')
                .map(button => ({
                  id: button,
                  title: button
                }))
            },
            to: config.phoneNumberTo,
            config: wsConfig
          })
          break
        case 'list':
          await sendInteractiveListMessage({
            list: {
              ...message,
              list: message.list.filter(item => item.title !== '')
            },
            to: config.phoneNumberTo,
            config: wsConfig
          })
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
    availableToSend,
    sendMessages
  }
}
