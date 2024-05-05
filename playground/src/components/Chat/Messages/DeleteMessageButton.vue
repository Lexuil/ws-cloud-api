<script setup lang="ts">
import { useMessagesStore } from '@/stores/messagesStore'

defineProps({
  messageId: {
    type: Number,
    required: true
  }
})

const messages = useMessagesStore()
</script>

<template>
  <div class="absolute -left-7 top-0 flex h-full items-center pr-2">
    <button
      class="flex items-center justify-center bg-red-500 text-white rounded-full w-6 h-6 invisible group-hover:visible"
      @click="messages.removeMessage(messageId)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>