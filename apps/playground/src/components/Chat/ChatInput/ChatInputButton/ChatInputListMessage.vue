<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { reactive } from 'vue'
import { useMessagesStore } from '@/stores/messagesStore'

const form = reactive({
  text: '',
  buttonText: '',
  lists: Array.from({ length: 10 }, () => ({ title: '', description: '' }))
})

const { addMessage } = useMessagesStore()

function addListMessage(): void {
  const { text, buttonText, lists } = form

  if (text === '' || buttonText === '' || lists[0].title === '') return
  addMessage({
    id: Date.now(),
    type: 'list',
    text,
    buttonText,
    list: lists.filter(list => list.title !== '').map(item => ({
      title: item.title,
      description: item.description
    }))
  })
  resetForm()
}

function resetForm(): void {
  form.text = ''
  form.buttonText = ''
  form.lists.forEach((list) => {
    list.title = ''
    list.description = ''
  })
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <button class="flex items-center gap-2 cursor-pointer p-2 text-ws-ui-text text-base">
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
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Add list message</AlertDialogTitle>
        <AlertDialogDescription>
          <form
            id="add-list-message-form"
            class="flex flex-col items-center gap-1 h-100 overflow-auto"
            @submit.prevent="addListMessage"
          >
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label
                for="text"
                class="block mt-3"
              >Text</Label>
              <Textarea
                id="text"
                v-model="form.text"
                name="text"
                required
              />
            </div>

            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label
                for="buttonText"
                class="block mt-3"
              >Button Text</Label>
              <Input
                id="buttonText"
                v-model="form.buttonText"
                type="text"
                name="buttonText"
                maxlength="20"
                required
              />
            </div>

            <template
              v-for="(list, index) in form.lists"
              :key="index"
            >
              <div
                v-if="index === 0 || form.lists[index - 1].title"
                class="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label
                  :for="`title${index + 1}`"
                  class="block mt-3"
                >Title {{ index + 1 }}</Label>
                <Input
                  :id="`title${index + 1}`"
                  v-model="list.title"
                  type="text"
                  :name="`title${index + 1}`"
                  maxlength="24"
                />
                <Label
                  :for="`description${index + 1}`"
                  class="block mt-3"
                >Description {{ index + 1 }}</Label>
                <Textarea
                  :id="`description${index + 1}`"
                  v-model="list.description"
                  :name="`description${index + 1}`"
                  class="resize-none"
                  maxlength="72"
                  rows="2"
                  :required="list.title !== ''"
                />
              </div>
            </template>
          </form>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          type="submit"
          form="add-list-message-form"
        >
          Add
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
