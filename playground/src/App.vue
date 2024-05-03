<script setup lang="ts">
import AddMessageForm from './components/AddMessage/AddMessageForm.vue'
import ChatView from './components/ChatView.vue'
import ConfigForm from './components/ConfigForm.vue'
</script>

<template>
  <main class="flex flex-col items-center my-10">
    <h1 class="text-4xl font-black text-center">
      ws-cloud-api - Playground
    </h1>

    <div class="flex flex-wrap justify-center gap-5 my-10">
      <ConfigForm />
      <AddMessageForm />
      <ChatView />
    </div>
  </main>
</template>