<script setup lang="ts">
import { ref } from 'vue'
import { useMessagesStore } from '@/stores/messagesStore'

const messages = useMessagesStore()
const content = ref('')
const file = ref<File | null>(null)

function addTextMessage() {
  messages.addMessage({
    type: 'text',
    text: content.value
  })
  content.value = ''
}

function addFileMessage(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file === undefined) return

  const reader = new FileReader()
  reader.onload = () => {
    messages.addMessage({
      type: 'file',
      file,
      link: reader.result as string
    })
  }
  reader.readAsDataURL(file)
  target.value = ''
}
</script>

<template>
  <div class="flex items-center gap-2 p-3 w-full bg-[#f0f2f5] rounded-b-lg">
    <label class="cursor-pointer hover:bg-gray-200 p-2 rounded-full">
      <input
        ref="file"
        type="file"
        class="hidden"
        accept="image/jpeg, image/png, video/mp4, video/3gp"
        @change="addFileMessage"
      >
      <span
        class="text-gray-500"
      ><svg
        viewBox="0 0 24 24"
        height="24"
        width="24"
      ><path
        d="M20.5 13.2501L20.5 10.7501L13.25 10.7501L13.25 3.5L10.75 3.5L10.75 10.7501L3.5 10.7501L3.5 13.2501L10.75 13.2501L10.75 20.5L13.25 20.5L13.25 13.2501L20.5 13.2501Z"
        fill="currentColor"
      /></svg></span>
    </label>

    <input
      v-model="content"
      type="text"
      class="rounded-md p-2 w-full focus:outline-none"
      placeholder="Type a message..."
      @keydown.enter="addTextMessage"
    >

    <span
      class="text-gray-500 cursor-pointer"
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