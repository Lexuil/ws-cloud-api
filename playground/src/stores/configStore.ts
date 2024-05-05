import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // States
  const phoneNumberId = ref('')
  const token = ref('')
  const phoneNumberTo = ref('')

  return {
    phoneNumberId,
    token,
    phoneNumberTo
  }
})