<script setup lang="ts">
import TextMessage from '@/components/Chat/Messages/TextMessage.vue'
import ImageMessage from '@/components/Chat/Messages/ImageMessage.vue'
import VideoMessage from '@/components/Chat/Messages/VideoMessage.vue'
import { useMessagesStore } from '@/stores/messagesStore'

const messages = useMessagesStore()
</script>

<template>
  <div
    class="w-full h-[42.7rem] bg-[url('/chat-background.png')] bg-repeat bg-[length:24rem] px-10 py-2 overflow-auto relative"
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
          v-else-if="message.type === 'image' ||
            (message.type === 'file' && message.file.type.includes('image'))"
          :key="index + '-image'"
          :link="message.link"
          time="2:45 p.m."
        />
        <VideoMessage
          v-else-if="message.type === 'video' ||
            (message.type === 'file' && message.file.type.includes('video'))"
          :key="index + '-video'"
          :link="message.link"
          time="2:45 p.m."
        />
      </template>
    </ol>
  </div>
</template>
