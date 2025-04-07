<template>
  <div class="card bg-base-100 shadow-sm w-full">
    <div class="card-body">
      <div class="flex justify-between items-center">
        <h2 class="card-title">
          {{ title }}
        </h2>
        <div class="bg-secondary opacity-95 rounded-full flex justify-center items-center p-2">
          <Iconify :icon="getIcon(keyName)" class="w-8 h-8 text-white" />
        </div>
      </div>
      <p>{{ description }}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary" @click="handleAction">{{ actionLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

// Définir les props pour le composant
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    default: 'Voir Plus',
  },
  keyName: {
    type: String,
    required: true,
  },
})

// Définir les émissions d'événements pour le composant
const emit = defineEmits(['action'])

// Fonction pour gérer l'action du bouton
const handleAction = () => {
  emit('action')
}

const getIcon = (key: string) => {
  const icons: Record<string, string> = {
    contacts: 'mdi:account-multiple',
    companies: 'mdi:office-building',
    notes: 'mdi:note-text',
    upcoming: 'mdi:calendar-clock',
    overdue: 'mdi:calendar-alert',
  }
  return icons[key] || 'mdi:chart-areaspline'
}
</script>

<style scoped>
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
</style>
