<script setup lang="ts">
import { ref } from 'vue'

const phoneNumberId = ref('')
const token = ref('')
</script>

<template>
  <div class="flex flex-col items-center space-y-4 w-96 h-fit border border-gray-300 p-5 rounded-md">
    <label
      class="text-lg"
      for="phoneNumberId"
    >Phone Number ID</label>
    <input
      id="phoneNumberId"
      v-model="phoneNumberId"
      name="phoneNumberId"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >

    <label
      class="text-lg"
      for="token"
    >Token</label>
    <input
      id="token"
      v-model="token"
      name="token"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >
  </div>
</template>