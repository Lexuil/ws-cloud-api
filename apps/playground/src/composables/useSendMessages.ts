import { computed, ref } from 'vue'
import type { Ref, ComputedRef } from 'vue'

import { toast } from 'vue-sonner'
import {
  sendButtonMessage,
  sendFile,
  sendImage,
  sendInteractiveListMessage,
  sendText,
  sendVideo
} from 'ws-cloud-api/messaging'

import type { Message } from '@/stores/messagesStore'

import { useConfigStore } from '@/stores/configStore'

export default function (): {
  sendingMessages: Ref<boolean>
  availableToSend: ComputedRef<boolean>
  sendMessages: (messages: Message[]) => Promise<void>
} {
  const config = useConfigStore()

  const sendingMessages = ref(false)

  const availableToSend = computed(
    () =>
      config.phoneNumberId === '' ||
      config.token === '' ||
      config.phoneNumberTo === '' ||
      sendingMessages.value
  )

  async function sendMessages(messages: Message[]): Promise<void> {
    if (sendingMessages.value) {
      return
    }

    sendingMessages.value = true
    const paymentToast = toast.loading('Sending messages...')

    const wsConfig = { phoneNumberId: config.phoneNumberId, token: config.token }

    for (const message of messages) {
      switch (message.type) {
        case 'text': {
          await sendText({
            config: wsConfig,
            message: message.text,
            previewUrl: true,
            to: config.phoneNumberTo
          })
          break
        }
        case 'image': {
          await sendImage({ config: wsConfig, link: message.link, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 1000))
          break
        }
        case 'video': {
          await sendVideo({ config: wsConfig, link: message.link, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 3000))
          break
        }
        case 'file': {
          await sendFile({ config: wsConfig, file: message.file, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 1000))
          break
        }
        case 'button': {
          await sendButtonMessage({
            config: wsConfig,
            message: {
              text: message.text,
              buttons: message.buttons
                .filter((button) => button !== '')
                .map((button) => ({ id: button, title: button }))
            },
            to: config.phoneNumberTo
          })
          break
        }
        case 'list': {
          await sendInteractiveListMessage({
            config: wsConfig,
            list: { ...message, list: message.list.filter((item) => item.title !== '') },
            to: config.phoneNumberTo
          })
          break
        }
      }
    }

    toast.success('Messages sent!', { id: paymentToast })
    sendingMessages.value = false
  }

  return { availableToSend, sendMessages, sendingMessages }
}
