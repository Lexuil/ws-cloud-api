import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Message = TextMessage | FileMessage | MediaMessage

interface TextMessage {
  id: number
  type: 'text'
  text: string
}

interface FileMessage {
  id: number
  type: 'file'
  file: Blob
  link: string
}

interface MediaMessage {
  id: number
  type: 'image' | 'video' | 'audio' | 'document'
  link: string
}

export const useMessagesStore = defineStore('messages', () => {
  // States
  const messages = ref<Message[]>([])

  // Actions
  function addMessage(message: Message) {
    messages.value.push(message)
  }

  function removeMessage(id: number) {
    messages.value = messages.value.filter((message) => message.id !== id)
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages,
    addMessage,
    removeMessage,
    clearMessages
  }
})