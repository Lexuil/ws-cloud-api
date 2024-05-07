<script setup lang="ts">
import { useMessagesStore } from '@/stores/messagesStore'
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown.vue'

const messages = useMessagesStore()

function addFileMessage(event: Event) {
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
  <UiDropdown
    trigger-class="inline-flex cursor-pointer hover:bg-gray-200 p-2 rounded-full"
    dropdown-class="absolute top-0 -translate-y-full bg-white p-2 rounded-lg shadow-lg w-48"
  >
    <template #trigger>
      <span
        class="text-gray-500"
      ><svg
        viewBox="0 0 24 24"
        height="24"
        width="24"
      ><path
        d="M20.5 13.2501L20.5 10.7501L13.25 10.7501L13.25 3.5L10.75 3.5L10.75 10.7501L3.5 10.7501L3.5 13.2501L10.75 13.2501L10.75 20.5L13.25 20.5L13.25 13.2501L20.5 13.2501Z"
        fill="currentColor"
      /></svg></span>
    </template>

    <li class="hover:bg-slate-100 text-slate-600 rounded-lg">
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
    </li>
    <li class="hover:bg-slate-100 text-slate-600 rounded-lg">
      <label class="flex items-center gap-2 cursor-pointer p-2">
        <svg
          class="text-red-500 w-5 h-5 scale-125"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fill="currentColor"
            d="M1 5.5A2.5 2.5 0 0 1 3.5 3h9A2.5 2.5 0 0 1 15 5.5v4a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 9.5zm6 2a.5.5 0 0 0 .5.5H12a.5.5 0 0 0 0-1H7.5a.5.5 0 0 0-.5.5m-1 0a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0"
          />
        </svg>
        <span>Buttons</span>
      </label>
    </li>
    <li class="hover:bg-slate-100 text-slate-600 rounded-lg">
      <label class="flex items-center gap-2 cursor-pointer p-2">
        <svg
          class="text-purple-500 scale-125"
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill="currentColor"
            d="M8 17q.425 0 .713-.288T9 16t-.288-.712T8 15t-.712.288T7 16t.288.713T8 17m0-4q.425 0 .713-.288T9 12t-.288-.712T8 11t-.712.288T7 12t.288.713T8 13m0-4q.425 0 .713-.288T9 8t-.288-.712T8 7t-.712.288T7 8t.288.713T8 9m3 8h6v-2h-6zm0-4h6v-2h-6zm0-4h6V7h-6zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
          />
        </svg>
        <span>List</span>
      </label>
    </li>
  </UiDropdown>
</template>
