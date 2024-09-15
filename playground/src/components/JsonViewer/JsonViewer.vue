<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { useMessagesStore } from '@/stores/messagesStore'
import { ref, watch } from 'vue'

const messages = useMessagesStore()
const html = ref('')

watch(messages.messages, async () => {
  html.value = await codeToHtml(JSON.stringify(messages.messages, null, 2), {
    lang: 'json',
    theme: 'vitesse-dark'
  })
})
</script>

<template>
  <div
    class="w-96 max-h-96 overflow-auto"
    v-html="html"
  />
</template>
