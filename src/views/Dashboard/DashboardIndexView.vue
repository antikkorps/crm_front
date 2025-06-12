<template>
  <div class="dashboard-container mx-auto px-4">
    <!-- En-tête avec KPIs optimisés pour mobile -->
    <h1 class="text-2xl font-bold mb-4">{{ t('common.dashboard', 1) }}</h1>

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

    <!-- Graphiques et Activités récentes - séparés en mobile -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Graphique des opportunités - pleine largeur et hauteur ajustée -->
      <div class="lg:col-span-2 mb-6 lg:mb-0">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">Pipeline d'opportunités</h2>
            <div style="min-height: 420px">
              <OpportunitiesChart />
            </div>
          </div>
        </div>
      </div>

      <!-- Activités récentes - dans une grille séparée en mobile -->
      <div class="lg:col-span-1">
        <ActivityTimeline
          :activities="recentActivities"
          :is-refreshing="isRefreshingActivities"
          @refresh="refreshActivities"
        />
      </div>
    </div>

    <!-- Tâches prioritaires et Calendrier -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tâches prioritaires - maintenant avec plus de fonctionnalités -->
      <TasksList
        title="Tâches en cours"
        :show-all-tasks="false"
        add-button-label="Ajouter une tâche"
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
import {
  DashboardActivityTimeline as ActivityTimeline,
  DashboardCardSingle as CardComponent,
  DashboardKpis,
  DashboardMiniCalendar as MiniCalendar,
  DashboardOpportunitiesChart as OpportunitiesChart,
  DashboardTasksList as TasksList,
} from '@/components/dashboard'
import type { Activity } from '@/components/dashboard/DashboardActivityTimeline.vue'
import type { KpiMetric } from '@/components/dashboard/DashboardKpis.vue'
import type { CalendarEvent } from '@/components/dashboard/DashboardMiniCalendar.vue'
import { ActivityService } from '@/services/activity.service'
import { apiRequest } from '@/services/api.service'
import { useToastStore } from '@/stores/toast'
import type { Stats } from '@/types/dashboard.types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const router = useRouter()

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
    const data = await apiRequest<{ counts: Stats }>('/v1/analytics/dashboard-summary')
    stats.value = data.counts
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
  }
}

// Helpers pour les stats
const getTitle = (key: string) => {
  const titles: Record<string, string> = {
    contacts: t('contacts.title'),
    companies: t('companies.title'),
    notes: t('notes.title'),
    upcoming: t('reminders.upcoming'),
    overdue: t('reminders.overdue'),
  }
  return titles[key] || t('statistics.title')
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
  switch (key) {
    case 'contacts':
      router.push('/contacts')
      break
    case 'companies':
      router.push('/companies')
      break
    case 'notes':
      router.push('/notes')
      break
    case 'reminders':
    case 'upcoming':
    case 'overdue':
      router.push('/reminders')
      break
    default:
      console.warn(`No route defined for ${key}`)
  }
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

const translateTaskStatus = (status: string | undefined): string => {
  if (!status) return ''

  const translations: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    TO_DO: 'À faire',
    COMPLETED: 'Terminée',
    CANCELED: 'Annulée',
    ON_HOLD: 'En attente',
    OVERDUE: 'En retard',
    PENDING: 'En suspens',
  }

  return translations[status] || status
}

const refreshActivities = async () => {
  isRefreshingActivities.value = true
  try {
    console.log('Début du chargement des activités récentes')
    const items = await ActivityService.getRecentActivities()
    console.log("Données reçues de l'API:", items)

    if (items.length === 0) {
      // Afficher un message lorsqu'il n'y a pas d'activités récentes
      recentActivities.value = [
        {
          title: 'Aucune activité récente',
          description: "Aucune activité n'a été enregistrée au cours des 7 derniers jours",
          time: 'Maintenant',
          icon: 'mdi:information-outline',
        },
      ]
      return
    }

    // Transformation des données API en format attendu par le composant
    recentActivities.value = items.map((item) => {
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
      let timeText = 'Récent'
      try {
        if (item.createdAt) {
          const createdDate = new Date(item.createdAt)
          const now = new Date()
          const diffMs = now.getTime() - createdDate.getTime()
          const diffMins = Math.floor(diffMs / (1000 * 60))
          const diffHours = Math.floor(diffMins / 60)
          const diffDays = Math.floor(diffHours / 24)

          if (diffMins < 60) {
            timeText = `Il y a ${diffMins} min`
          } else if (diffHours < 24) {
            timeText = `Il y a ${diffHours}h`
          } else if (diffDays === 1) {
            timeText = 'Hier'
          } else {
            timeText = `Il y a ${diffDays} jours`
          }
        }
      } catch (error) {
        console.error('Erreur lors du calcul du temps relatif:', error)
      }

      // Formater une description adaptée selon le type d'activité
      let description = item.content || ''

      if (item.type === 'CALL' && item.Contact) {
        const contactName = `${item.Contact.firstName || ''} ${item.Contact.lastName || ''}`.trim()
        description = contactName ? `Appel avec ${contactName}` : 'Appel'
        if (item.callOutcome) description += ` - ${item.callOutcome}`
      } else if (item.type === 'MEETING') {
        const contactName = item.Contact
          ? `${item.Contact.firstName || ''} ${item.Contact.lastName || ''}`.trim()
          : ''
        const companyName = item.Company ? `${item.Company.name || ''}`.trim() : ''
        description = `Réunion${contactName ? ` avec ${contactName}` : ''}${companyName ? ` de ${companyName}` : ''}`
      } else if (item.type === 'TASK') {
        description = `Tâche${item.taskStatus ? ` - ${translateTaskStatus(item.taskStatus)}` : ''}`
        if (item.assignedTo) {
          const assigneeName =
            `${item.assignedTo.firstName || ''} ${item.assignedTo.lastName || ''}`.trim()
          if (assigneeName) {
            description += ` (assignée à ${assigneeName})`
          }
        }
      }

      return {
        title: item.title || 'Activité sans titre',
        description: description || 'Pas de description',
        time: timeText,
        icon,
      }
    })
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des activités:', error)
    toastStore.error('Erreur lors de la mise à jour des activités')
    recentActivities.value = [
      {
        title: 'Erreur de chargement',
        description: 'Impossible de charger les activités récentes',
        time: 'Maintenant',
        icon: 'mdi:alert',
      },
    ]
  } finally {
    isRefreshingActivities.value = false
  }
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

/* Assurer une hauteur minimum pour le graphique, surtout en mobile */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
}
</style>
