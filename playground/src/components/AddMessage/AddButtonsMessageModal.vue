<script setup lang="ts">
import { reactive } from 'vue'
import { useMessagesStore } from '@/stores/messagesStore'
import { useModalsStore } from '@/stores/modalsStore'

const form = reactive<Record<string, string>>({
  text: '',
  button1: '',
  button2: '',
  button3: ''
})

const { addMessage } = useMessagesStore()
const { showModal, closeModal } = useModalsStore()

const addButtonMessage = () => {
  const { text, button1, button2, button3 } = form

  if (text === '' || button1 === '') return

  addMessage({
    id: Date.now(),
    type: 'button',
    text,
    buttons: [button1, button2, button3]
  })

  form.text = ''
  form.button1 = ''
  form.button2 = ''
  form.button3 = ''

  closeModal('ButtonsMessage')
}
</script>

<template>
  <dialog
    v-show="showModal('ButtonsMessage')"
    class="absolute inset-0 z-50 flex items-center justify-center w-full h-full bg-black/15"
  >
    <div class="bg-white p-5 rounded-lg shadow-lg w-96">
      <h3 class="font-bold text-lg text-center">
        Buttons Message
      </h3>

      <form
        class="flex flex-col items-center gap-1"
        @submit.prevent="addButtonMessage"
      >
        <label
          for="text"
          class="block mt-3"
        >Text</label>
        <textarea
          id="text"
          v-model="form.text"
          name="text"
          class="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <template
          v-for="i in 3"
          :key="i"
        >
          <div v-if="i === 1 || form[`button${i - 1}`] !== ''">
            <label
              :for="`button${i}`"
              class="block mt-3"
            >
              Button {{ i }}
            </label>
            <input
              :id="`button${i}`"
              v-model="form[`button${i}`]"
              type="text"
              :name="`button${i}`"
              class="w-44 p-2 border border-gray-300 rounded-md"
              maxlength="20"
            >
          </div>
        </template>

        <div class="flex justify-center mt-5">
          <button
            type="button"
            class="px-4 py-2 text-white bg-red-500 rounded-md"
            @click="closeModal('ButtonsMessage')"
          >
            Close
          </button>
          <button
            type="submit"
            class="px-4 py-2 ml-3 text-white bg-green-500 rounded-md"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>