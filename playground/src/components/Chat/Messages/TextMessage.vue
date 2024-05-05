<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})
</script>

<template>
  <li class="p-2 bg-white shadow-sm rounded-md text-gray-700 w-fit mt-[2px] break-all">
    <span class="whitespace-pre-wrap">
      {{ message }}
    </span>
    <span class="invisible h-0 text-[0.68rem] p-1">{{ time }}</span>
    <div class="relative text-[0.68rem] text-gray-500">
      <span class="float-right mt-[-10px]">{{ time }}</span>
    </div>
  </li>
</template>