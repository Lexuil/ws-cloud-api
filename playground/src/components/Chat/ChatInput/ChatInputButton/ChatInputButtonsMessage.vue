<script setup lang="ts">
import { useModalsStore } from '@/stores/modalsStore'
const { openModal } = useModalsStore()
</script>

<template>
  <button
    class="flex items-center gap-2 cursor-pointer p-2"
    @click="openModal('ButtonsMessage')"
  >
    <svg
      class="text-red-500 w-5 h-5 scale-125"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fill="currentColor"
        d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm6 2a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 0-1H7.5a.5.5 0 0 0-.5.5m-1 0a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0"
      />
    </svg>
    <span>Buttons</span>
  </button>
</template>
