import { computed, ref } from 'vue'
import type { Ref, ComputedRef } from 'vue'

import { toast } from 'vue-sonner'
import { WsApi } from 'ws-cloud-api'

import type { Message } from '@/stores/messagesStore'

import { useConfigStore } from '@/stores/configStore'

export default function useSendMessages(): {
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

  // oxlint-disable-next-line max-statements
  async function sendMessages(messages: Message[]): Promise<void> {
    if (sendingMessages.value) {
      return
    }

    sendingMessages.value = true
    const paymentToast = toast.loading('Sending messages...')

    const ws = new WsApi({ phoneNumberId: config.phoneNumberId, token: config.token })

    for (const message of messages) {
      let result

      switch (message.type) {
        case 'text': {
          result = await ws.sendText({
            message: message.text,
            previewUrl: true,
            to: config.phoneNumberTo
          })
          break
        }
        case 'image': {
          result = await ws.sendImage({ data: { link: message.link }, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 1000))
          break
        }
        case 'video': {
          result = await ws.sendVideo({ data: { link: message.link }, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 3000))
          break
        }
        case 'file': {
          result = await ws.sendFile({ data: { file: message.file }, to: config.phoneNumberTo })
          await new Promise((resolve) => setTimeout(resolve, 1000))
          break
        }
        case 'button': {
          result = await ws.sendButtonMessage({
            data: {
              buttons: message.buttons
                .filter((button) => button !== '')
                .map((button) => ({ id: button, title: button })),
              text: message.text
            },
            to: config.phoneNumberTo
          })
          break
        }
        case 'list': {
          result = await ws.sendInteractiveListMessage({
            data: {
              buttonText: message.buttonText,
              list: [
                { listItems: message.list.filter((item) => item.title !== ''), sectionTitle: '' }
              ],
              text: message.text
            },
            to: config.phoneNumberTo
          })
          break
        }
      }

      if (result && result.isErr()) {
        toast.error(`Failed: ${result.error.code}`)
        toast.success('Messages sent!', { id: paymentToast })
        sendingMessages.value = false
        return
      }
    }

    toast.success('Messages sent!', { id: paymentToast })
    sendingMessages.value = false
  }

  return { availableToSend, sendMessages, sendingMessages }
}
