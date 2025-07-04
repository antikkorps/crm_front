<template>
  <div class="flex items-center justify-center w-10 h-10 rounded-full" :class="iconBackgroundClass">
    <Iconify :icon="iconName" :class="iconClass" class="w-5 h-5" />
  </div>
</template>

<script setup lang="ts">
import type { ActivityType } from '@/types/activity.types'
import { computed } from 'vue'

interface Props {
  type: ActivityType
  status?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const iconName = computed(() => {
  switch (props.type) {
    case 'CALL':
      return 'mdi:phone'
    case 'MEETING':
      return 'mdi:account-group'
    case 'EMAIL':
      return 'mdi:email'
    case 'TASK':
      return 'mdi:format-list-checks'
    case 'NOTE':
      return 'mdi:note-text'
    default:
      return 'mdi:circle'
  }
})

const iconBackgroundClass = computed(() => {
  const baseClass = 'text-white'

  switch (props.type) {
    case 'CALL':
      return `bg-primary ${baseClass}`
    case 'MEETING':
      return `bg-secondary ${baseClass}`
    case 'EMAIL':
      return `bg-accent ${baseClass}`
    case 'TASK':
      return `bg-info ${baseClass}`
    case 'NOTE':
      return `bg-warning ${baseClass}`
    default:
      return `bg-neutral ${baseClass}`
  }
})

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return sizeClasses[props.size]
})
</script>
