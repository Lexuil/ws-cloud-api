import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', () => {
  // States
  const modals = ref<string[]>([])

  // Actions
  function openModal(modal: string): void {
    modals.value.push(modal)
  }

  function closeModal(modal: string): void {
    modals.value = modals.value.filter((m) => m !== modal)
  }

  function closeAllModals(): void {
    modals.value = []
  }

  function showModal(modal: string): boolean {
    return modals.value.includes(modal)
  }

  return { closeAllModals, closeModal, modals, openModal, showModal }
})
