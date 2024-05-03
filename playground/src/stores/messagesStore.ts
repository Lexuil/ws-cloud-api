import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Message = TextMessage | MediaMessage

interface TextMessage {
  type: 'text'
  text: string
}

interface MediaMessage {
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

  return {
    messages,
    addMessage
  }
})