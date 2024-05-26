<script setup lang="ts">
import TextMessage from './TextMessage.vue'
import ImageMessage from './ImageMessage.vue'
import VideoMessage from './VideoMessage.vue'
import ButtonsMessage from './ButtonsMessage.vue'
import ListMessage from './ListMessage.vue'
import { type Message } from '@/stores/messagesStore'

defineProps<{
  message: Message
  time: string
}>()
</script>

<template>
  <TextMessage
    v-if="message.type === 'text'"
    :message="message.text"
    :time="time"
  />
  <ImageMessage
    v-else-if="message.type === 'image' ||
      (message.type === 'file' && message.file.type.includes('image'))"
    :link="message.link"
    :time="time"
  />
  <VideoMessage
    v-else-if="message.type === 'video' ||
      (message.type === 'file' && message.file.type.includes('video'))"
    :link="message.link"
    :time="time"
  />
  <ButtonsMessage
    v-else-if="message.type === 'button'"
    :message="message.text"
    :buttons="message.buttons"
    :time="time"
  />
  <ListMessage
    v-else-if="message.type === 'list'"
    :message="message.text"
    :time="time"
    :button-text="message.buttonText"
    :list="message.list"
  />
</template>
