<script setup lang="ts">
import { useMessagesStore } from '@/stores/messagesStore'
import useSendMessages from '@/composables/useSendMessages'

const messages = useMessagesStore()
const { sendMessages, sendingMessages, availableToSend } = useSendMessages()
</script>

<template>
  <div class="flex flex-col items-center gap-3 w-full sm:w-96 h-fit border border-gray-300 p-5 rounded-md">
    <h2 class="text-2xl font-bold">
      Messaging
    </h2>

    <button
      class="bg-green-500 text-lg text-white px-3 py-1 rounded-md disabled:bg-gray-300 w-full"
      :disabled="availableToSend || messages.messages.length === 0"
      @click="sendMessages(messages.messages)"
    >
      {{ sendingMessages ? 'Sending...' : 'Send messages' }}
    </button>
    <button
      class="bg-red-500 text-lg text-white px-3 py-1 rounded-md disabled:bg-gray-300 w-full"
      :disabled="messages.messages.length === 0"
      @click="messages.clearMessages()"
    >
      Clear messages
    </button>
  </div>
</template>
