<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import ChatView from '@/components/ChatView.vue'
import ConfigForm from '@/components/ConfigForm.vue'
import SendMessagesButtons from '@/components/SendMessagesButtons.vue'
</script>

<template>
  <Toaster />
  <main class="flex flex-col items-center justify-center w-full min-h-screen">
    <h1 class="text-4xl font-black text-center">
      ws-cloud-api - Playground
    </h1>

    <div class="flex flex-wrap justify-center gap-5 w-full my-10">
      <div class="flex flex-col items-center gap-5 max-sm:w-full max-sm:p-4">
        <ConfigForm />
        <SendMessagesButtons />
      </div>
      <ChatView />
    </div>
  </main>
</template>