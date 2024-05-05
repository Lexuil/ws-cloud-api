<script setup lang="ts">
import ChatHeader from './Chat/ChatHeader.vue'
import ChatBody from './Chat/ChatBody.vue'
import ChatInput from './Chat/ChatInput.vue'
import { useMessagesStore } from '../stores/messagesStore'
import { useConfigStore } from '../stores/configStore'
import useSendMessages from '../hooks/useSendMessages'

const messages = useMessagesStore()
const config = useConfigStore()
const { sendMessages } = useSendMessages()
</script>

<template>
  <div
    class="flex flex-col items-center max-sm:p-4 w-full sm:w-[26rem]"
  >
    <ChatHeader />
    <ChatBody />
    <ChatInput />

    <div class="flex w-full justify-center gap-5 mt-5">
      <button
        class="bg-green-500 text-white px-3 py-1 rounded-md disabled:bg-gray-300 w-full"
        :disabled="config.phoneNumberId === '' ||
          config.token === '' ||
          config.phoneNumberTo === '' ||
          messages.messages.length === 0"
        @click="sendMessages(messages.messages)"
      >
        Send messages
      </button>
      <button
        class="bg-red-500 text-white px-3 py-1 rounded-md disabled:bg-gray-300 w-full"
        :disabled="messages.messages.length === 0"
        @click="messages.clearMessages()"
      >
        Clear messages
      </button>
    </div>
  </div>
</template>
