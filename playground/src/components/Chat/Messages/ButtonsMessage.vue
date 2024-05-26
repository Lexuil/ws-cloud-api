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
    <div class="p-2 bg-white shadow-sm rounded-md text-gray-700 w-fit mt-[2px] break-words max-w-full">
      <span
        class="whitespace-pre-wrap"
        v-html="format(message)"
      />
      <span class="invisible h-0 text-[0.68rem] p-1">{{ time }}</span>
      <div class="relative text-[0.68rem] text-gray-500">
        <span class="float-right mt-[-10px]">{{ time }}</span>
      </div>
    </div>
    <template
      v-for="(button, index) in buttons"
    >
      <button
        v-if="button !== ''"
        :key="index"
        class="p-2 bg-white shadow-sm rounded-md text-sky-500 mt-[2px] w-full"
      >
        {{ button }}
      </button>
    </template>
  </li>
</template>
