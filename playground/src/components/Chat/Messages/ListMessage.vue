<script setup lang="ts">
import { ref } from 'vue'
import { format } from '@/utils/ws-format'

defineProps({
  message: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  list: {
    type: Array,
    required: true
  }
})

const showModal = ref(false)
</script>

<template>
  <li class="w-fit">
    <div class="p-2 bg-white shadow-sm rounded-md text-gray-700 w-fit mt-[2px] break-words max-w-full">
      <span
        class="whitespace-pre-wrap"
        v-html="format(message)"
      />
      <span class="invisible h-0 text-[0.68rem] p-1">{{ time }}</span>
      <div class="relative text-[0.68rem] text-gray-500">
        <span class="float-right mt-[-10px]">{{ time }}</span>
      </div>
    </div>
    <button
      class="flex items-center justify-center gap-2 p-2 bg-white shadow-sm rounded-md text-sky-500 mt-[2px] w-full"
      @click="showModal = true"
    >
      <svg
        viewBox="0 -4 15 20"
        height="12"
        width="15"
      ><g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      ><g
        id="format_list_bulleted-black-18dp"
        transform="translate(-1.000000, -3.000000)"
      ><polygon
        id="Path"
        points="0 0 18 0 18 18 0 18"
      /><path
        id="Shape"
        d="M3,7.875 C2.3775,7.875 1.875,8.3775 1.875,9 C1.875,9.6225 2.3775,10.125 3,10.125 C3.6225,10.125 4.125,9.6225 4.125,9 C4.125,8.3775 3.6225,7.875 3,7.875 Z M3,3.375 C2.3775,3.375 1.875,3.8775 1.875,4.5 C1.875,5.1225 2.3775,5.625 3,5.625 C3.6225,5.625 4.125,5.1225 4.125,4.5 C4.125,3.8775 3.6225,3.375 3,3.375 Z M3,12.375 C2.3775,12.375 1.875,12.885 1.875,13.5 C1.875,14.115 2.385,14.625 3,14.625 C3.615,14.625 4.125,14.115 4.125,13.5 C4.125,12.885 3.6225,12.375 3,12.375 Z M5.25,14.25 L15.75,14.25 L15.75,12.75 L5.25,12.75 L5.25,14.25 Z M5.25,9.75 L15.75,9.75 L15.75,8.25 L5.25,8.25 L5.25,9.75 Z M5.25,3.75 L5.25,5.25 L15.75,5.25 L15.75,3.75 L5.25,3.75 Z"
        fill="currentColor"
        fill-rule="nonzero"
      /></g></g></svg>
      {{ buttonText }}
    </button>

    <dialog
      v-show="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/15"
    >
      <div class="bg-white rounded-sm shadow-lg w-[27rem] max-h-[80vh] overflow-y-auto">
        <div class="flex items-center gap-5 bg-emerald-700 text-white p-5">
          <button @click="showModal = false">
            <svg
              viewBox="0 0 24 24"
              height="24"
              width="24"
              preserveAspectRatio="xMidYMid meet"
              class=""
              fill="currentColor"
              enable-background="new 0 0 24 24"
            ><path d="M19.6004 17.2L14.3004 11.9L19.6004 6.60005L17.8004 4.80005L12.5004 10.2L7.20039 4.90005L5.40039 6.60005L10.7004 11.9L5.40039 17.2L7.20039 19L12.5004 13.7L17.8004 19L19.6004 17.2Z" /></svg>
          </button>
          <h3 class="font-bold text-lg">
            {{ buttonText }}
          </h3>
        </div>

        <ul class="py-3">
          <template
            v-for="(item, index) in list"
            :key="index"
          >
            <li
              v-if="item.title !== ''"
              class="flex justify-between items-center gap-2 cursor-pointer py-2 px-4 hover:bg-gray-100"
            >
              <div class="flex flex-col">
                <span class="text-lg">{{ item.title }}</span>
                <span class="text-gray-500">{{ item.description }}</span>
              </div>

              <svg
                viewBox="0 0 20 20"
                height="20"
                width="20"
                preserveAspectRatio="xMidYMid meet"
                class="text-gray-500 flex-none"
                version="1.1"
                x="0px"
                y="0px"
                enable-background="new 0 0 20 20"
              ><path
                fill="currentColor"
                fill-opacity="inherit"
                d="M10,0.25c-5.385,0-9.75,4.365-9.75,9.75s4.365,9.75,9.75,9.75s9.75-4.365,9.75-9.75 S15.385,0.25,10,0.25z M10,17.963c-4.398,0-7.962-3.565-7.962-7.963S5.603,2.037,10,2.037S17.963,5.602,17.963,10 S14.398,17.963,10,17.963z"
              /></svg>
            </li>
          </template>
        </ul>
      </div>
    </dialog>
  </li>
</template>