<template>
  <div class="rounded-lg shadow-md p-6 mb-6 w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ t('tasks.title') }}</h2>
      <button class="btn btn-sm btn-outline" @click="openTaskModal(null)">
        <Iconify icon="mdi:plus" class="w-4 h-4" />
        {{ t('tasks.add') }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="tasks.length">
      <!-- Desktop Table -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>{{ t('common.title', 'Titre') }}</th>
              <th>{{ t('common.status', 'Statut') }}</th>
              <th>{{ t('tasks.dueDate') }}</th>
              <th>{{ t('tasks.priority') }}</th>
              <th class="w-16">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in tasks"
              :key="task.id"
              class="hover:bg-base-300"
              :class="{ 'cursor-pointer': clickable }"
              @click="handleTaskClick(task)"
            >
              <td>
                <div class="font-medium">{{ task.title }}</div>
                <div
                  v-if="task.content && showPreview"
                  class="text-sm text-gray-500 truncate max-w-xs"
                >
                  {{ task.content }}
                </div>
              </td>
              <td>
                <span
                  :class="getTaskStatusClass(task.taskStatus || '')"
                  class="px-2 py-1 text-xs rounded-full"
                >
                  {{ getTaskStatusLabel(task.taskStatus || '') }}
                </span>
              </td>
              <td>
                <span :class="getDueDateClass(task.dueDate || null)">
                  {{ task.dueDate ? formatDate(task.dueDate) : '-' }}
                </span>
              </td>
              <td>
                <span :class="getTaskPriorityClass(task.priority || '')" class="badge">
                  {{ getTaskPriorityLabel(task.priority || '') }}
                </span>
              </td>
              <td>
                <div class="flex space-x-1">
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
                    class="btn btn-sm btn-ghost"
                    @click.stop="openTaskModal(task)"
                    :title="t('common.edit')"
                  >
                    <Iconify icon="mdi:pencil" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="card bg-base-100 shadow-sm"
          :class="{ 'cursor-pointer hover:shadow-md transition-shadow': clickable }"
          @click="handleTaskClick(task)"
        >
          <div class="card-body p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium">{{ task.title }}</div>
              <div class="flex space-x-1">
                <button class="btn btn-sm btn-ghost" @click.stop="$emit('view-task', task)">
                  <Iconify icon="mdi:eye" class="w-4 h-4" />
                </button>
                <button
                  v-if="task.taskStatus !== 'COMPLETED'"
                  class="btn btn-sm btn-ghost text-success"
                  @click.stop="$emit('complete-task', task.id)"
                >
                  <Iconify icon="mdi:check" class="w-4 h-4" />
                </button>
                <button class="btn btn-sm btn-ghost" @click.stop="openTaskModal(task)">
                  <Iconify icon="mdi:pencil" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span
                :class="getTaskStatusClass(task.taskStatus || '')"
                class="px-2 py-1 text-xs rounded-full"
              >
                {{ getTaskStatusLabel(task.taskStatus || '') }}
              </span>
              <span :class="getTaskPriorityClass(task.priority || '')" class="badge">
                {{ getTaskPriorityLabel(task.priority || '') }}
              </span>
            </div>
            <div v-if="task.dueDate" class="text-sm" :class="getDueDateClass(task.dueDate || null)">
              {{ t('tasks.dueDate') }}: {{ formatDate(task.dueDate) }}
            </div>
            <div v-if="task.content && showPreview" class="text-sm text-gray-500 mt-2">
              {{ task.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <Iconify icon="mdi:format-list-checks" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{{ t('tasks.noTasks') }}</p>
      <button class="btn btn-sm btn-primary mt-2" @click="openTaskModal(null)">
        {{ t('tasks.add') }}
      </button>
    </div>

    <!-- Modal pour ajouter/modifier une tâche -->
    <dialog ref="taskModalRef" class="modal">
      <div class="modal-box max-w-xl">
        <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
          <Iconify
            :icon="isEditMode ? 'mdi:pencil' : 'mdi:plus-circle'"
            class="w-5 h-5 text-primary"
          />
          {{ isEditMode ? `Modifier : ${currentTask?.title}` : 'Nouvelle tâche' }}
        </h3>

        <TaskForm
          :task="currentTask"
          :isEditMode="isEditMode"
          :companyId="props.companyId"
          :companyName="props.companyName"
          :companyContacts="props.companyContacts"
          @submit="saveTask"
          @cancel="closeTaskModal"
        />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeTaskModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { TaskCreateDto, TaskUpdateDto } from '@/services/activity.service'
import type { Activity } from '@/types/activity.types'
import type { CompanyContact } from '@/types/company.types'
import { formatDate } from '@/utils/date'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TaskForm from './TaskForm.vue'

const { t } = useI18n()

// Props
const props = defineProps<{
  tasks: Activity[]
  loading?: boolean
  showPreview?: boolean
  clickable?: boolean
  // Nouvelles props pour le contexte d'entreprise
  companyId?: string
  companyName?: string
  companyContacts?: CompanyContact[]
}>()

// Emits - simplifié car on gère la création/édition en interne
const emit = defineEmits<{
  'view-task': [task: Activity]
  'complete-task': [taskId: string]
  'task-click': [task: Activity]
  'task-created': [task: TaskCreateDto] // Nouveau événement pour notifier la création
  'task-updated': [task: TaskUpdateDto & { id: string }] // Nouveau événement pour notifier la mise à jour
}>()

// État du modal
const taskModalRef = ref<HTMLDialogElement | null>(null)
const isEditMode = ref(false)
const currentTask = ref<Activity | null>(null)

// Ouvrir le modal pour ajouter/modifier une tâche
function openTaskModal(task: Activity | null) {
  currentTask.value = task
  isEditMode.value = !!task

  if (taskModalRef.value) {
    taskModalRef.value.showModal()
  }
}

// Fermer le modal
function closeTaskModal() {
  if (taskModalRef.value) {
    taskModalRef.value.close()
  }
  currentTask.value = null
  isEditMode.value = false
}

// Enregistrer une tâche (création ou modification)
function saveTask(formData: TaskCreateDto | TaskUpdateDto) {
  if (isEditMode.value && currentTask.value) {
    emit('task-updated', { ...formData, id: currentTask.value.id })
  } else {
    emit('task-created', formData as TaskCreateDto)
  }
  closeTaskModal()
}

function handleTaskClick(task: Activity) {
  emit('task-click', task)
}

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

function getDueDateClass(dueDate: string | null): string {
  if (!dueDate) return 'text-gray-500'

  const due = new Date(dueDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (due < today) {
    return 'text-red-600 font-medium' // Overdue
  } else if (due.toDateString() === today.toDateString()) {
    return 'text-orange-600 font-medium' // Due today
  } else if (due.toDateString() === tomorrow.toDateString()) {
    return 'text-yellow-600' // Due tomorrow
  }

  return 'text-gray-600'
}
</script>
