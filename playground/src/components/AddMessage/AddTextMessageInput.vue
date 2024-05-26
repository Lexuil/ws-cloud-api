<script setup lang="ts">
const message = defineModel({ type: String })
</script>

<template>
  <label
    for="message"
  >Message</label>
  <input
    id="message"
    v-model="message"
    name="message"
    type="text"
    class="border border-gray-300 rounded-md p-2 w-full"
  >
</template>
