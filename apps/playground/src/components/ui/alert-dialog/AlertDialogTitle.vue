<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'

import type { AlertDialogTitleProps } from 'radix-vue'

import { AlertDialogTitle } from 'radix-vue'

import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogTitle
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
