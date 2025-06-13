<template>
  <dialog :open="isOpen" class="modal">
    <div class="modal-box w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">{{ task?.title || t('tasks.details') }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Status -->
        <div class="form-control">
          <label class="label font-medium">{{ t('common.status') }}</label>
          <div>
            <span
              :class="getTaskStatusClass(task?.taskStatus || '')"
              class="px-3 py-1 rounded-full text-sm"
            >
              {{ getTaskStatusLabel(task?.taskStatus || '') }}
            </span>
          </div>
        </div>

        <!-- Priority -->
        <div class="form-control">
          <label class="label font-medium">{{ t('tasks.priority') }}</label>
          <div>
            <span :class="getTaskPriorityClass(task?.priority || '')" class="badge">
              {{ getTaskPriorityLabel(task?.priority || '') }}
            </span>
          </div>
        </div>

        <!-- Due Date -->
        <div class="form-control">
          <label class="label font-medium">{{ t('tasks.dueDate') }}</label>
          <div>{{ task?.dueDate ? formatDate(task.dueDate) : '-' }}</div>
        </div>

        <!-- Assigned To -->
        <div class="form-control">
          <label class="label font-medium">{{ t('common.assignedTo') }}</label>
          <div>
            {{
              task?.assignedTo
                ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                : t('common.notAssigned')
            }}
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="form-control mb-6">
        <label class="label font-medium">{{ t('common.description') }}</label>
        <div class="bg-base-200 p-3 rounded-lg min-h-[100px]">
          {{ task?.content || t('common.noDescription') }}
        </div>
      </div>

      <!-- Related info -->
      <div v-if="task?.Company || task?.Contact" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div v-if="task?.Company" class="form-control">
          <label class="label font-medium">{{ t('companies.title') }}</label>
          <div>{{ task.Company.name }}</div>
        </div>

        <div v-if="task?.Contact" class="form-control">
          <label class="label font-medium">{{ t('contacts.title') }}</label>
          <div>{{ task.Contact.firstName }} {{ task.Contact.lastName }}</div>
        </div>
      </div>

      <!-- Creation info -->
      <div class="text-sm text-gray-500 mt-4 border-t pt-4">
        <div>
          {{ t('common.createdBy', 'Créé par') }}: {{ task?.createdBy?.firstName }}
          {{ task?.createdBy?.lastName }}
        </div>
        <div>
          {{ t('common.createdAt', 'Créé le') }}:
          {{ task?.createdAt ? formatDate(task.createdAt) : '-' }}
        </div>
        <div>
          {{ t('common.updatedAt', 'Mis à jour le') }}:
          {{ task?.updatedAt ? formatDate(task.updatedAt) : '-' }}
        </div>
      </div>

      <!-- Actions buttons -->
      <div class="flex justify-end space-x-3 mt-6">
        <button type="button" class="btn btn-outline" @click="closeDialog">
          {{ t('common.close') }}
        </button>
        <button
          v-if="task?.taskStatus !== 'COMPLETED'"
          type="button"
          class="btn btn-primary"
          @click="completeTask"
        >
          {{ t('tasks.complete') }}
        </button>
        <button type="button" class="btn btn-outline btn-warning" @click="editTask">
          {{ t('common.edit') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">{{ t('common.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { formatDate } from '@/utils/date'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  task: Activity | null
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'complete', 'edit'])

// Helper functions for tasks
function getTaskStatusLabel(status: string): string {
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

function getTaskStatusClass(status: string): string {
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
      return 'bg-gray-100'
  }
}

function getTaskPriorityLabel(priority: string): string {
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

function getTaskPriorityClass(priority: string): string {
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

function completeTask() {
  if (props.task) {
    emit('complete', props.task.id)
  }
}

function editTask() {
  if (props.task) {
    emit('edit', props.task)
  }
}

function closeDialog() {
  emit('close')
}
</script>
