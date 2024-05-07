import { onClickOutside } from "@vueuse/core"
import { ref } from "vue"

export default function () {
  const menu = ref<HTMLDetailsElement | null>(null)
  const menuIsOpen = ref(false)

  onClickOutside(menu, () => closeMenu())

  function closeMenu() {
    menuIsOpen.value = false
    menu.value?.removeAttribute('open')
  }

  return {
    menu,
    menuIsOpen,
    closeMenu
  }
}