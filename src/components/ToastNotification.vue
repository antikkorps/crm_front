<template>
  <div class="toast toast-end z-50">
    <div v-for="(toast, index) in toasts" :key="index" :class="getToastClasses(toast.type)">
      <Iconify :icon="getToastIcon(toast.type)" class="w-5 h-5" />
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '../stores/toast'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

const getToastClasses = (type: string): string => {
  const baseClass = 'alert'

  // Mapping personnalisé des classes de couleur
  switch (type) {
    case 'success':
      return `${baseClass} bg-success text-success-content`
    case 'error':
      return `${baseClass} bg-error text-error-content`
    case 'warning':
      return `${baseClass} bg-warning text-warning-content`
    case 'info':
      return `${baseClass} bg-info text-info-content`
    default:
      return `${baseClass} bg-neutral text-neutral-content`
  }
}

const getToastIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return 'mdi:check-circle'
    case 'error':
      return 'mdi:alert-circle'
    case 'warning':
      return 'mdi:alert'
    case 'info':
      return 'mdi:information'
    default:
      return 'mdi:bell'
  }
}
</script>

<style scoped>
/* Styles additionnels pour améliorer l'apparence des toasts */
.toast {
  margin-top: 1rem;
}

.alert {
  margin-bottom: 0.5rem;
  min-width: 250px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
