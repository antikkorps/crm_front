<template>
  <div class="dashboard-container mx-auto px-4">
    <!-- En-tête avec KPIs optimisés pour mobile -->
    <h1 class="text-2xl font-bold mb-4">Tableau de bord</h1>

    <!-- KPIs -->
    <DashboardKpis :metrics="keyMetrics" />

    <!-- Cartes de statistiques existantes -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 xl:gap-6 mb-8">
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

    <!-- Graphiques et Activités récentes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Graphique des opportunités -->
      <div class="lg:col-span-2">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title">Pipeline d'opportunités</h2>
            <div class="h-80 w-full">
              <OpportunitiesChart />
            </div>
          </div>
        </div>
      </div>

      <!-- Activités récentes -->
      <ActivityTimeline
        :activities="recentActivities"
        :is-refreshing="isRefreshingActivities"
        @refresh="refreshActivities"
      />
    </div>

    <!-- Tâches prioritaires et Calendrier -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tâches prioritaires -->
      <TasksList
        :tasks="priorityTasks"
        @add="addTask"
        @edit="editTask"
        @complete="completeTask"
        @delete="deleteTask"
        @toggle-status="toggleTaskStatus"
      />

      <!-- Mini calendrier -->
      <MiniCalendar
        :events="upcomingEvents"
        :current-day="9"
        :event-days="[3, 8, 12, 15, 21]"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/components/dashboard/ActivityTimeline.vue'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline.vue'
import CardComponent from '@/components/dashboard/cardSingle.vue'
import type { KpiMetric } from '@/components/dashboard/DashboardKpis.vue'
import DashboardKpis from '@/components/dashboard/DashboardKpis.vue'
import type { CalendarEvent } from '@/components/dashboard/MiniCalendar.vue'
import MiniCalendar from '@/components/dashboard/MiniCalendar.vue'
import OpportunitiesChart from '@/components/dashboard/OpportunitiesChart.vue'
import type { Task } from '@/components/dashboard/TasksList.vue'
import TasksList from '@/components/dashboard/TasksList.vue'
import { apiRequest } from '@/services/api.service'
import { useToastStore } from '@/stores/toast'
import type { ApiActivity, Stats } from '@/types/dashboard.types'
import { onMounted, ref } from 'vue'

// Stats et récupération des données
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

// Helpers pour les stats
const getTitle = (key: string) => {
  const titles: Record<string, string> = {
    contacts: 'Contacts',
    companies: 'Entreprises',
    notes: 'Notes',
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

// Event handlers pour les composants
const handleAction = (key: string) => {
  console.log(`Action pour ${key}`)
}

// KPI metrics
const keyMetrics = ref<KpiMetric[]>([
  { title: 'Revenus', value: '12.5k€', trend: 12, icon: 'mdi:currency-eur' },
  { title: 'Prospects', value: '54', trend: 9, icon: 'mdi:account-multiple-plus' },
  { title: 'Taux conversion', value: '18%', trend: -2, icon: 'mdi:chart-timeline-variant' },
  { title: 'Devis en cours', value: '15', trend: -4, icon: 'mdi:file-sign' },
])

const recentActivities = ref<Activity[]>([])
const isRefreshingActivities = ref(false)
const toastStore = useToastStore()

const refreshActivities = async () => {
  console.log('Rafraîchissement des activités récentes')
  isRefreshingActivities.value = true
  try {
    const data = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/recent')

    // Transformation des données API en format attendu par le composant
    recentActivities.value = data.items.map((item) => {
      // Déterminer l'icône en fonction du type d'activité
      let icon = 'mdi:information'
      switch (item.type) {
        case 'CALL':
          icon = 'mdi:phone'
          break
        case 'MEETING':
          icon = 'mdi:calendar-account'
          break
        case 'EMAIL':
          icon = 'mdi:email'
          break
        case 'TASK':
          icon = 'mdi:check-circle'
          break
        case 'NOTE':
          icon = 'mdi:note-text'
          break
      }

      // Formater le temps relatif
      const createdDate = new Date(item.createdAt)
      const now = new Date()
      const diffMs = now.getTime() - createdDate.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      let timeText = ''
      if (diffMins < 60) {
        timeText = `Il y a ${diffMins} min`
      } else if (diffHours < 24) {
        timeText = `Il y a ${diffHours}h`
      } else if (diffDays === 1) {
        timeText = 'Hier'
      } else {
        timeText = `Il y a ${diffDays} jours`
      }

      // Formater une description adaptée selon le type d'activité
      let description = item.content || ''

      if (item.type === 'CALL' && item.Contact) {
        description = `Appel avec ${item.Contact.firstName} ${item.Contact.lastName}`
        if (item.callOutcome) description += ` - ${item.callOutcome}`
      } else if (item.type === 'MEETING') {
        const contact = item.Contact ? `${item.Contact.firstName} ${item.Contact.lastName}` : ''
        const company = item.Company ? `${item.Company.name}` : ''
        description = `Réunion${contact ? ` avec ${contact}` : ''}${company ? ` de ${company}` : ''}`
      } else if (item.type === 'TASK') {
        description = `Tâche${item.taskStatus ? ` - ${item.taskStatus}` : ''}`
        if (item.assignedTo) {
          description += ` (assignée à ${item.assignedTo.firstName} ${item.assignedTo.lastName})`
        }
      }

      return {
        title: item.title,
        description,
        time: timeText,
        icon,
      }
    })

    toastStore.success('Activités récentes mises à jour avec succès')
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des activités:', error)
    toastStore.error('Erreur lors de la mise à jour des activités')
  } finally {
    isRefreshingActivities.value = false
  }
}

// Tâches prioritaires
const priorityTasks = ref<Task[]>([
  {
    title: 'Appeler M. Dubois',
    assignee: 'Vous',
    dueDate: "Aujourd'hui",
    isCompleted: false,
    isOverdue: false,
  },
  {
    title: 'Préparer proposition commerciale',
    assignee: 'Julie',
    dueDate: 'Demain',
    isCompleted: false,
    isOverdue: false,
  },
  {
    title: 'Répondre aux emails en attente',
    assignee: 'Vous',
    dueDate: 'Hier',
    isCompleted: false,
    isOverdue: true,
  },
  {
    title: 'Suivre facture client #3241',
    assignee: 'Marc',
    dueDate: '25/05/2023',
    isCompleted: true,
    isOverdue: false,
  },
])

const addTask = () => {
  console.log('Ajouter une tâche')
}

const editTask = (index: number) => {
  console.log(`Modifier la tâche à l'index ${index}`)
}

const completeTask = (index: number) => {
  console.log(`Terminer la tâche à l'index ${index}`)
}

const deleteTask = (index: number) => {
  console.log(`Supprimer la tâche à l'index ${index}`)
}

const toggleTaskStatus = (index: number) => {
  priorityTasks.value[index].isCompleted = !priorityTasks.value[index].isCompleted
}

// Événements du calendrier
const upcomingEvents = ref<CalendarEvent[]>([
  { date: "Aujourd'hui, 15:00", title: "Réunion d'équipe", color: 'primary' },
  { date: 'Demain, 10:30', title: 'Appel client Société XYZ', color: 'success' },
  { date: '10 Mai, 14:00', title: 'Présentation produit', color: 'warning' },
  { date: '15 Mai, 09:00', title: 'Formation équipe commerciale', color: 'info' },
])

const handleDayClick = (day: number) => {
  console.log(`Jour sélectionné: ${day}`)
}

const handleEventClick = (index: number) => {
  console.log(`Événement sélectionné: ${upcomingEvents.value[index].title}`)
}

onMounted(() => {
  fetchStats()
  refreshActivities()
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
