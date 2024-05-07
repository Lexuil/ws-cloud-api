<script setup lang="ts">
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatBody from '@/components/Chat/ChatBody.vue'
import ChatInput from '@/components/Chat/ChatInput/ChatInput.vue'
</script>

<template>
  <div
    class="flex flex-col items-center max-sm:p-4 w-full sm:w-[26rem]"
  >
    <ChatHeader />
    <ChatBody />
    <ChatInput />
  </div>
</template>
