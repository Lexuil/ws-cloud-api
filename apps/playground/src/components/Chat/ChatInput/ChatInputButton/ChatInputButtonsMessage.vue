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

const form = reactive<Record<string, string>>({
  text: '',
  button1: '',
  button2: '',
  button3: ''
})

const { addMessage } = useMessagesStore()

function addButtonMessage(): void {
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
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <button class="flex items-center gap-2 cursor-pointer p-2 text-ws-ui-text text-base">
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
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Add button message</AlertDialogTitle>
        <AlertDialogDescription>
          <form
            class="flex flex-col items-center gap-1"
            @submit.prevent="addButtonMessage"
          >
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label
                for="text"
                class="block mt-3"
              >
                Text
              </Label>
              <Textarea
                id="text"
                v-model="form.text"
                name="text"
                required
              />
            </div>

            <template
              v-for="i in 3"
              :key="i"
            >
              <div
                v-if="i === 1 || form[`button${i - 1}`] !== ''"
                class="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label
                  :for="`button${i}`"
                  class="block mt-3"
                >
                  Button {{ i }}
                </Label>
                <Input
                  :id="`button${i}`"
                  v-model="form[`button${i}`]"
                  type="text"
                  :name="`button${i}`"
                  maxlength="20"
                />
              </div>
            </template>
          </form>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="addButtonMessage">
          Add
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
