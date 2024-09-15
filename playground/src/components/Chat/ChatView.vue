<script setup lang="ts">
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatBody from '@/components/Chat/ChatBody.vue'
import ChatInput from '@/components/Chat/ChatInput/ChatInput.vue'
</script>

<template>
  <div
    id="chat"
    class="flex flex-col items-center max-sm:p-4 w-full sm:w-[26rem]"
  >
    <ChatHeader />
    <ChatBody />
    <ChatInput />
  </div>
</template>

<style scoped>
* {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}
</style>
