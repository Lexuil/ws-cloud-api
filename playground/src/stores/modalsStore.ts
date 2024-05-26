import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalsStore = defineStore('modals', () => {
  // States
  const modals = ref<string[]>([])

  // Actions
  function openModal (modal: string): void {
    modals.value.push(modal)
  }

  function closeModal (modal: string): void {
    modals.value = modals.value.filter((m) => m !== modal)
  }

  function closeAllModals (): void {
    modals.value = []
  }

  function showModal (modal: string): boolean {
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
