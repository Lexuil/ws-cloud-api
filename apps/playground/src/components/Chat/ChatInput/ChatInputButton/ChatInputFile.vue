<script setup lang="ts">
import { useMessagesStore } from '@/stores/messagesStore'

const messages = useMessagesStore()

function addFileMessage(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file === undefined) return

  const reader = new FileReader()
  reader.onload = () => {
    messages.addMessage({
      id: Date.now(),
      type: 'file',
      file,
      link: reader.result as string
    })
  }
  reader.readAsDataURL(file)
  target.value = ''
}
</script>

<template>
  <label class="flex items-center gap-2 cursor-pointer p-2">
    <input
      type="file"
      class="hidden"
      accept="image/jpeg, image/png, video/mp4, video/3gp"
      @change="addFileMessage"
    >
    <svg
      class="text-blue-500"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    ><path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M20 14V2C20 0.9 19.1 0 18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14ZM9.4 10.53L11.03 12.71L13.61 9.49C13.81 9.24 14.19 9.24 14.39 9.49L17.35 13.19C17.61 13.52 17.38 14 16.96 14H7C6.59 14 6.35
          13.53 6.6 13.2L8.6 10.53C8.8 10.27 9.2 10.27 9.4 10.53ZM0 18V5C0 4.45 0.45 4 1 4C1.55 4 2 4.45 2 5V17C2 17.55 2.45 18 3 18H15C15.55 18 16 18.45 16 19C16 19.55 15.55 20 15 20H2C0.9 20 0 19.1 0 18Z"
      fill="var(--attachment-type-photos-color)"
    /></svg>
    <span>Image/Video</span>
  </label>
</template>
