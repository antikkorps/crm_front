<template>
  <div class="dashboard-container mx-auto px-4">
    <!-- En-tête avec KPIs optimisés pour mobile -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-4">Tableau de bord</h1>

      <!-- Version desktop des KPIs (affiché uniquement sur écrans md et plus grands) -->
      <div class="hidden md:grid md:grid-cols-4 gap-4">
        <div
          v-for="(metric, idx) in keyMetrics"
          :key="`desktop-${idx}`"
          class="stat bg-base-100 shadow-sm rounded-lg p-4"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-full bg-primary/10">
              <Iconify :icon="metric.icon" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <div class="stat-title text-xs">{{ metric.title }}</div>
              <div class="stat-value text-2xl">{{ metric.value }}</div>
            </div>
          </div>
          <div
            class="stat-desc text-xs mt-2"
            :class="metric.trend > 0 ? 'text-success' : 'text-error'"
          >
            {{ metric.trend > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(metric.trend) }}% depuis le mois
            dernier
          </div>
        </div>
      </div>

      <!-- Version mobile des KPIs (affiché uniquement sur écrans plus petits que md) -->
      <div class="grid grid-cols-2 gap-3 md:hidden">
        <div
          v-for="(metric, idx) in keyMetrics"
          :key="`mobile-${idx}`"
          class="bg-base-100 shadow-sm rounded-lg p-3"
        >
          <div class="flex items-center gap-2 mb-1">
            <div class="p-1 rounded-full bg-primary/10">
              <Iconify :icon="metric.icon" class="w-4 h-4 text-primary" />
            </div>
            <div class="text-xs font-medium">{{ metric.title }}</div>
          </div>
          <div class="text-lg font-bold">{{ metric.value }}</div>
          <div class="text-xs mt-1" :class="metric.trend > 0 ? 'text-success' : 'text-error'">
            {{ metric.trend > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(metric.trend) }}%
          </div>
        </div>
      </div>
    </div>

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
      <!-- Graphique des ventes/opportunités -->
      <div class="card bg-base-100 shadow-sm lg:col-span-2">
        <div class="card-body">
          <h2 class="card-title">Pipeline d'opportunités</h2>
          <div class="h-80 w-full">
            <OpportunitiesChart />
          </div>
        </div>
      </div>

      <!-- Activités récentes -->
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title flex justify-between items-center">
            <span>Activités récentes</span>
            <button class="btn btn-sm btn-ghost">
              <Iconify icon="mdi:refresh" class="w-4 h-4" />
            </button>
          </h2>
          <div class="overflow-y-auto max-h-80">
            <ul
              class="timeline timeline-compact timeline-snap-icon max-md:timeline-compact timeline-vertical"
            >
              <li v-for="(activity, index) in recentActivities" :key="index">
                <div class="timeline-middle">
                  <Iconify :icon="activity.icon" class="w-5 h-5 text-primary" />
                </div>
                <div class="timeline-end mb-4">
                  <div class="text-sm font-bold">{{ activity.title }}</div>
                  <div class="text-xs text-gray-500">{{ activity.time }}</div>
                  <div class="text-sm">{{ activity.description }}</div>
                </div>
                <hr />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Tâches prioritaires et Calendrier -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Tâches prioritaires -->
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title flex justify-between items-center">
            <span>Tâches prioritaires</span>
            <button class="btn btn-sm btn-primary">
              <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" /> Nouvelle tâche
            </button>
          </h2>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th class="w-12"></th>
                  <th>Tâche</th>
                  <th>Assigné à</th>
                  <th>Échéance</th>
                  <th class="w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(task, index) in priorityTasks"
                  :key="index"
                  :class="task.isOverdue ? 'text-error' : ''"
                >
                  <td>
                    <input
                      type="checkbox"
                      :checked="task.isCompleted"
                      class="checkbox checkbox-sm"
                    />
                  </td>
                  <td>{{ task.title }}</td>
                  <td>{{ task.assignee }}</td>
                  <td>{{ task.dueDate }}</td>
                  <td>
                    <div class="dropdown dropdown-end">
                      <label tabindex="0" class="btn btn-ghost btn-xs">
                        <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
                      </label>
                      <ul
                        tabindex="0"
                        class="dropdown-content z-[1] menu menu-sm shadow bg-base-100 rounded-box w-32"
                      >
                        <li><a>Modifier</a></li>
                        <li><a>Terminer</a></li>
                        <li><a class="text-error">Supprimer</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Mini calendrier -->
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
          <h2 class="card-title">Événements à venir</h2>
          <div class="grid grid-cols-7 gap-1 text-center mb-2">
            <div
              class="text-sm font-medium"
              v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
              :key="day"
            >
              {{ day }}
            </div>
            <div
              v-for="n in 31"
              :key="n"
              class="aspect-square flex items-center justify-center text-sm rounded-md"
              :class="getCalendarDayClass(n)"
            >
              {{ n }}
            </div>
          </div>
          <div class="divider my-1"></div>
          <div class="space-y-2">
            <div
              v-for="(event, index) in upcomingEvents"
              :key="index"
              class="flex items-center gap-2"
            >
              <div class="w-2 h-2 rounded-full" :class="`bg-${event.color}`"></div>
              <span class="text-sm">{{ event.date }}</span>
              <span class="text-sm font-medium">{{ event.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon as Iconify } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import CardComponent from '../../components/dashboard/cardSingle.vue'
import OpportunitiesChart from '../../components/dashboard/OpportunitiesChart.vue'
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

// Métriques clés
const keyMetrics = ref([
  { title: 'Revenus', value: '12.5k€', trend: 12, icon: 'mdi:currency-eur' },
  { title: 'Prospects', value: '54', trend: 9, icon: 'mdi:account-multiple-plus' },
  { title: 'Taux conversion', value: '18%', trend: -2, icon: 'mdi:chart-timeline-variant' },
  { title: 'Tickets ouverts', value: '15', trend: -4, icon: 'mdi:ticket-outline' },
])

// Activités récentes
const recentActivities = ref([
  {
    title: 'Contact créé',
    description: 'Marie Dupont a ajouté un nouveau contact',
    time: 'Il y a 10 min',
    icon: 'mdi:account-plus',
  },
  {
    title: 'Contrat signé',
    description: 'Contrat #45892 avec Entreprise ABC',
    time: 'Il y a 2h',
    icon: 'mdi:file-document',
  },
  {
    title: 'Tâche complétée',
    description: 'Paul a terminé "Préparation devis client"',
    time: 'Il y a 5h',
    icon: 'mdi:check-circle',
  },
  {
    title: 'Appel planifié',
    description: 'Rendez-vous téléphonique avec Jean Martin',
    time: 'Hier, 16:30',
    icon: 'mdi:phone',
  },
  {
    title: 'Opportunité gagnée',
    description: '25 000€ - Projet refonte site web',
    time: 'Hier, 10:15',
    icon: 'mdi:trophy',
  },
])

// Tâches prioritaires
const priorityTasks = ref([
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

// Événements du calendrier
const upcomingEvents = ref([
  { date: "Aujourd'hui, 15:00", title: "Réunion d'équipe", color: 'primary' },
  { date: 'Demain, 10:30', title: 'Appel client Société XYZ', color: 'success' },
  { date: '10 Mai, 14:00', title: 'Présentation produit', color: 'warning' },
  { date: '15 Mai, 09:00', title: 'Formation équipe commerciale', color: 'info' },
])

// Fonction pour déterminer les classes CSS pour les jours du calendrier
const getCalendarDayClass = (day: number) => {
  // Exemple: marquer quelques jours comme ayant des événements
  const hasEvent = [3, 8, 12, 15, 21].includes(day)
  const isToday = day === 9 // Exemple: aujourd'hui est le 9

  if (isToday) return 'bg-primary text-white font-bold'
  if (hasEvent) return 'bg-base-200 font-medium cursor-pointer hover:bg-primary hover:text-white'
  return 'hover:bg-base-200 cursor-pointer'
}
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
