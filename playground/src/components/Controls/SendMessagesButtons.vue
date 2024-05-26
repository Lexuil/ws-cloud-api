<script setup lang="ts">
import { useMessagesStore } from '@/stores/messagesStore'
import useSendMessages from '@/composables/useSendMessages'

const messages = useMessagesStore()
const { sendMessages, sendingMessages, availableToSend } = useSendMessages()
</script>

<template>
  <div class="box">
    <h2 class="text-2xl font-bold mb-5">
      Messaging
    </h2>

    <button
      class="bg-primary"
      :disabled="availableToSend || messages.messages.length === 0"
      @click="sendMessages(messages.messages)"
    >
      {{ sendingMessages ? 'Sending...' : 'Send messages' }}
    </button>
    <button
      class="bg-error"
      :disabled="messages.messages.length === 0"
      @click="messages.clearMessages()"
    >
      Clear messages
    </button>
  </div>
</template>
