<script setup lang="ts">
import { ref } from 'vue'

const phoneNumberId = ref('')
const token = ref('')
const phoneNumberTo = ref('')
</script>

<template>
  <div class="flex flex-col items-center gap-3 w-96 h-fit border border-gray-300 p-5 rounded-md">
    <label
      for="phoneNumberId"
    >Phone number ID</label>
    <input
      id="phoneNumberId"
      v-model="phoneNumberId"
      name="phoneNumberId"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >

    <label
      for="token"
    >Token</label>
    <input
      id="token"
      v-model="token"
      name="token"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >

    <label
      for="phoneNumberTo"
    >Phone number to test</label>
    <input
      id="phoneNumberTo"
      v-model="phoneNumberTo"
      name="phoneNumberTo"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >
  </div>
</template>