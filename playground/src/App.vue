<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import ChatView from '@/components/Chat/ChatView.vue'
import ControlsView from '@/components/Controls/ControlsView.vue'
import PageHeader from '@/components/Page/PageHeader.vue'
// import JsonViewer from '@/components/JsonViewer/JsonViewer.vue'
</script>

<template>
  <!-- Components -->
  <Toaster />

  <!-- Page -->
  <PageHeader />
  <main class="flex flex-wrap justify-center gap-5 w-full my-7">
    <ControlsView />
    <ChatView />
    <!-- <Suspense>
      <JsonViewer />
    </Suspense> -->
  </main>
</template>

<style>
@font-face {
  font-family: 'Inter';
  src: url('@/assets/fonts/inter.ttf') format('truetype');
}

body {
  font-family: 'Inter', sans-serif;
}
</style>
