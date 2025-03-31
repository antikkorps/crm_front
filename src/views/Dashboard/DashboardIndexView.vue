<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <CardComponent
      v-for="(value, key) in stats"
      :key="key"
      :title="getTitle(key)"
      :description="getDescription(key, value)"
      :keyName="key"
      actionLabel="Voir plus"
      @action="handleAction(key)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardComponent from '../../components/dashboard/card.vue'
import { apiRequest } from '../../services/api.service'

interface Stats {
  contacts: number
  companies: number
  notes: number
  reminders: {
    upcoming: number
    overdue: number
  }
}

const stats = ref<Stats>({
  contacts: 0,
  companies: 0,
  notes: 0,
  reminders: {
    upcoming: 0,
    overdue: 0,
  },
})

const fetchStats = async () => {
  try {
    const data = await apiRequest<{ counts: Stats }>('/v1/analytics/dashboard')
    stats.value = data.counts
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
  }
}

const getTitle = (key: string) => {
  const titles: Record<string, string> = {
    contacts: 'Nombre de Contacts',
    companies: "Nombre d'Entreprises",
    notes: 'Nombre de Notes',
    upcoming: 'Rappels à Venir',
    overdue: 'Rappels en Retard',
  }
  return titles[key] || 'Statistique'
}

const getDescription = (key: string, value: any) => {
  if (key === 'reminders') {
    return `Rappels à venir: ${value.upcoming}, Rappels en retard: ${value.overdue}`
  }
  return `Vous avez ${value} ${key === 'contacts' ? 'contact' : key}.`
}

const handleAction = (key: string) => {
  console.log(`Action pour ${key}`)
}

onMounted(() => {
  fetchStats()
})
</script>
