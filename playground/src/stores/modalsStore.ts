import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalsStore = defineStore('modals', () => {
  // States
  const modals = ref<string[]>([])

  // Actions
  function openModal(modal: string) {
    modals.value.push(modal)
  }

  function closeModal(modal: string) {
    modals.value = modals.value.filter((m) => m !== modal)
  }

  function closeAllModals() {
    modals.value = []
  }

  function showModal(modal: string) {
    return modals.value.includes(modal)
  }

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    showModal
  }
})