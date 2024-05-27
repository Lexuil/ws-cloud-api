<script setup lang="ts">
import { reactive } from 'vue'
import { useMessagesStore } from '@/stores/messagesStore'
import { useModalsStore } from '@/stores/modalsStore'

interface List {
  title: string
  description: string
}

const form = reactive({
  text: '',
  buttonText: '',
  list1: {
    title: '',
    description: ''
  },
  list2: {
    title: '',
    description: ''
  },
  list3: {
    title: '',
    description: ''
  },
  list4: {
    title: '',
    description: ''
  },
  list5: {
    title: '',
    description: ''
  },
  list6: {
    title: '',
    description: ''
  },
  list7: {
    title: '',
    description: ''
  },
  list8: {
    title: '',
    description: ''
  },
  list9: {
    title: '',
    description: ''
  },
  list10: {
    title: '',
    description: ''
  }
})

const { addMessage } = useMessagesStore()
const { showModal, closeModal } = useModalsStore()

function addButtonMessage (): void {
  const {
    text,
    buttonText,
    list1,
    list2,
    list3,
    list4,
    list5,
    list6,
    list7,
    list8,
    list9,
    list10
  } = form

  if (text === '' || buttonText === '' || list1.title === '') return

  addMessage({
    id: Date.now(),
    type: 'list',
    text,
    buttonText,
    list: [
      {
        title: list1.title,
        description: list1.description
      },
      {
        title: list2.title,
        description: list2.description
      },
      {
        title: list3.title,
        description: list3.description
      },
      {
        title: list4.title,
        description: list4.description
      },
      {
        title: list5.title,
        description: list5.description
      },
      {
        title: list6.title,
        description: list6.description
      },
      {
        title: list7.title,
        description: list7.description
      },
      {
        title: list8.title,
        description: list8.description
      },
      {
        title: list9.title,
        description: list9.description
      },
      {
        title: list10.title,
        description: list10.description
      }
    ]
  })

  form.text = ''
  form.buttonText = ''
  form.list1.title = ''
  form.list1.description = ''
  form.list2.title = ''
  form.list2.description = ''
  form.list3.title = ''
  form.list3.description = ''
  form.list4.title = ''
  form.list4.description = ''
  form.list5.title = ''
  form.list5.description = ''
  form.list6.title = ''
  form.list6.description = ''
  form.list7.title = ''
  form.list7.description = ''
  form.list8.title = ''
  form.list8.description = ''
  form.list9.title = ''
  form.list9.description = ''
  form.list10.title = ''
  form.list10.description = ''

  closeModal('ListMessage')
}
</script>

<template>
  <dialog
    v-if="showModal('ListMessage')"
    class="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/15"
  >
    <div class="bg-box-background text-box-text p-5 rounded-lg shadow-lg w-[30rem] max-h-[80vh] overflow-y-auto">
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
          required
        />

        <label
          for="buttonText"
          class="block mt-3"
        >Button Text</label>
        <input
          id="buttonText"
          v-model="form.buttonText"
          type="text"
          name="buttonText"
          maxlength="20"
          required
        >

        <template
          v-for="i in 10"
          :key="i"
        >
          <div v-if="i === 1 || (form[`list${i - 1}` as keyof typeof form] as List).title !== ''">
            <label
              :for="`title${i}`"
              class="block mt-3"
            >
              Tittle {{ i }}
              <input
                :id="`title${i}`"
                v-model="(form[`list${i}` as keyof typeof form] as List).title"
                type="text"
                :name="`title${i}`"
                maxlength="24"
              >
            </label>
            <label
              :for="`description${i}`"
              class="block mt-3"
            >
              Description {{ i }}
              <textarea
                :id="`description${i}`"
                v-model="(form[`list${i}` as keyof typeof form] as List).description"
                :name="`description${i}`"
                class="resize-none"
                maxlength="72"
                rows="2"
                :required="(form[`list${i}` as keyof typeof form] as List).title !== ''"
              />
            </label>
          </div>
        </template>

        <div class="flex justify-center mt-5">
          <button
            type="button"
            class="px-4 py-2 text-white bg-red-500 rounded-md"
            @click="closeModal('ListMessage')"
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
