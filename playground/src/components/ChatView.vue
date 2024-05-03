<script setup lang="ts">
import { useMessagesStore } from '../stores/messagesStore'
import TextMessage from './Chat/TextMessage.vue'

const messages = useMessagesStore()
</script>

<template>
  <div
    class="w-96 h-[42.7rem] bg-[url('/chat-background.png')] bg-repeat bg-[length:24rem] rounded-lg px-10 py-2 overflow-auto"
    style="scrollbar-width: thin;"
  >
    <ol>
      <template v-for="(message, index) in messages.messages">
        <TextMessage
          v-if="message.type === 'text'"
          :key="index"
          :message="message.text"
          time="2:45 p.m."
        />
      </template>
    </ol>
  </div>
</template>
