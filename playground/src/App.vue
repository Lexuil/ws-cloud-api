<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import ChatView from '@/components/ChatView.vue'
import ConfigForm from '@/components/ConfigForm.vue'
import SendMessagesButtons from '@/components/SendMessagesButtons.vue'
import AddButtonsMessageModal from './components/AddMessage/AddButtonsMessageModal.vue'
import AddListMessageModal from './components/AddMessage/AddListMessageModal.vue'
import PageHeader from './components/Page/PageHeader.vue'
</script>

<template>
  <Toaster />
  <AddButtonsMessageModal />
  <AddListMessageModal />
  <PageHeader />
  <main class="flex flex-col items-center justify-center w-full">
    <div class="flex flex-wrap justify-center gap-5 w-full my-7">
      <div class="flex flex-col items-center gap-5 max-sm:w-full max-sm:p-4">
        <ConfigForm />
        <SendMessagesButtons />
      </div>
      <ChatView />
    </div>
  </main>
</template>