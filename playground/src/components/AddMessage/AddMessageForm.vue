<script setup lang="ts">
import { ref } from 'vue'
import AddTextMessageInput from './AddTextMessageInput.vue'
import AddMediaMessageInput from './AddMediaMessageInput.vue'
import { useMessagesStore, Message } from '../../stores/messagesStore'

const messages = useMessagesStore()
const type = ref<Message['type']>('text')
const content = ref('')

function addMessage() {
  if (type.value === 'text') {
    messages.addMessage({
      type: type.value,
      text: content.value
    })
  } else {
    messages.addMessage({
      type: type.value,
      link: content.value
    })
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-3 w-96 h-fit border border-gray-300 p-5 rounded-md">
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
    <AddMediaMessageInput v-else />

    <button
      class="bg-blue-500 text-white p-2 rounded-md w-full"
      @click="addMessage"
    >
      Add message
    </button>
  </div>
</template>