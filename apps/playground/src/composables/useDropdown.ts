import { onClickOutside } from '@vueuse/core'
import { type Ref, ref } from 'vue'

export default function (): {
  menu: Ref<HTMLDetailsElement | null>
  menuIsOpen: Ref<boolean>
  closeMenu: () => void
} {
  const menu = ref<HTMLDetailsElement | null>(null)
  const menuIsOpen = ref(false)

  onClickOutside(menu, () => { closeMenu() })

  function closeMenu (): void {
    menuIsOpen.value = false
    menu.value?.removeAttribute('open')
  }

  return {
    menu,
    menuIsOpen,
    closeMenu
  }
}
