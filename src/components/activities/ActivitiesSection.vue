<template>
  <div class="space-y-6">
    <!-- En-tête avec actions -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">{{ t('activities.title') }}</h2>
        <p class="text-base-content/70 mt-1">
          {{ t('activities.subtitle') }}
          <span v-if="totalActivities > 0" class="font-medium">
            ({{ totalActivities }} {{ t('activities.total') }})
          </span>
        </p>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm" @click="showFilters = !showFilters">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {{ t('activities.filters') }}
        </button>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-primary btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ t('activities.new') }}
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-200"
          >
            <li>
              <a @click="createActivity('CALL')">
                <ActivityIcon type="CALL" size="sm" />
                {{ t('activities.types.call') }}
              </a>
            </li>
            <li>
              <a @click="createActivity('MEETING')">
                <ActivityIcon type="MEETING" size="sm" />
                {{ t('activities.types.meeting') }}
              </a>
            </li>
            <li>
              <a @click="createActivity('EMAIL')">
                <ActivityIcon type="EMAIL" size="sm" />
                {{ t('activities.types.email') }}
              </a>
            </li>
            <li>
              <a @click="createActivity('TASK')">
                <ActivityIcon type="TASK" size="sm" />
                {{ t('activities.types.task') }}
              </a>
            </li>
            <li>
              <a @click="createActivity('NOTE')">
                <ActivityIcon type="NOTE" size="sm" />
                {{ t('activities.types.note') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="space-y-3">
      <!-- Indication de filtrage -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm text-base-content/70">
            {{ t('activities.filterByType') }}
          </span>
          <div v-if="selectedActivityTypes.size > 0" class="flex items-center gap-2">
            <span class="badge badge-primary badge-sm">
              {{ selectedActivityTypes.size }} {{ t('activities.typesSelected') }}
            </span>
            <button class="btn btn-ghost btn-xs" @click="clearTypeFilters">
              {{ t('activities.clearTypes') }}
            </button>
          </div>
        </div>
        <div class="text-xs text-base-content/50">
          {{ t('activities.clickToFilter') }}
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-primary bg-primary/5': selectedActivityTypes.has('CALL'),
            'hover:bg-base-200': !selectedActivityTypes.has('CALL'),
          }"
          @click="toggleActivityTypeFilter('CALL')"
        >
          <div class="stat-figure text-primary">
            <ActivityIcon type="CALL" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.call') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.calls || 0} ${t('activities.types.call').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.calls || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-secondary bg-secondary/5': selectedActivityTypes.has('MEETING'),
            'hover:bg-base-200': !selectedActivityTypes.has('MEETING'),
          }"
          @click="toggleActivityTypeFilter('MEETING')"
        >
          <div class="stat-figure text-secondary">
            <ActivityIcon type="MEETING" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.meeting') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.meetings || 0} ${t('activities.types.meeting').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.meetings || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-accent bg-accent/5': selectedActivityTypes.has('EMAIL'),
            'hover:bg-base-200': !selectedActivityTypes.has('EMAIL'),
          }"
          @click="toggleActivityTypeFilter('EMAIL')"
        >
          <div class="stat-figure text-accent">
            <ActivityIcon type="EMAIL" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.email') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.emails || 0} ${t('activities.types.email').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.emails || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-info bg-info/5': selectedActivityTypes.has('TASK'),
            'hover:bg-base-200': !selectedActivityTypes.has('TASK'),
          }"
          @click="toggleActivityTypeFilter('TASK')"
        >
          <div class="stat-figure text-info">
            <ActivityIcon type="TASK" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.task') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.tasks || 0} ${t('activities.types.task').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.tasks || 0) }}
          </div>
        </div>

        <div
          class="stat bg-base-100 rounded-lg border border-base-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="{
            'ring-2 ring-warning bg-warning/5': selectedActivityTypes.has('NOTE'),
            'hover:bg-base-200': !selectedActivityTypes.has('NOTE'),
          }"
          @click="toggleActivityTypeFilter('NOTE')"
        >
          <div class="stat-figure text-warning">
            <ActivityIcon type="NOTE" size="lg" />
          </div>
          <div class="stat-title text-xs">{{ t('activities.types.note') }}</div>
          <div
            class="stat-value text-lg font-medium"
            :title="`${activityCounts.notes || 0} ${t('activities.types.note').toLowerCase()}`"
          >
            {{ formatNumber(activityCounts.notes || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <ActivityFilters
      v-if="showFilters"
      :filters="filters"
      @update:filters="handleFiltersUpdate"
      @reset="resetFilters"
    />

    <!-- Liste des activités -->
    <div class="space-y-4">
      <!-- En-tête de liste -->
      <div class="flex items-center justify-between">
        <div class="tabs tabs-bordered">
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'all' }"
            @click="setActiveTab('all')"
          >
            {{ t('activities.tabs.all') }}
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'pending' }"
            @click="setActiveTab('pending')"
          >
            {{ t('activities.tabs.pending') }}
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'completed' }"
            @click="setActiveTab('completed')"
          >
            {{ t('activities.tabs.completed') }}
          </a>
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'overdue' }"
            @click="setActiveTab('overdue')"
          >
            {{ t('activities.tabs.overdue') }}
          </a>
        </div>

        <div class="flex items-center gap-2">
          <select v-model="sortBy" class="select select-bordered select-sm">
            <option value="createdAt">{{ t('activities.sort.date') }}</option>
            <option value="dueDate">{{ t('activities.sort.dueDate') }}</option>
            <option value="priority">{{ t('activities.sort.priority') }}</option>
            <option value="type">{{ t('activities.sort.type') }}</option>
          </select>

          <button
            class="btn btn-ghost btn-sm"
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          >
            <svg
              class="w-4 h-4"
              :class="{ 'rotate-180': sortOrder === 'desc' }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <!-- Liste vide -->
      <div v-else-if="activities.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-base-content/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium">{{ t('activities.empty.title') }}</h3>
        <p class="mt-1 text-sm text-base-content/70">
          {{ t('activities.empty.description') }}
        </p>
        <div class="mt-6">
          <button class="btn btn-primary btn-sm" @click="createActivity('TASK')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ t('activities.empty.createFirst') }}
          </button>
        </div>
      </div>

      <!-- Activités -->
      <div v-else class="space-y-3">
        <ActivityCard
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
          @edit="editActivity"
          @delete="deleteActivity"
          @duplicate="duplicateActivity"
          @complete="completeActivity"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            «
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            »
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <dialog ref="activityModal" class="modal">
      <div class="modal-box max-w-5xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <!-- Formulaires spécialisés -->
        <CallForm
          v-if="showActivityForm && selectedActivityType === 'CALL'"
          :key="`call-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <MeetingForm
          v-if="showActivityForm && selectedActivityType === 'MEETING'"
          :key="`meeting-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <EmailForm
          v-if="showActivityForm && selectedActivityType === 'EMAIL'"
          :key="`email-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <TaskForm
          v-if="showActivityForm && selectedActivityType === 'TASK'"
          :key="`task-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />

        <NoteForm
          v-if="showActivityForm && selectedActivityType === 'NOTE'"
          :key="`note-${formKey}`"
          :activity="editingActivity"
          :available-users="availableUsers"
          :is-edit-mode="!!editingActivity"
          @save="saveActivity"
          @cancel="closeModal"
        />
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ActivityService } from '@/services/activity.service'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type {
  Activity,
  ActivityCounts,
  ActivityFiltersPaginated,
  ActivityType,
  ActivityUIFilters,
  CreateActivityDto,
  UpdateActivityDto,
} from '@/types/activity.types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ActivityCard from './ActivityCard.vue'
import ActivityFilters from './ActivityFilters.vue'
import ActivityIcon from './ActivityIcon.vue'
import CallForm from './forms/CallForm.vue'
import EmailForm from './forms/EmailForm.vue'
import MeetingForm from './forms/MeetingForm.vue'
import NoteForm from './forms/NoteForm.vue'
import TaskForm from './forms/TaskForm.vue'

const { t } = useI18n()
const toast = useToastStore()
const userStore = useUserStore()

// Props
const props = defineProps<{
  companyId?: string
  contactId?: string
}>()

// État local
const activities = ref<Activity[]>([])
const loading = ref(false)
const showFilters = ref(false)
const editingActivity = ref<Activity | null>(null)
const activityModal = ref<HTMLDialogElement>()
const selectedActivityType = ref<ActivityType>('TASK')
const showActivityForm = ref(false)
const formKey = ref(0)

// Filtres par type d'activité (via les cartes)
const selectedActivityTypes = ref<Set<ActivityType>>(new Set())

// Tabs et tri
const activeTab = ref('all')
const sortBy = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalActivities = ref(0)

// Filtres
const filters = ref<ActivityUIFilters>({
  type: '',
  assignedToId: '',
  startDate: '',
  endDate: '',
  priority: '',
  callOutcome: '',
  emailStatus: '',
  period: '',
  progressMin: '',
  progressMax: '',
})

// Statistiques
const activityCounts = ref<ActivityCounts>({
  total: 0,
  calls: 0,
  meetings: 0,
  tasks: 0,
  emails: 0,
  notes: 0,
})

// Computed
const totalPages = computed(() => Math.ceil(totalActivities.value / pageSize.value))

const availableUsers = computed(() => userStore.users)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Watchers
watch(
  [filters, currentPage, activeTab, sortBy, sortOrder, selectedActivityTypes],
  () => {
    loadActivities()
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  loadActivities()
  loadActivityCounts()
  userStore.fetchUsers()
})

// Méthodes
async function loadActivities() {
  loading.value = true
  try {
    const activityFilters: ActivityFiltersPaginated = {
      companyId: props.companyId,
      contactId: props.contactId,
      page: currentPage.value,
      limit: pageSize.value,
    }

    // Convertir les filtres UI en filtres service
    if (selectedActivityTypes.value.size > 0) {
      activityFilters.type = Array.from(selectedActivityTypes.value)
      console.log('Types sélectionnés:', activityFilters.type)
    }
    if (filters.value.assignedToId) {
      activityFilters.assignedToId = filters.value.assignedToId
    }
    if (filters.value.startDate && filters.value.endDate) {
      activityFilters.dateRange = {
        start: filters.value.startDate,
        end: filters.value.endDate,
      }
    }
    if (filters.value.priority) {
      activityFilters.priority = filters.value.priority
    }
    if (filters.value.callOutcome) {
      activityFilters.callOutcome = filters.value.callOutcome
    }
    if (filters.value.emailStatus) {
      activityFilters.emailStatus = filters.value.emailStatus
    }
    // Gestion des filtres de progression
    if (filters.value.progressMin) {
      activityFilters.progressMin = parseInt(filters.value.progressMin)
    }
    if (filters.value.progressMax) {
      activityFilters.progressMax = parseInt(filters.value.progressMax)
    }

    // Filtrer par statut selon l'onglet actif
    const statusFilter = getStatusFromTab()
    if (statusFilter) {
      activityFilters.status = statusFilter
    }

    const response = await ActivityService.getActivitiesPaginated(activityFilters)

    console.log('Filtres appliqués:', activityFilters)
    console.log('Réponse API:', response)

    activities.value = response.data
    totalActivities.value = response.total
  } catch (error) {
    console.error('Erreur lors du chargement des activités:', error)
    toast.error(t('activities.loadError'))
  } finally {
    loading.value = false
  }
}

async function loadActivityCounts() {
  try {
    const counts = await ActivityService.getActivityCounts({
      companyId: props.companyId,
      contactId: props.contactId,
    })
    activityCounts.value = counts
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

function getStatusFromTab(): string[] | undefined {
  switch (activeTab.value) {
    case 'pending':
      return ['pending', 'in_progress']
    case 'completed':
      return ['completed']
    case 'overdue':
      return ['overdue']
    default:
      return undefined
  }
}

function setActiveTab(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
}

function createActivity(type: ActivityType) {
  editingActivity.value = null
  selectedActivityType.value = type
  showActivityForm.value = true
  formKey.value++
  activityModal.value?.showModal()
}

function editActivity(activity: Activity) {
  editingActivity.value = activity
  // Validation du type d'activité
  const validTypes: ActivityType[] = ['CALL', 'MEETING', 'TASK', 'EMAIL', 'NOTE']
  if (validTypes.includes(activity.type as ActivityType)) {
    selectedActivityType.value = activity.type as ActivityType
  } else {
    console.warn("Type d'activité invalide:", activity.type)
    selectedActivityType.value = 'TASK' // Type par défaut
  }
  showActivityForm.value = true
  formKey.value++
  activityModal.value?.showModal()
}

async function deleteActivity(activity: Activity) {
  if (!confirm(t('activities.deleteConfirm', { title: activity.title }))) {
    return
  }

  try {
    await ActivityService.deleteActivity(activity.id)
    toast.success(t('activities.deleteSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast.error(t('activities.deleteError'))
  }
}

async function duplicateActivity(activity: Activity) {
  try {
    await ActivityService.duplicateActivity(activity.id)
    toast.success(t('activities.duplicateSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la duplication:', error)
    toast.error(t('activities.duplicateError'))
  }
}

async function completeActivity(activity: Activity) {
  try {
    await ActivityService.completeActivity(activity.id)
    toast.success(t('activities.completeSuccess'))
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la completion:', error)
    toast.error(t('activities.completeError'))
  }
}

async function saveActivity(data: CreateActivityDto | UpdateActivityDto) {
  try {
    console.log('Données reçues du formulaire:', data)
    console.log('Mode édition:', !!editingActivity.value)
    console.log("Type d'activité sélectionné:", selectedActivityType.value)

    if (editingActivity.value) {
      await ActivityService.updateActivity(editingActivity.value.id, data as UpdateActivityDto)
      toast.success(t('activities.updateSuccess'))
    } else {
      const createData = {
        ...(data as CreateActivityDto),
        type: selectedActivityType.value,
        companyId: props.companyId,
        contactId: props.contactId,
      }
      console.log("Données finales envoyées à l'API:", createData)
      await ActivityService.createSpecializedActivity(createData)
      toast.success(t('activities.createSuccess'))
    }

    closeModal()
    loadActivities()
    loadActivityCounts()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    toast.error(editingActivity.value ? t('activities.updateError') : t('activities.createError'))
  }
}

function closeModal() {
  activityModal.value?.close()
  editingActivity.value = null
  showActivityForm.value = false
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function resetFilters() {
  filters.value = {
    type: '',
    assignedToId: '',
    startDate: '',
    endDate: '',
    priority: '',
    callOutcome: '',
    emailStatus: '',
    period: '',
    progressMin: '',
    progressMax: '',
  }
  selectedActivityTypes.value.clear()
  selectedActivityTypes.value = new Set()
  currentPage.value = 1
}

// Gérer la mise à jour des filtres depuis le composant ActivityFilters
function handleFiltersUpdate(newFilters: ActivityUIFilters) {
  Object.assign(filters.value, newFilters)
}

// Gestion des filtres par type d'activité via les cartes
function toggleActivityTypeFilter(type: ActivityType) {
  if (selectedActivityTypes.value.has(type)) {
    selectedActivityTypes.value.delete(type)
  } else {
    selectedActivityTypes.value.add(type)
  }
  // Force reactivity update
  selectedActivityTypes.value = new Set(selectedActivityTypes.value)
  currentPage.value = 1
}

function clearTypeFilters() {
  selectedActivityTypes.value.clear()
  selectedActivityTypes.value = new Set()
  currentPage.value = 1
}

// Fonction pour formater les grands nombres
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>
