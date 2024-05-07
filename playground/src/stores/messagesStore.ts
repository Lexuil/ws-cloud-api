import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Message = TextMessage |
FileMessage |
MediaMessage |
ButtonMessage |
ListMessage

interface TextMessage {
  id: number
  type: 'text'
  text: string
}

interface ButtonMessage {
  id: number
  type: 'button'
  text: string
  buttons: string[]
}

interface ListMessage {
  id: number
  type: 'list'
  text: string
  buttonText: string
  list: Array<{
    title: string
    description: string
  }>
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