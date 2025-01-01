<script setup lang="ts">
import useDropdown from '@/composables/useDropdown'
const { closeMenu, menu, menuIsOpen } = useDropdown()

defineProps<{
  triggerClass: string
  dropdownClass: string
}>()
</script>

<template>
  <details
    ref="menu"
    class="relative"
    @click="menuIsOpen = !menuIsOpen"
  >
    <!-- Trigger -->
    <summary
      :class="triggerClass"
    >
      <slot name="trigger" />
    </summary>

    <!-- Popup -->
    <ul
      v-show="menuIsOpen"
      :class="dropdownClass"
      @click.stop="closeMenu"
    >
      <slot />
    </ul>
  </details>
</template>
