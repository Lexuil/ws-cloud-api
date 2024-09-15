<script setup lang="ts">
import { format } from '@/utils/ws-format'

defineProps<{
  message: string
  time: string
  buttons: string[]
}>()
</script>

<template>
  <li class="w-fit">
    <div class="p-2 bg-ws-message-bg text-ws-ui-text shadow-sm rounded-md w-full mt-[2px] break-words">
      <span
        class="whitespace-pre-wrap"
        v-html="format(message)"
      />
      <span class="invisible h-0 text-[0.68rem] p-1">{{ time }}</span>
      <div class="relative text-[0.68rem] text-ws-time">
        <span class="float-right mt-[-10px]">{{ time }}</span>
      </div>
    </div>
    <template
      v-for="(button, index) in buttons"
    >
      <button
        v-if="button !== ''"
        :key="index"
        class="p-2 bg-ws-button-bg shadow-sm rounded-md text-ws-link mt-[2px] w-full"
      >
        {{ button }}
      </button>
    </template>
  </li>
</template>
