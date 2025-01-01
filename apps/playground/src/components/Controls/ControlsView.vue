<script setup lang="ts">
import ConfigForm from './ConfigForm.vue'
import SendMessagesButtons from './SendMessagesButtons.vue'
</script>

<template>
  <div class="flex flex-col items-center gap-5 max-sm:w-full max-sm:p-4">
    <ConfigForm />
    <SendMessagesButtons />
  </div>
</template>
