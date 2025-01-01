<script setup lang="ts">
defineProps<{
  link: string
  time: string
}>()
</script>

<template>
  <li class="p-[2px] bg-ws-message-bg text-ws-ui-text shadow-sm rounded-md w-fit max-w-64 mt-[2px]">
    <div class="rounded-md overflow-hidden relative">
      <video
        :src="link"
        alt="Video"
        class="w-full h-full object-cover"
      />
      <!-- Play button -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      >
        <span
          class="block bg-black/50 rounded-full w-14 h-14 relative"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
        </span>
      </div>
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
