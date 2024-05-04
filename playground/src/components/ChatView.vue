<script setup lang="ts">
import TextMessage from './Chat/TextMessage.vue'
import ImageMessage from './Chat/ImageMessage.vue'
import VideoMessage from './Chat/VideoMessage.vue'
import { useMessagesStore } from '../stores/messagesStore'
import { useConfigStore } from '../stores/configStore'
import useSendMessages from '../hooks/useSendMessages'

const messages = useMessagesStore()
const config = useConfigStore()
const { sendMessages } = useSendMessages()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3"
  >
    <div
      class="w-96 h-[42.7rem] bg-[url('/chat-background.png')] bg-repeat bg-[length:24rem] rounded-lg px-10 py-2 overflow-auto relative"
      style="scrollbar-width: thin;"
    >
      <ol>
        <template v-for="(message, index) in messages.messages">
          <TextMessage
            v-if="message.type === 'text'"
            :key="index + '-text'"
            :message="message.text"
            time="2:45 p.m."
          />
          <ImageMessage
            v-else-if="message.type === 'image'"
            :key="index + '-image'"
            :link="message.link"
            time="2:45 p.m."
          />
          <VideoMessage
            v-else-if="message.type === 'video'"
            :key="index + '-video'"
            :link="message.link"
            time="2:45 p.m."
          />
        </template>
      </ol>
    </div>
    <button
      class="bg-blue-500 text-white px-3 py-1 rounded-md disabled:bg-gray-300"
      :disabled="config.phoneNumberId === '' ||
        config.token === '' ||
        config.phoneNumberTo === '' ||
        messages.messages.length === 0"
      @click="sendMessages(messages.messages)"
    >
      Send messages
    </button>
    <button
      class="bg-red-500 text-white px-3 py-1 rounded-md disabled:bg-gray-300"
      :disabled="messages.messages.length === 0"
      @click="messages.clearMessages()"
    >
      Clear messages
    </button>
  </div>
</template>
