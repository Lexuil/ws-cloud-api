import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // States
  const phoneNumberId = ref('')
  const token = ref('')
  const phoneNumberTo = ref('')

  return { phoneNumberId, phoneNumberTo, token }
})
