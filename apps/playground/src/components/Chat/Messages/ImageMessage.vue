<script setup lang="ts">
defineProps<{
  link: string
  time: string
}>()
</script>

<template>
  <li class="p-[2px] bg-ws-message-bg text-ws-ui-text shadow-sm rounded-md w-fit max-w-64 mt-[2px]">
    <div class="rounded-md overflow-hidden relative">
      <img
        :src="link"
        alt="Image"
        class="w-full h-full object-cover"
      >
      <span class="h-[2.5rem] absolute bottom-0 w-full bg-gradient-to-t from-gray-950/50 to-transparent" />
    </div>
    <div class="relative text-[0.68rem] text-white">
      <span class="float-right -mt-4 mr-1">{{ time }}</span>
    </div>
  </li>
</template>

<style scoped>
.gradient {
  background-image: linear-gradient(to top,rgba(11,20,26,.5),rgba(11,20,26,0));
}
</style>
