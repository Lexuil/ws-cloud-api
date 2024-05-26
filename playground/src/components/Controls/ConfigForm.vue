<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const config = useConfigStore()
</script>

<template>
  <div class="flex flex-col items-center gap-3 w-full sm:w-96 h-fit border border-gray-300 p-5 rounded-md">
    <h2 class="text-2xl font-bold">
      Configuration
    </h2>

    <label
      for="phoneNumberId"
    >Phone number ID</label>
    <input
      id="phoneNumberId"
      v-model="config.phoneNumberId"
      name="phoneNumberId"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >

    <label
      for="token"
    >Token</label>
    <input
      id="token"
      v-model="config.token"
      name="token"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >

    <label
      for="phoneNumberTo"
    >Phone number to test</label>
    <input
      id="phoneNumberTo"
      v-model="config.phoneNumberTo"
      name="phoneNumberTo"
      type="text"
      class="border border-gray-300 rounded-md p-2 w-full"
    >
  </div>
</template>