<script setup lang="ts">
import DeleteMessageButton from '@/components/Chat/Messages/DeleteMessageButton.vue'
import { useMessagesStore } from '@/stores/messagesStore'
import ChatMessage from './Messages/ChatMessage.vue'

const messages = useMessagesStore()
</script>

<template>
  <div
    class="w-full h-[42.7rem] chat-background bg-repeat bg-[length:24rem] px-10 py-2 overflow-auto relative"
    style="scrollbar-width: thin;"
  >
    <ol>
      <li
        v-for="(message, index) in messages.messages"
        :key="index"
        class="relative group"
      >
        <ChatMessage
          :message="message"
          time="2:45 p.m"
        />

        <DeleteMessageButton
          :message-id="message.id"
        />
      </li>
    </ol>
  </div>
</template>

<style scoped>
html .chat-background {
  position: relative;
  background-image: url('/chat-background.png');
  background-size: 460px;
  background-repeat: repeat;
}

html[data-theme='dark'] .chat-background {
  background-image: url('/chat-background-dark.png');
}
</style>
