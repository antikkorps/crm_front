<template>
  <div
    class="card bg-base-100 shadow-sm border hover:shadow-md transition-shadow"
    :class="{ 'cursor-pointer': clickable }"
    @click="$emit('task-click', task)"
  >
    <div class="card-body p-4">
      <!-- En-tête avec titre et priorité -->
      <div class="flex justify-between items-start mb-2">
        <h3 class="card-title text-base">{{ task.title }}</h3>
        <span :class="getPriorityBadgeClass(task.priority ?? null)" class="badge badge-sm">
          {{ getPriorityLabel(task.priority ?? null) }}
        </span>
      </div>

      <!-- Statut et échéance -->
      <div class="flex justify-between items-center mb-2">
        <span
          :class="getStatusBadgeClass(task.taskStatus ?? null)"
          class="px-2 py-1 text-xs rounded-full"
        >
          {{ getStatusLabel(task.taskStatus ?? null) }}
        </span>
        <span v-if="task.dueDate" :class="getDueDateClass(task.dueDate)" class="text-sm">
          {{ formatDateOnly(task.dueDate) }}
        </span>
      </div>

      <!-- Assignation -->
      <div class="flex items-center gap-2 mb-2 text-sm text-gray-600">
        <Iconify icon="mdi:account" class="w-4 h-4" />
        <span v-if="task.assignedTo">
          {{ task.assignedTo.firstName }} {{ task.assignedTo.lastName }}
        </span>
        <span v-else class="text-gray-400">{{ t('common.notAssigned') }}</span>
      </div>

      <!-- Description -->
      <div v-if="task.content && showPreview" class="text-sm text-gray-500 mt-2 line-clamp-2">
        {{ task.content }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-1 mt-3">
        <button
          class="btn btn-sm btn-ghost"
          @click.stop="$emit('view-task', task)"
          :title="t('common.view')"
        >
          <Iconify icon="mdi:eye" class="w-4 h-4" />
        </button>
        <button
          v-if="task.taskStatus !== 'COMPLETED'"
          class="btn btn-sm btn-ghost text-success"
          @click.stop="$emit('complete-task', task.id)"
          :title="t('tasks.complete')"
        >
          <Iconify icon="mdi:check" class="w-4 h-4" />
        </button>
        <button
          v-else
          class="btn btn-sm btn-ghost text-warning"
          @click.stop="$emit('reopen-task', task.id)"
          :title="t('tasks.reopen')"
        >
          <Iconify icon="mdi:undo" class="w-4 h-4" />
        </button>
        <button
          class="btn btn-sm btn-ghost"
          @click.stop="$emit('edit-task', task)"
          :title="t('common.edit')"
        >
          <Iconify icon="mdi:pencil" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { formatDateOnly } from '@/utils/date'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
defineProps<{
  task: Activity
  clickable?: boolean
  showPreview?: boolean
}>()

// Emits
defineEmits<{
  'task-click': [task: Activity]
  'view-task': [task: Activity]
  'edit-task': [task: Activity]
  'complete-task': [taskId: string]
  'reopen-task': [taskId: string]
}>()

// Helper functions
function getStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Inconnu'

  switch (status) {
    case 'PENDING':
      return t('tasks.status.pending', 'En attente')
    case 'IN_PROGRESS':
      return t('tasks.status.inProgress', 'En cours')
    case 'COMPLETED':
      return t('tasks.status.completed', 'Terminée')
    case 'CANCELLED':
      return t('tasks.status.cancelled', 'Annulée')
    default:
      return status
  }
}

function getStatusBadgeClass(status: string | null | undefined): string {
  if (!status) return 'bg-gray-100 text-gray-800'

  switch (status) {
    case 'PENDING':
      return 'bg-gray-200 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityLabel(priority: string | null | undefined): string {
  if (!priority) return 'Normale'

  switch (priority) {
    case 'LOW':
      return t('tasks.priorityLevel.low', 'Basse')
    case 'MEDIUM':
      return t('tasks.priorityLevel.medium', 'Moyenne')
    case 'HIGH':
      return t('tasks.priorityLevel.high', 'Élevée')
    default:
      return priority
  }
}

function getPriorityBadgeClass(priority: string | null | undefined): string {
  if (!priority) return 'badge-info'

  switch (priority) {
    case 'LOW':
      return 'badge-info'
    case 'MEDIUM':
      return 'badge-warning'
    case 'HIGH':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

function getDueDateClass(dueDate: string | null | undefined): string {
  if (!dueDate) return 'text-gray-500'

  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  if (due < today) {
    return 'text-red-600 font-medium' // En retard
  } else if (due.getTime() === today.getTime()) {
    return 'text-orange-600 font-medium' // Aujourd'hui
  } else {
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    if (due.getTime() === tomorrow.getTime()) {
      return 'text-yellow-600' // Demain
    }
  }

  return 'text-gray-600'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
