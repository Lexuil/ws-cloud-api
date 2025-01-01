<script setup lang="ts">
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown.vue'
import ChatInputFile from './ChatInputFile.vue'
import ChatInputButtonsMessage from './ChatInputButtonsMessage.vue'
import ChatInputListMessage from './ChatInputListMessage.vue'
</script>

<template>
  <UiDropdown
    trigger-class="inline-flex cursor-pointer p-2 rounded-full"
    dropdown-class="absolute top-0 -translate-y-full bg-ws-file-input-bg p-2 rounded-lg shadow-lg w-48"
  >
    <template #trigger>
      <span
        class="text-ws-icon"
      ><svg
        viewBox="0 0 24 24"
        height="24"
        width="24"
      ><path
        d="M20.5 13.2501L20.5 10.7501L13.25 10.7501L13.25 3.5L10.75 3.5L10.75 10.7501L3.5 10.7501L3.5 13.2501L10.75 13.2501L10.75 20.5L13.25 20.5L13.25 13.2501L20.5 13.2501Z"
        fill="currentColor"
      /></svg></span>
    </template>

    <li class="hover:bg-ws-hover rounded-lg">
      <ChatInputFile />
    </li>
    <li class="hover:bg-ws-hover rounded-lg">
      <ChatInputButtonsMessage />
    </li>
    <li class="hover:bg-ws-hover rounded-lg">
      <ChatInputListMessage />
    </li>
  </UiDropdown>
</template>
