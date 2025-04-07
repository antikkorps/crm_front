import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

let nextId = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = nextId++
    const newToast = { ...toast, id }

    toasts.value.push(newToast)

    // Supprimer automatiquement le toast après sa durée
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)

    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration: number = 3000) => {
    return addToast({ message, type: 'success', duration })
  }

  const error = (message: string, duration: number = 5000) => {
    return addToast({ message, type: 'error', duration })
  }

  const warning = (message: string, duration: number = 4000) => {
    return addToast({ message, type: 'warning', duration })
  }

  const info = (message: string, duration: number = 3000) => {
    return addToast({ message, type: 'info', duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
})
