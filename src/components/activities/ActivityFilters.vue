<template>
  <div class="bg-base-100 p-4 rounded-lg border border-base-200">
    <div class="flex flex-wrap gap-4">
      <!-- Type d'activité -->
      <div class="form-control min-w-40">
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.type') }}</span>
        </label>
        <select
          v-model="localFilters.type"
          class="select select-bordered select-sm"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="CALL">{{ t('activities.types.call') }}</option>
          <option value="MEETING">{{ t('activities.types.meeting') }}</option>
          <option value="EMAIL">{{ t('activities.types.email') }}</option>
          <option value="TASK">{{ t('activities.types.task') }}</option>
          <option value="NOTE">{{ t('activities.types.note') }}</option>
        </select>
      </div>

      <!-- Période -->
      <div class="form-control min-w-40">
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.period') }}</span>
        </label>
        <select
          v-model="localFilters.period"
          class="select select-bordered select-sm"
          @change="handlePeriodChange"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="today">{{ t('activities.periods.today') }}</option>
          <option value="yesterday">{{ t('activities.periods.yesterday') }}</option>
          <option value="thisWeek">{{ t('activities.periods.thisWeek') }}</option>
          <option value="lastWeek">{{ t('activities.periods.lastWeek') }}</option>
          <option value="thisMonth">{{ t('activities.periods.thisMonth') }}</option>
          <option value="lastMonth">{{ t('activities.periods.lastMonth') }}</option>
          <option value="custom">{{ t('activities.periods.custom') }}</option>
        </select>
      </div>

      <!-- Dates personnalisées (si période custom) -->
      <div v-if="localFilters.period === 'custom'" class="form-control">
        <label class="label">
          <span class="label-text font-medium">{{ t('common.from') }}</span>
        </label>
        <input
          v-model="localFilters.startDate"
          type="date"
          class="input input-bordered input-sm"
          @change="emitFilters"
        />
      </div>

      <div v-if="localFilters.period === 'custom'" class="form-control">
        <label class="label">
          <span class="label-text font-medium">{{ t('common.to') }}</span>
        </label>
        <input
          v-model="localFilters.endDate"
          type="date"
          class="input input-bordered input-sm"
          @change="emitFilters"
        />
      </div>

      <!-- Assigné à -->
      <div class="form-control min-w-48">
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.assignedTo') }}</span>
        </label>
        <select
          v-model="localFilters.assignedToId"
          class="select select-bordered select-sm"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="unassigned">{{ t('common.unassigned') }}</option>
          <option v-for="user in availableUsers" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>

      <!-- Priorité (pour TASK et MEETING) -->
      <div
        v-if="localFilters.type && ['TASK', 'MEETING'].includes(localFilters.type)"
        class="form-control min-w-32"
      >
        <label class="label">
          <span class="label-text font-medium">{{ t('activities.priority') }}</span>
        </label>
        <select
          v-model="localFilters.priority"
          class="select select-bordered select-sm"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="HIGH">{{ t('activities.priority.high') }}</option>
          <option value="MEDIUM">{{ t('activities.priority.medium') }}</option>
          <option value="LOW">{{ t('activities.priority.low') }}</option>
        </select>
      </div>

      <!-- Statut spécialisé selon le type -->
      <div v-if="localFilters.type === 'CALL'" class="form-control min-w-40">
        <label class="label">
          <span class="label-text font-medium">{{ t('calls.outcome') }}</span>
        </label>
        <select
          v-model="localFilters.callOutcome"
          class="select select-bordered select-sm"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="ANSWERED">{{ t('calls.outcome.answered') }}</option>
          <option value="NO_ANSWER">{{ t('calls.outcome.noAnswer') }}</option>
          <option value="BUSY">{{ t('calls.outcome.busy') }}</option>
          <option value="VOICEMAIL">{{ t('calls.outcome.voicemail') }}</option>
          <option value="FAILED">{{ t('calls.outcome.failed') }}</option>
        </select>
      </div>

      <div v-if="localFilters.type === 'EMAIL'" class="form-control min-w-40">
        <label class="label">
          <span class="label-text font-medium">{{ t('emails.status') }}</span>
        </label>
        <select
          v-model="localFilters.emailStatus"
          class="select select-bordered select-sm"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="DRAFT">{{ t('emails.status.draft') }}</option>
          <option value="SENT">{{ t('emails.status.sent') }}</option>
          <option value="DELIVERED">{{ t('emails.status.delivered') }}</option>
          <option value="OPENED">{{ t('emails.status.opened') }}</option>
          <option value="REPLIED">{{ t('emails.status.replied') }}</option>
          <option value="BOUNCED">{{ t('emails.status.bounced') }}</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex items-end gap-2">
        <button class="btn btn-ghost btn-sm" @click="resetFilters">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ t('common.reset') }}
        </button>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-200"
          >
            <li>
              <a @click="emitFilters">{{ t('activities.applyFilters') }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Filtres actifs -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-base-200">
      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-base-content/70"
          >{{ t('activities.activeFilters') }}:</span
        >

        <div
          v-for="filter in activeFiltersList"
          :key="filter.key"
          class="badge badge-primary gap-1"
        >
          {{ filter.label }}
          <button @click="removeFilter(filter.key)" class="btn btn-ghost btn-xs p-0 h-auto min-h-0">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import type { ActivityUIFilters } from '@/types/activity.types'
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()

// Props
const props = defineProps<{
  filters: ActivityUIFilters
}>()

// Emits
const emit = defineEmits<{
  'update:filters': [filters: ActivityUIFilters]
  apply: []
  reset: []
}>()

// État local
const localFilters = reactive<ActivityUIFilters>({ ...props.filters })
const availableUsers = computed(() => userStore.users)

// Surveiller les changements de props
watch(
  () => props.filters,
  (newFilters) => {
    Object.assign(localFilters, newFilters)
  },
  { deep: true },
)

// Computed
const hasActiveFilters = computed(() => {
  return Object.values(localFilters).some(
    (value) => value !== '' && value !== null && value !== undefined,
  )
})

const activeFiltersList = computed(() => {
  const filters = []

  if (localFilters.type) {
    filters.push({
      key: 'type',
      label: t(`activities.types.${localFilters.type.toLowerCase()}`),
    })
  }

  if (localFilters.period && localFilters.period !== 'custom') {
    filters.push({
      key: 'period',
      label: t(`activities.periods.${localFilters.period}`),
    })
  }

  if (localFilters.assignedToId) {
    if (localFilters.assignedToId === 'unassigned') {
      filters.push({
        key: 'assignedToId',
        label: t('common.unassigned'),
      })
    } else {
      const user = availableUsers.value.find((u) => u.id === localFilters.assignedToId)
      if (user) {
        filters.push({
          key: 'assignedToId',
          label: `${user.firstName} ${user.lastName}`,
        })
      }
    }
  }

  if (localFilters.priority) {
    filters.push({
      key: 'priority',
      label: t(`activities.priority.${localFilters.priority.toLowerCase()}`),
    })
  }

  if (localFilters.callOutcome) {
    filters.push({
      key: 'callOutcome',
      label: t(`calls.outcome.${localFilters.callOutcome.toLowerCase()}`),
    })
  }

  if (localFilters.emailStatus) {
    filters.push({
      key: 'emailStatus',
      label: t(`emails.status.${localFilters.emailStatus.toLowerCase()}`),
    })
  }

  if (localFilters.startDate && localFilters.endDate) {
    filters.push({
      key: 'dateRange',
      label: `${localFilters.startDate} - ${localFilters.endDate}`,
    })
  }

  return filters
})

// Méthodes
function emitFilters() {
  emit('update:filters', { ...localFilters })
}

function handlePeriodChange() {
  if (localFilters.period !== 'custom') {
    localFilters.startDate = ''
    localFilters.endDate = ''

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (localFilters.period) {
      case 'today':
        localFilters.startDate = today.toISOString().split('T')[0]
        localFilters.endDate = today.toISOString().split('T')[0]
        break
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        localFilters.startDate = yesterday.toISOString().split('T')[0]
        localFilters.endDate = yesterday.toISOString().split('T')[0]
        break
      case 'thisWeek':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        localFilters.startDate = startOfWeek.toISOString().split('T')[0]
        localFilters.endDate = today.toISOString().split('T')[0]
        break
    }
  }
  emitFilters()
}

function resetFilters() {
  localFilters.type = ''
  localFilters.assignedToId = ''
  localFilters.startDate = ''
  localFilters.endDate = ''
  localFilters.priority = ''
  localFilters.callOutcome = ''
  localFilters.emailStatus = ''
  localFilters.period = ''
  emit('reset')
}

function removeFilter(filterKey: string) {
  switch (filterKey) {
    case 'type':
      localFilters.type = ''
      break
    case 'assignedToId':
      localFilters.assignedToId = ''
      break
    case 'period':
      localFilters.period = ''
      localFilters.startDate = ''
      localFilters.endDate = ''
      break
    case 'priority':
      localFilters.priority = ''
      break
    case 'callOutcome':
      localFilters.callOutcome = ''
      break
    case 'emailStatus':
      localFilters.emailStatus = ''
      break
    case 'dateRange':
      localFilters.startDate = ''
      localFilters.endDate = ''
      break
  }
  emitFilters()
}
</script>
