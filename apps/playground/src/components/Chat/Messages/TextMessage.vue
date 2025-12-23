<script setup lang="ts">
import { format } from '@/utils/ws-format'

defineProps<{
  message: string
  time: string
}>()
</script>

<template>
  <li class="p-2 bg-ws-message-bg text-ws-ui-text shadow-xs rounded-md w-fit mt-[2px] wrap-break-word max-w-full">
    <span
      class="whitespace-pre-wrap"
      v-html="format(message)"
    />
    <span class="invisible h-0 text-[0.68rem] p-1">{{ time }}</span>
    <div class="relative text-[0.68rem] text-ws-time">
      <span class="float-right mt-[-10px]">{{ time }}</span>
    </div>
  </li>
</template>
