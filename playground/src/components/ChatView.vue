<script setup lang="ts">
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatBody from '@/components/Chat/ChatBody.vue'
import ChatInput from '@/components/Chat/ChatInput.vue'
import { useMessagesStore } from '@/stores/messagesStore'
import { useConfigStore } from '@/stores/configStore'
import useSendMessages from '@/hooks/useSendMessages'

const messages = useMessagesStore()
const config = useConfigStore()
const { sendMessages } = useSendMessages()
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
