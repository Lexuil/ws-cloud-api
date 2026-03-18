import { ref } from 'vue'
import type { Ref } from 'vue'

import { onClickOutside } from '@vueuse/core'

export default function (): {
  menu: Ref<HTMLDetailsElement | null>
  menuIsOpen: Ref<boolean>
  closeMenu: () => void
} {
  const menu = ref<HTMLDetailsElement | null>(null)
  const menuIsOpen = ref(false)

  onClickOutside(menu, () => {
    closeMenu()
  })

  function closeMenu(): void {
    menuIsOpen.value = false
    menu.value?.removeAttribute('open')
  }

  return { closeMenu, menu, menuIsOpen }
}
