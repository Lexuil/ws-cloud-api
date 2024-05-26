<script setup lang="ts">
import DeleteMessageButton from '@/components/Chat/Messages/DeleteMessageButton.vue'
import { useMessagesStore } from '@/stores/messagesStore'
import ChatMessage from './Messages/ChatMessage.vue'

const messages = useMessagesStore()
</script>

<template>
  <div
    class="w-full h-[42.7rem] bg-[url('/chat-background.png')] bg-repeat bg-[length:24rem] px-10 py-2 overflow-auto relative"
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
