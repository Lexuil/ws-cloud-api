<script setup lang="ts">
import { ref } from 'vue'

const link = ref('')
</script>

<template>
  <label
    for="link"
  >Link</label>
  <input
    id="link"
    v-model="link"
    name="link"
    type="text"
    class="border border-gray-300 rounded-md p-2 w-full"
  >
</template>