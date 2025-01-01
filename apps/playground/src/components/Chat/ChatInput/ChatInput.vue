<script setup lang="ts">
import { ref } from 'vue'
import { useMessagesStore } from '@/stores/messagesStore'
import ChatInputButton from './ChatInputButton/ChatInputButton.vue'

const messages = useMessagesStore()
const content = ref('')
const textArea = ref<HTMLTextAreaElement | null>(null)

function addTextMessage(): void {
  if (content.value.trim() === '') return

  messages.addMessage({
    id: Date.now(),
    type: 'text',
    text: content.value.trim()
  })
  content.value = ''
  textArea.value?.style.setProperty('height', '40px')
}

function resize(): void {
  if (textArea.value === null) return
  textArea.value.style.height = '18px'
  textArea.value.style.height = textArea.value.scrollHeight + 'px'
}
</script>

<template>
  <div class="flex items-center gap-2 p-3 w-full bg-ws-ui-bg text-ws-ui-text rounded-b-lg">
    <ChatInputButton />

    <textarea
      ref="textArea"
      v-model="content"
      class="resize-none"
      placeholder="Type a message..."
      rows="1"
      @keydown.enter.exact.prevent="addTextMessage"
      @input="resize"
    />

    <span
      class="text-ws-icon cursor-pointer"
    ><svg
      viewBox="0 0 24 24"
      height="24"
      width="24"
    ><path
      fill="currentColor"
      d="M11.999,14.942c2.001,0,3.531-1.53,3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531 S8.469,2.35,8.469,4.35v7.061C8.469,13.412,9.999,14.942,11.999,14.942z M18.237,11.412c0,3.531-2.942,6.002-6.237,6.002 s-6.237-2.471-6.237-6.002H3.761c0,4.001,3.178,7.297,7.061,7.885v3.884h2.354v-3.884c3.884-0.588,7.061-3.884,7.061-7.885 L18.237,11.412z"
    /></svg></span>
  </div>
</template>
