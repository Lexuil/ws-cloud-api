<script setup lang="ts">
import ChatView from './components/ChatView.vue';
import ConfigForm from './components/ConfigForm.vue';
</script>

<template>
  <main class="flex flex-col items-center my-10">
    <h1 class="text-4xl font-black">
      ws-cloud-api - Playground
    </h1>

    <div class="flex gap-5 my-10">
      <ConfigForm />
      <ChatView />
    </div>
  </main>
</template>./components/ChatView.vue