<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const config = useConfigStore()
</script>

<template>
  <div class="box">
    <h2 class="text-2xl font-bold mb-5">
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
    >

    <label
      for="token"
    >Token</label>
    <input
      id="token"
      v-model="config.token"
      name="token"
      type="text"
    >

    <label
      for="phoneNumberTo"
    >Phone number to test</label>
    <input
      id="phoneNumberTo"
      v-model="config.phoneNumberTo"
      name="phoneNumberTo"
      type="text"
    >
  </div>
</template>
