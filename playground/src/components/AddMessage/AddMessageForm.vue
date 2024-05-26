<script setup lang="ts">
import { ref } from 'vue'
import AddTextMessageInput from './AddTextMessageInput.vue'
import AddMediaMessageInput from './AddMediaMessageInput.vue'
import { useMessagesStore, type Message } from '@/stores/messagesStore'

const messages = useMessagesStore()
const type = ref<Message['type']>('text')
const content = ref('')

function addMessage (): void {
  if (type.value === 'text') {
    messages.addMessage({
      id: Date.now(),
      type: type.value,
      text: content.value
    })
  } else if (type.value === 'image' || type.value === 'video') {
    messages.addMessage({
      id: Date.now(),
      type: type.value,
      link: content.value
    })
  }
  content.value = ''
}
</script>

<template>
  <form
    class="flex flex-col items-center gap-3 w-full sm:w-96 h-fit border border-gray-300 p-5 rounded-md"
    @submit.prevent="addMessage"
  >
    <h2 class="text-2xl font-bold">
      Add message
    </h2>

    <select
      v-model="type"
      name="type"
      class="border border-gray-300 rounded-md p-2 w-full"
    >
      <option value="text">
        Text
      </option>
      <option value="image">
        Image
      </option>
      <option value="audio">
        Audio
      </option>
      <option value="video">
        Video
      </option>
      <option value="document">
        Document
      </option>
    </select>

    <AddTextMessageInput
      v-if="type === 'text'"
      v-model="content"
    />
    <AddMediaMessageInput
      v-else
      v-model="content"
    />

    <button
      type="submit"
      class="bg-green-500 text-white p-2 rounded-md w-full"
    >
      Add message
    </button>
  </form>
</template>
