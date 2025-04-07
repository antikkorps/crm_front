<template>
  <div class="dashboard-container mx-auto px-4">
    <!-- Grille responsive avec meilleur espacement -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
      <div v-for="(value, key) in stats" :key="key" class="card-wrapper">
        <CardComponent
          :title="getTitle(key)"
          :description="getDescription(key, value)"
          :keyName="key"
          actionLabel="Voir plus"
          @action="handleAction(key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CardComponent from '../../components/dashboard/cardSingle.vue'
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

const getDescription = (key: string, value: number | { upcoming: number; overdue: number }) => {
  if (key === 'reminders') {
    return `Rappels à venir: ${(value as { upcoming: number; overdue: number }).upcoming}, Rappels en retard: ${(value as { upcoming: number; overdue: number }).overdue}`
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

<style scoped>
.dashboard-container {
  max-width: 1400px;
}

/* Ajustements spécifiques pour la plage problématique */
@media (min-width: 762px) and (max-width: 1022px) {
  .dashboard-container {
    max-width: 95%;
    padding-left: 10px;
    padding-right: 10px;
  }

  .grid {
    column-gap: 20px !important;
  }

  .card-wrapper {
    width: 100%;
    max-width: none;
  }
}
</style>
