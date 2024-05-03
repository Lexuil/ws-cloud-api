<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button
    type="button"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    @click="count++"
  >
    count is {{ count }}
  </button>
</template>
